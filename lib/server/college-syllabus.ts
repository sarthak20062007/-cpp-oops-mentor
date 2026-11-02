import { readFileSync } from "node:fs";
import { join } from "node:path";
import syllabus from "@/knowledge-base/syllabus/college-oops-syllabus.json";
import type { ChatMessage } from "@/types/chat";

type Syllabus = typeof syllabus;
type SyllabusUnit = Syllabus["units"][number];
type SyllabusSection = SyllabusUnit["sections"][number];

interface SyllabusTopic {
  unit: SyllabusUnit;
  section: SyllabusSection;
  title: string;
  aliases: string[];
}

const UNIT_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
};

const TOPIC_ALIASES: Record<string, string[]> = {
  "Comparison between procedural programming paradigm and object-oriented programming paradigm":
    ["procedural vs object oriented", "procedural and oop", "programming paradigms"],
  "Basic data types": ["built-in data types", "primitive data types"],
  "Derived data types": ["derived types"],
  "Identifiers and variables": ["identifier", "variables"],
  "Concepts of an object and a class": ["objects and classes", "class and object", "class object concepts"],
  "Difference between structure and class": ["struct vs class", "structure vs class"],
  "Control structures": ["control statements", "decision and looping statements"],
  "Arrays and strings": ["array and string", "arrays", "strings"],
  "Function": ["functions", "function basics"],
  "Function prototype": ["function declaration", "function prototypes"],
  "Accessing function and utility function": ["utility function", "accessing functions"],
  "Constructors and destructor": ["constructor and destructor", "constructors", "destructor"],
  "Types of constructor": ["default constructor", "parameterized constructor", "copy constructor"],
  "Objects and memory requirements": ["object memory", "memory requirement of objects"],
  "Static members: variables and functions": ["static members", "static data member", "static member function"],
  "Inline function": ["inline functions"],
  "Friend function": ["friend functions"],
  "Base class and derived class": ["base and derived class", "base class", "derived class", "inheritance"],
  "Protected members": ["protected access specifier"],
  "Relationship between base class and derived class": ["base derived relationship"],
  "Constructor and destructor in derived class": ["derived class constructor", "derived class destructor"],
  "Overriding member functions": ["function overriding", "method overriding", "overriding"],
  "Class hierarchies": ["class hierarchy"],
  "Public and private inheritance": ["public inheritance", "private inheritance"],
  "Types of inheritance": ["single inheritance", "multiple inheritance", "multilevel inheritance", "hierarchical inheritance", "hybrid inheritance"],
  "Ambiguity in multiple inheritance": ["multiple inheritance ambiguity", "diamond problem", "ambiguity"],
  "Virtual base class": ["virtual base classes", "virtual inheritance"],
  "Abstract class": ["abstract classes"],
  "Friend class": ["friend classes"],
  "Nested class": ["nested classes", "inner class"],
  "Introduction to polymorphism": ["polymorphism"],
  "Types of polymorphism": ["compile time polymorphism", "runtime polymorphism", "run time polymorphism"],
  "Operator overloading": ["overload operators", "operator overload"],
  "Concept of overloading": ["overloading"],
  "Overloading unary operators": ["unary operator overloading", "unary operators"],
  "Overloading binary operators": ["binary operator overloading", "binary operators"],
  "Function overloading": ["overloaded functions"],
  "Run-time polymorphism": ["runtime polymorphism", "dynamic polymorphism"],
  "Pointers to base class": ["base class pointer", "base pointers"],
  "Virtual function and its significance in C++": ["virtual functions", "virtual function", "dynamic dispatch"],
  "Pure virtual function": ["pure virtual functions"],
  "Virtual table": ["vtable", "virtual tables"],
  "Virtual destructor": ["virtual destructors"],
  "Abstract base class": ["abstract base classes"],
  "Introduction to file handling": ["file handling", "file input output"],
  "Types of files": ["text and binary files", "file types"],
  "Streams": ["iostream streams", "input output streams"],
  "Header files": ["header file", "include files"],
  "File operations": ["file operation"],
  "Opening files": ["open a file", "file opening"],
  "Reading from files": ["read a file", "file reading"],
  "Writing to files": ["write a file", "file writing"],
  "File pointers and navigation": ["file pointer", "seekg", "seekp", "tellg", "tellp"],
  "Error handling": ["file error handling", "stream error states"],
  "Exception handling in C++": ["exception handling", "exceptions"],
  "Try-catch block": ["try catch", "try block", "catch block"],
  "Throwing exceptions": ["throw exception", "throwing an exception"],
  "Built-in types": ["built in exception types", "throwing built in types"],
  "Standard exceptions": ["std exceptions", "std::exception"],
  "Custom exceptions": ["user defined exceptions", "custom exception"],
  "Define templates": ["template definition", "templates"],
  "Template variables": ["template variable"],
  "Default template arguments": ["default template parameter"],
  "Template non-type arguments": ["non type template parameter", "non-type template parameter"],
  "Template argument deduction": ["template deduction"],
  "Function template argument deduction": ["function template deduction"],
  "Class templates": ["class template"],
  "Variable templates": ["variable template"],
  "Basic concepts of STL": ["stl", "standard template library"],
  "STL components": ["stl component", "stl containers", "containers", "algorithms and iterators"],
  "STL iterators": ["iterator", "iterators"],
  "Container adapters": ["container adaptor", "stack queue priority queue"],
  "Array": ["std::array"],
  "Vector": ["std::vector", "vectors"],
  "Queue": ["std::queue", "queues"],
  "Deque": ["std::deque", "double ended queue"],
  "Forward_list": ["forward list", "std::forward_list"],
  "Set": ["std::set", "sets"],
  "Multiset": ["std::multiset", "multisets"],
  "Map": ["std::map", "maps"],
  "Multimap": ["std::multimap", "multimaps"],
  "Unordered_set": ["unordered set", "std::unordered_set"],
  "Unordered_multiset": ["unordered multiset", "std::unordered_multiset"],
  "Unordered_map": ["unordered map", "std::unordered_map"],
  "Unordered_multimap": ["unordered multimap", "std::unordered_multimap"],
  "Applications of STL": ["stl applications"],
  "STL sorting algorithms": ["stl sort", "std::sort", "sorting algorithms"],
  "STL searching algorithms": ["stl search", "std::find", "searching algorithms"],
  "STL copying algorithms": ["stl copy", "std::copy", "copying algorithms"],
  "STL counting algorithms": ["stl count", "std::count", "counting algorithms"],
};

