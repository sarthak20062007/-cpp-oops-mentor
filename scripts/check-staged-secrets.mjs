import { spawnSync } from "node:child_process";

const stagedResult = spawnSync(
  "git",
  ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"],
  { encoding: "utf8" },
);

if (stagedResult.error || stagedResult.status !== 0) {
  console.error("Unable to inspect staged files for secrets.");
  process.exit(1);
}

const stagedPaths = stagedResult.stdout.split("\0").filter(Boolean);
const findings = [];
const credentialPatterns = [
  /sk-or-v1-[A-Za-z0-9_-]{20,}/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}/,
  /\bauthorization\s*[:=]\s*["']Bearer\s+[A-Za-z0-9._~+/-]{16,}["']/i,
  /\b(?:api[_-]?key|secret(?:[_-]?key)?|access[_-]?token|password)\b\s*[:=]\s*(["'])(?!your\b|replace\b|example\b|placeholder\b|<)[^"'\r\n]{12,}\1/i,
];

for (const file of stagedPaths) {
  const isEnvironmentFile = /(^|\/)\.env(?:$|\.)/.test(file);
  if (isEnvironmentFile && file !== ".env.example") {
    findings.push({ file, line: 1 });
    continue;
  }

  const stagedFile = spawnSync("git", ["show", `:${file}`], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  if (stagedFile.error || stagedFile.status !== 0) {
    console.error(`Unable to inspect staged file: ${file}`);
    process.exitCode = 1;
    continue;
  }

  const lines = stagedFile.stdout.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (credentialPatterns.some((pattern) => pattern.test(lines[index]))) {
      findings.push({ file, line: index + 1 });
    }
  }
}

if (findings.length > 0) {
  console.error("Potential secrets detected in staged content (values redacted):");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Staged secret check passed (${stagedPaths.length} file(s)).`);
}
