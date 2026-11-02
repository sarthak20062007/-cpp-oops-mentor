import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { join } from "node:path";

const root = process.cwd();
const cases = [
  ["Explain Basic data types", "Official topic: Basic data types"],
  ["Explain Derived data types", "Official topic: Derived data types"],
  ["Explain Function prototype", "Official topic: Function prototype"],
  ["Explain Constructors and destructor", "Official topic: Constructors and destructor"],
  ["Explain Static members: variables and functions", "Official topic: Static members: variables and functions"],
  ["Explain Base class and derived class", "Official topic: Base class and derived class"],
  ["Explain Protected members", "Official topic: Protected members"],
  ["Explain Public and private inheritance", "Official topic: Public and private inheritance"],
  ["Explain Virtual base class", "Official topic: Virtual base class"],
  ["Explain Nested class", "Official topic: Nested class"],
  ["Explain Introduction to polymorphism", "Official topic: Introduction to polymorphism"],
  ["Explain Operator overloading", "Official topic: Operator overloading"],
  ["Explain Function overloading", "Official topic: Function overloading"],
  ["Explain Virtual function and its significance in C++", "Official topic: Virtual function and its significance in C++"],
  ["Explain Virtual destructor", "Official topic: Virtual destructor"],
  ["Explain Introduction to file handling", "Official topic: Introduction to file handling"],
  ["Explain Types of files", "Official topic: Types of files"],
  ["Explain Streams", "Official topic: Streams"],
  ["Explain Opening files", "Official topic: Opening files"],
  ["Explain File pointers and navigation", "Official topic: File pointers and navigation"],
  ["Explain Exception handling in C++", "Official topic: Exception handling in C++"],
  ["Explain Try-catch block", "Official topic: Try-catch block"],
  ["Explain Standard exceptions", "Official topic: Standard exceptions"],
  ["Explain Template variables", "Official topic: Template variables"],
  ["Explain Class templates", "Official topic: Class templates"],
  ["Explain STL containers", "Official topic: STL components"],
  ["Explain Vector", "Official topic: Vector"],
  ["Explain Map", "Official topic: Map"],
  ["Explain Unordered_map", "Official topic: Unordered_map"],
  ["Explain STL searching algorithms", "Official topic: STL searching algorithms"],
];

const upstreamBodies = [];
const mockOpenRouter = createServer(async (request, response) => {
  let body = "";
  for await (const chunk of request) body += chunk;
  const parsedBody = JSON.parse(body);
  upstreamBodies.push(parsedBody);
  const currentQuestion = parsedBody.messages.at(-1)?.content ?? "";
  if (currentQuestion.includes("simulate upstream rate limit")) {
    response.writeHead(429, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: { message: "rate limited" } }));
    return;
  }
  if (currentQuestion.includes("simulate unavailable model")) {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: { message: "model unavailable" } }));
    return;
  }
  response.writeHead(200, { "content-type": "application/json" });
  const content = currentQuestion.includes("simulate multipart response")
    ? [
        { type: "text", text: "Multipart " },
        { type: "text", text: "assistant answer" },
      ]
    : "Local mock response";
  response.end(
    JSON.stringify({
      id: "local-test",
      object: "chat.completion",
      created: 0,
      model: "test/mock",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          finish_reason: "stop",
        },
      ],
    }),
  );
});
mockOpenRouter.listen(0, "127.0.0.1");
await once(mockOpenRouter, "listening");
const upstreamPort = mockOpenRouter.address().port;

const portProbe = createServer();
portProbe.listen(0, "127.0.0.1");
await once(portProbe, "listening");
const appPort = portProbe.address().port;
await new Promise((resolve, reject) =>
  portProbe.close((error) => (error ? reject(error) : resolve())),
);