const UNIT_GUIDES: Record<number, string> = {
  1: "unit-1-fundamentals.md",
  2: "unit-2-inheritance.md",
  3: "unit-3-polymorphism.md",
  4: "unit-4-files-streams.md",
  5: "unit-5-exceptions-templates.md",
  6: "unit-6-stl.md",
};

const UNIT_EXAMS: Record<number, string> = {
  1: "unit-1-fundamentals.md",
  2: "unit-2-inheritance.md",
  3: "unit-3-polymorphism.md",
  4: "unit-4-files-streams.md",
  5: "unit-5-exceptions-templates.md",
  6: "unit-6-stl.md",
};

const UNIT_PROGRAMS: Record<number, string[]> = {
  1: ["unit-1-classes-and-members.cpp"],
  2: ["unit-2-inheritance.cpp"],
  3: ["unit-3-polymorphism.cpp"],
  4: ["unit-4-file-streams.cpp"],
  5: ["unit-5-exceptions-templates.cpp"],
  6: ["unit-6-stl-containers.cpp", "unit-6-stl-algorithms.cpp"],
};

const MAX_RETRIEVED_MATERIAL_CHARS = 12_000;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^a-z0-9+#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTopicMaterial(unitNumber: number, topicName: string): string {
  const filename = UNIT_GUIDES[unitNumber];
  if (!filename) return "";

  const guide = readFileSync(
    join(process.cwd(), "knowledge-base", "units", filename),
    "utf8",
  );
  const lines = guide.split(/\r?\n/);
  const heading = `### ${topicName}`;
  const start = lines.indexOf(heading);
  if (start < 0) return "";

  const end = lines.findIndex(
    (line, index) => index > start && /^#{1,3} /.test(line),
  );
  return lines
    .slice(start, end < 0 ? lines.length : end)
    .join("\n")
    .slice(0, MAX_RETRIEVED_MATERIAL_CHARS);
}

function isFollowUp(text: string): boolean {
  return /\b(this|that|it|simpler|another example|line by line|previous program|explain more|continue)\b/i.test(
    text,
  );
}

function getLearningIntent(text: string): string | null {
  if (/\b(viva|oral questions?)\b/i.test(text)) return "viva";
  if (/\b(multiple.choice|mcq|quiz|test my knowledge)\b/i.test(text)) return "quiz";
  if (/\b(practical|program|code|example|programming question|coding question)\b/i.test(text)) return "practical";
  if (/\b(exam|marks?|important questions?)\b/i.test(text)) return "exam";
  return null;
}

