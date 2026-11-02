import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const syllabus = JSON.parse(
  readFileSync(
    join(root, "knowledge-base/syllabus/college-oops-syllabus.json"),
    "utf8",
  ),
);
const unitFiles = [
  "unit-1-fundamentals.md",
  "unit-2-inheritance.md",
  "unit-3-polymorphism.md",
  "unit-4-files-streams.md",
  "unit-5-exceptions-templates.md",
  "unit-6-stl.md",
];
const examFiles = [
  "unit-1-fundamentals.md",
  "unit-2-inheritance.md",
  "unit-3-polymorphism.md",
  "unit-4-files-streams.md",
  "unit-5-exceptions-templates.md",
  "unit-6-stl.md",
];
const requiredExamSections = [
  "2-mark questions",
  "4-mark questions",
  "6-mark questions",
  "10-mark question",
  "Viva",
  "Multiple-choice questions",
  "Practical questions",
  "Commonly confused",
];
const failures = [];
let topicCount = 0;
let topicsMissingDetailedNotes = 0;

if (syllabus.units.length !== 6) failures.push("Expected exactly six syllabus units.");
if (syllabus.totalDurationHours !== 42) failures.push("Expected a 42-hour syllabus.");

for (const [index, unit] of syllabus.units.entries()) {
  const expectedTopics = unit.sections.flatMap((section) =>
    section.topics.map((topic) => topic.name),
  );
  const guidePath = join(root, "knowledge-base/units", unitFiles[index]);
  const guide = readFileSync(guidePath, "utf8");
  const actualTopics = [...guide.matchAll(/^### (.+)$/gm)].map((match) => match[1]);
  if (JSON.stringify(actualTopics) !== JSON.stringify(expectedTopics)) {
    failures.push(`Unit ${unit.number} guide topic headings differ from the official syllabus.`);
  }

  for (const section of unit.sections) {
    for (const topic of section.topics) {
      topicCount += 1;
      if (topic.detailedMaterialStatus !== "complete") {
        topicsMissingDetailedNotes += 1;
      }
    }
  }

  const examPath = join(root, "knowledge-base/exams", examFiles[index]);
  const exam = readFileSync(examPath, "utf8");
  for (const section of requiredExamSections) {
    if (!exam.includes(`## ${section}`)) {
      failures.push(`Unit ${unit.number} exam pack is missing "${section}".`);
    }
  }
}

const programs = readdirSync(join(root, "knowledge-base/programs")).filter((file) =>
  file.endsWith(".cpp"),
);
if (programs.length < 7) failures.push("Expected the seven standalone practical programs.");
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${syllabus.units.length} units, ${topicCount} exact topic headings, ` +
      `${examFiles.length} exam packs, and ${programs.length} standalone programs.`,
  );
  console.log(
    `${topicsMissingDetailedNotes} topics are still marked as lacking complete reviewed teaching notes.`,
  );
}