const app = spawn(
  process.execPath,
  [join(root, "node_modules/next/dist/bin/next"), "dev", "-p", String(appPort)],
  {
    cwd: root,
    env: {
      ...process.env,
      OPENROUTER_API_KEY: "local-retrieval-test-key",
      OPENROUTER_BASE_URL: `http://127.0.0.1:${upstreamPort}/api/v1`,
      OPENROUTER_MODEL: "test/mock",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let appOutput = "";
app.stdout.on("data", (chunk) => (appOutput += chunk.toString()));
app.stderr.on("data", (chunk) => (appOutput += chunk.toString()));

async function waitForApp() {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (app.exitCode !== null) throw new Error(`Next.js exited early:\n${appOutput}`);
    try {
      const response = await fetch(`http://127.0.0.1:${appPort}/api/chat`);
      if (response.status !== 404) return;
    } catch {
      await delay(350);
    }
  }
  throw new Error(`Timed out starting Next.js:\n${appOutput}`);
}

try {
  await waitForApp();
  for (const [index, [question, expected]] of cases.entries()) {
    const response = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": `local-retrieval-test-${index}`,
      },
      body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
    });
    if (!response.ok) {
      throw new Error(`Question failed (${response.status}): ${question}`);
    }
    const result = await response.json();
    if (result.message !== "Local mock response") {
      throw new Error(`Backend response contract mismatch for: ${question}`);
    }
    const prompt = upstreamBodies.at(-1)?.messages
      ?.filter((message) => message.role === "system")
      .map((message) => message.content)
      .join("\n");
    if (!prompt?.includes(expected)) {
      throw new Error(`Retrieval did not include "${expected}" for: ${question}`);
    }
  }

  const followUpResponse = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "local-retrieval-follow-up",
    },
    body: JSON.stringify({
      messages: [
        { role: "user", content: "Explain virtual functions" },
        { role: "assistant", content: "A virtual function uses dynamic dispatch." },
        { role: "user", content: "Explain that more simply" },
      ],
    }),
  });
  if (!followUpResponse.ok) throw new Error("Follow-up request failed.");
  const followUpPrompt = upstreamBodies.at(-1).messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");
  if (!followUpPrompt.includes("follow-up") || !followUpPrompt.includes("Official topic: Virtual function")) {
    throw new Error("Follow-up did not preserve the previous syllabus topic.");
  }

  const examResponse = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "local-retrieval-exam",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Give me a 6-mark answer on virtual functions" }],
    }),
  });
  if (!examResponse.ok) throw new Error("Exam-answer request failed.");
  const examPrompt = upstreamBodies.at(-1).messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");
  if (!examPrompt.includes("6-mark questions")) {
    throw new Error("Exam-answer request did not retrieve the unit exam material.");
  }

  const vivaResponse = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "local-retrieval-viva",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Give me important viva questions from Unit 5" }],
    }),
  });
  if (!vivaResponse.ok) throw new Error("Viva request failed.");
  const vivaPrompt = upstreamBodies.at(-1).messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");
  if (!vivaPrompt.includes("## Viva")) {
    throw new Error("Viva request did not retrieve the unit viva material.");
  }

  const programResponse = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "local-retrieval-program",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Write a program demonstrating inheritance" }],
    }),
  });
  if (!programResponse.ok) throw new Error("Program-generation request failed.");
  const programPrompt = upstreamBodies.at(-1).messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");
  if (!programPrompt.includes("Complete program: unit-2-inheritance.cpp") || !programPrompt.includes("struct Person")) {
    throw new Error("Program request did not retrieve the relevant complete C++ example.");
  }

  const debuggingResponse = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "local-retrieval-debug",
    },
    body: JSON.stringify({
      messages: [{
        role: "user",
        content: "Debug this C++ code: std::vector<int> values; return values[0];",
      }],
    }),
  });
  if (!debuggingResponse.ok) throw new Error("Debugging request failed.");
  const debuggingPrompt = upstreamBodies.at(-1).messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");
  if (!debuggingPrompt.includes("Official topic: Vector")) {
    throw new Error("Debugging request did not retrieve the related syllabus topic.");
  }

  const generalResponse = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "local-retrieval-general",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Explain std::optional in C++" }],
    }),
  });
  if (!generalResponse.ok) throw new Error("General C++ fallback request failed.");
  const generalPrompt = upstreamBodies.at(-1).messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");
  if (!generalPrompt.includes("No specific official syllabus topic matched")) {
    throw new Error("An out-of-syllabus question did not use the general fallback.");
  }

  const userScenarios = [
    "Hey",
    "What is C++?",
    "Explain constructors with an example.",
    "Explain inheritance from Unit 2.",
    "What is the difference between function overloading and overriding?",
    "Write a C++ program to reverse a string.",
    "Explain something outside my college syllabus.",
  ];
  for (const [index, content] of userScenarios.entries()) {
    const response = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": `local-scenario-${index}`,
      },
      body: JSON.stringify({ messages: [{ role: "user", content }] }),
    });
    const result = await response.json();
    if (!response.ok || typeof result.message !== "string" || !result.message.trim()) {
      throw new Error(`Scenario did not receive assistant text: ${content}`);
    }
  }

  const multipartResponse = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "local-multipart-response",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "simulate multipart response" }],
    }),
  });
  const multipartResult = await multipartResponse.json();
  if (!multipartResponse.ok || multipartResult.message !== "Multipart assistant answer") {
    throw new Error("Multipart provider text was not normalized to the frontend response contract.");
  }

  for (const [index, [content, expectedStatus, errorPart]] of [
    ["simulate upstream rate limit", 429, "rate-limiting"],
    ["simulate unavailable model", 502, "configured model"],
  ].entries()) {
    const response = await fetch(`http://127.0.0.1:${appPort}/api/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": `local-provider-error-${index}`,
      },
      body: JSON.stringify({ messages: [{ role: "user", content }] }),
    });
    const result = await response.json();
    if (response.status !== expectedStatus || !result.error?.includes(errorPart)) {
      throw new Error(`Provider error was not returned as a safe JSON error for: ${content}`);
    }
  }

  console.log(`Passed ${cases.length} syllabus topic routes, exam/viva/program/debug prompts, a contextual follow-up, general fallback, all seven requested scenarios, multipart provider text, rate-limit and unavailable-model errors using a local mock provider.`);
} finally {
  if (app.exitCode === null && app.signalCode === null) {
    app.kill("SIGTERM");
    await once(app, "exit");
  }
  await new Promise((resolve, reject) =>
    mockOpenRouter.close((error) => (error ? reject(error) : resolve())),
  );
}
