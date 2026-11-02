# College syllabus knowledge base

## Source of truth

[`syllabus/college-oops-syllabus.json`](./syllabus/college-oops-syllabus.json)
is the exact supplied 2025 syllabus: institution, department, 42-hour duration,
six units, section ordering, and official topic names. Preserve its wording and
order when editing. Retrieval aliases belong in server code; they must never be
added to the official topic list.

The six files under [`units/`](./units/) mirror that official scope. They are
coverage outlines, not college-authored lecture notes. Every topic currently
states that detailed notes have not yet been authored; do not present generated
general C++ explanations as official college material.

## Chat retrieval

`lib/server/college-syllabus.ts` imports the JSON source, recognizes explicit
unit requests and topic aliases, and builds the context for `/api/chat`.
Requests naming a unit retrieve its complete official outline. Topic requests
retrieve matching official entries. Follow-up questions reuse a recent user
topic when the follow-up itself does not name one. Unmatched C++ questions are
answered as general C++ knowledge; the model is instructed not to mislabel that
material as college syllabus coverage.

The OpenRouter key and syllabus data remain server-side. No syllabus content
is embedded in the React components.

## Expanding teaching material

Copy [`units/TOPIC-NOTE-TEMPLATE.md`](./units/TOPIC-NOTE-TEMPLATE.md) for a
topic and retain its exact JSON topic name. Add reviewed definitions,
explanations, syntax, examples, complete programs and expected outputs,
important points, common mistakes, exam questions, and viva questions.
Keep college-provided material clearly sourced; label supplemental C++ material
as general knowledge rather than an official syllabus statement.

## Future progress features

Keep student progress separate from the official syllabus. A future progress
store can key completion and practice records by `unit.id` and an exact topic
name, then associate those records with a user or conversation without changing
the syllabus JSON.