function getExamMaterial(unitNumber: number): string {
  const filename = UNIT_EXAMS[unitNumber];
  if (!filename) throw new Error(`Unknown syllabus unit ${unitNumber}`);
  return readFileSync(
    join(process.cwd(), "knowledge-base", "exams", filename),
    "utf8",
  ).slice(0, MAX_RETRIEVED_MATERIAL_CHARS);
}

function getPracticalMaterial(unitNumber: number): string {
  const filenames = UNIT_PROGRAMS[unitNumber];
  if (!filenames) throw new Error(`Unknown syllabus unit ${unitNumber}`);
  const guide = readFileSync(
    join(process.cwd(), "knowledge-base", "programs", "README.md"),
    "utf8",
  );
  const lines = guide.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(`## Unit ${unitNumber} `));
  if (start < 0) return "";
  const end = lines.findIndex(
    (line, index) => index > start && line.startsWith("## Unit "),
  );
  const introduction = lines
    .slice(start, end < 0 ? lines.length : end)
    .join("\n")
    .slice(0, MAX_RETRIEVED_MATERIAL_CHARS);
  const programs = filenames.map((filename) => {
    const source = readFileSync(
      join(process.cwd(), "knowledge-base", "programs", filename),
      "utf8",
    );
    return `### Complete program: ${filename}\n\`\`\`cpp\n${source}\n\`\`\``;
  });
  return [introduction, ...programs].join("\n\n");
}

function formatTopicMaterial(unit: SyllabusUnit, topics: string[]): string {
  const material = topics
    .map((topic) => getTopicMaterial(unit.number, topic))
    .filter(Boolean);
  return material.length
    ? `Retrieved topic teaching material:\n${material.join("\n\n")}`
    : "";
}

function hasPhrase(text: string, phrase: string): boolean {
  const normalizedText = ` ${normalize(text)} `;
  const normalizedPhrase = normalize(phrase);
  return normalizedPhrase.length > 0 && normalizedText.includes(` ${normalizedPhrase} `);
}

