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
  "STL components": ["stl component", "containers algorithms iterators"],
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

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^a-z0-9+#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
      section.topics.map((title) => ({
        unit,
        section,
        title,
        aliases: TOPIC_ALIASES[title] ?? [],
      })),
    ),
  );
}

function formatUnit(unit: SyllabusUnit, selected?: Set<string>): string {
  const sections = unit.sections.map((section) => {
    const topics = section.topics.filter(
      (topic) => !selected || selected.has(`${unit.number}:${topic}`),
    );
    if (topics.length === 0) return "";
    return `### ${section.title}\n${topics.map((topic) => `- ${topic}`).join("\n")}`;
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
  const explicitUnits = getExplicitUnitNumbers(currentQuestion);

  const sourceNotice = `Official source: ${syllabus.college}, Department of ${syllabus.department}, Pattern ${syllabus.pattern}. The supplied syllabus totals ${syllabus.totalDurationHours} hours across ${syllabus.totalUnits} units. The JSON is the authoritative official topic list.`;

  if (explicitUnits.length > 0) {
    const units = syllabus.units.filter((unit) =>
      explicitUnits.includes(unit.number),
    );
    return [
      sourceNotice,
      "The student explicitly requested these complete official unit outlines:",
      ...units.map((unit) => formatUnit(unit)),
      "Treat the topic names above as the complete official scope supplied by the college. Do not add general topics to that official list.",
    ].join("\n\n");
  }

  const records = getTopicRecords();
  const searchText = currentQuestion;
  let matches = records.filter((record) =>
    [record.title, ...record.aliases].some((phrase) =>
      hasPhrase(searchText, phrase),
    ),
  );

  let usedPreviousContext = false;
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
    "Explain matched topics as syllabus topics. If adding useful material not listed above, label it clearly as supplementary general C++ knowledge rather than official syllabus content.",
  ].join("\n\n");
}