function getExplicitUnitNumbers(text: string): number[] {
  const numbers = new Set<number>();
  const unitPattern =
    /\bunit\s*(?:number|no\.?)?\s*[-:#]?\s*(1|2|3|4|5|6|one|two|three|four|five|six)\b/gi;

  for (const match of text.matchAll(unitPattern)) {
    const value = match[1].toLowerCase();
    numbers.add(Number(value) || UNIT_WORDS[value]!);
  }
  return [...numbers];
}

function getTopicRecords(): SyllabusTopic[] {
  return syllabus.units.flatMap((unit) =>
    unit.sections.flatMap((section) =>
      section.topics.map((topic) => ({
        unit,
        section,
        title: topic.name,
        aliases: TOPIC_ALIASES[topic.name] ?? [],
      })),
    ),
  );
}

function formatUnit(unit: SyllabusUnit, selected?: Set<string>): string {
  const sections = unit.sections.map((section) => {
    const topics = section.topics.filter(
      (topic) => !selected || selected.has(`${unit.number}:${topic.name}`),
    );
    if (topics.length === 0) return "";
    return `### ${section.title}\n${topics
      .map((topic) =>
        [
          `- Official topic: ${topic.name}`,
          `  - Description: ${topic.description}`,
          `  - Related C++ concepts: ${topic.relatedConcepts.join(", ")}`,
          `  - Difficulty: ${topic.difficulty} (provisional estimate; not specified by the college)`,
          `  - Detailed teaching material: ${topic.detailedMaterialStatus}`,
        ].join("\n"),
      )
      .join("\n")}`;
  });

  return [
    `## Unit ${unit.number}: ${unit.title} (${unit.durationHours} hours)`,
    ...sections.filter(Boolean),
  ].join("\n");
}

export function retrieveCollegeSyllabusContext(
  messages: Array<Pick<ChatMessage, "role" | "content">>,
): string {
  const userMessages = messages
    .filter((message) => message.role === "user")
    .slice(-4);
  const currentQuestion = userMessages.at(-1)?.content ?? "";
  let topicQuestion = currentQuestion;
  let usedPreviousContext = false;
  if (isFollowUp(currentQuestion) && userMessages.length > 1) {
    topicQuestion = userMessages.at(-2)?.content ?? currentQuestion;
    usedPreviousContext = true;
  }
  const explicitUnits = getExplicitUnitNumbers(topicQuestion);

  const sourceNotice = `Official source: ${syllabus.college}, Department of ${syllabus.department}, Pattern ${syllabus.pattern}. The supplied syllabus totals ${syllabus.totalDurationHours} hours across ${syllabus.totalUnits} units. The JSON topic names are the authoritative official topic list. Descriptions, related concepts, and difficulty estimates are project-created organizational metadata, not college-provided statements.`;

  if (explicitUnits.length > 0) {
    const units = syllabus.units.filter((unit) =>
      explicitUnits.includes(unit.number),
    );
    const intent = getLearningIntent(currentQuestion);
    return [
      sourceNotice,
      "The student explicitly requested these complete official unit outlines:",
      ...units.map((unit) => formatUnit(unit)),
      ...units.map((unit) =>
        formatTopicMaterial(
          unit,
          unit.sections.flatMap((section) => section.topics.map((topic) => topic.name)),
        ),
      ),
      ...(intent === "exam" || intent === "viva" || intent === "quiz"
        ? units.map((unit) => getExamMaterial(unit.number))
        : []),
      ...(intent === "practical"
        ? units.map((unit) => getPracticalMaterial(unit.number))
        : []),
      intent
        ? `The student requested ${intent} preparation. Provide original study help at the requested level; do not claim questions are guaranteed to appear.`
        : "",
      usedPreviousContext
        ? "This is a conversational follow-up. Answer its requested style or depth while preserving the previous learning topic."
        : "",
      "Treat the topic names above as the complete official scope supplied by the college. Do not add general topics to that official list.",
    ].join("\n\n");
  }

  const records = getTopicRecords();
  const searchText = topicQuestion;
  let matches = records.filter((record) =>
    [record.title, ...record.aliases].some((phrase) =>
      hasPhrase(searchText, phrase),
    ),
  );

  if (matches.length === 0 && userMessages.length > 1) {
    const previousQuestions = userMessages.slice(0, -1).reverse();
    for (const previous of previousQuestions) {
      matches = records.filter((record) =>
        [record.title, ...record.aliases].some((phrase) =>
          hasPhrase(previous.content, phrase),
        ),
      );
      if (matches.length > 0) {
        usedPreviousContext = true;
        break;
      }
    }
  }

  if (matches.length === 0) {
    return [
      sourceNotice,
      usedPreviousContext
        ? "The latest question is a follow-up. Use the recent conversation as context, but no exact official topic could be recovered."
        : "",
      "No specific official syllabus topic matched the current question. Answer using general C++ knowledge. Do not claim that a general topic is part of this college syllabus without an exact match in the official topic list.",
    ].join("\n\n");
  }

  const selectedUnits = [...new Set(matches.map((match) => match.unit.number))];
  const selectedTopics = new Map<number, Set<string>>();
  for (const match of matches) {
    const topics = selectedTopics.get(match.unit.number) ?? new Set<string>();
    topics.add(`${match.unit.number}:${match.title}`);
    selectedTopics.set(match.unit.number, topics);
  }

  return [
    sourceNotice,
    usedPreviousContext
      ? "The latest question is a follow-up; use the prior user question to retain its official syllabus topic."
      : "Official syllabus topics matched to the current question:",
    ...selectedUnits.map((number) =>
      formatUnit(
        syllabus.units.find((unit) => unit.number === number)!,
        selectedTopics.get(number),
      ),
    ),
    ...selectedUnits.map((number) =>
      formatTopicMaterial(
        syllabus.units.find((unit) => unit.number === number)!,
        [...(selectedTopics.get(number) ?? [])].map((key) =>
          key.slice(`${number}:`.length),
        ),
      ),
    ),
    ...(selectedUnits.flatMap((number) => {
      const intent = getLearningIntent(currentQuestion);
      if (intent === "exam" || intent === "viva" || intent === "quiz") {
        return [getExamMaterial(number)];
      }
      if (intent === "practical") return [getPracticalMaterial(number)];
      return [];
    })),
    getLearningIntent(currentQuestion)
      ? `The student requested ${getLearningIntent(currentQuestion)} preparation. Match requested answer depth and label supplementary knowledge clearly.`
      : "",
    usedPreviousContext
      ? "This is a conversational follow-up. Answer its requested style or depth while preserving the previous learning topic."
      : "",
    "Explain matched topics as syllabus topics. If adding useful material not listed above, label it clearly as supplementary general C++ knowledge rather than official syllabus content.",
  ].join("\n\n");
}
