# Unit 4 — Files and Streams

These are learning questions, not a guarantee of examination content.

## 2-mark questions

1. **What is a stream?** An abstraction representing a sequence of input or
   output characters/data and the state of the I/O operation.
2. **Name file stream classes.** `std::ifstream` reads, `std::ofstream` writes,
   and `std::fstream` supports both directions when opened with suitable modes.

## 4-mark questions

1. **Differentiate text and binary files.** Text I/O formats values as
   characters and may perform implementation-defined text translations.
   Binary I/O transfers bytes without formatted representation. Binary bytes
   of arbitrary C++ objects are not automatically portable or safe to persist:
   pointers, padding, endianness, and object invariants matter.
2. **Explain common open modes.** `in` enables reading, `out` enables
   writing, `app` sends writes to the end, `ate` initially positions at the
   end, `trunc` discards existing contents, and `binary` requests binary mode.
   Combine flags with `|`; check the stream after opening.

## 6-mark questions

1. **Explain file reading and error checking.** Construct an `ifstream` with
   a path and test it before reading. Use `getline` for lines or formatted
   extraction for typed fields. Prefer `while (std::getline(file, line))` to
   `while (!file.eof())`; EOF is generally set only after a read fails.
   Distinguish `good`, `eof`, `fail`, and `bad`; clear state before reusing a
   failed stream or seeking when appropriate. Close explicitly when useful;
   RAII closes it at scope exit.
2. **Explain file positioning.** `tellg`/`seekg` inspect and reposition the
   get (input) position; `tellp`/`seekp` do the same for put (output). Seek
   using `beg`, `cur`, or `end`. Check stream state after positioning; byte
   offsets and text-mode positions are not universally interchangeable.

## 10-mark question

1. **Describe a reliable text-file write/read workflow.** Include `<fstream>`,
   create an `ofstream`, check open/write state, write records using insertion
   or `write`, and allow it to close before reopening. Create an `ifstream`,
   check it, then read line-by-line with `getline` or parse fields with
   extraction. Test each operation rather than assuming success. Explain
   paths, permissions, missing files, stream state flags, and RAII. If random
   access is required, use the correct get/put position and reset error state
   before seeking. Avoid raw object dumps for portable persistence.

## Viva

- **When does `eof()` become true?** Usually after an input operation attempts
  to read beyond available input, not merely when positioned at the last byte.
- **What is the difference between `app` and `ate`?** `app` directs every
  write to the end; `ate` seeks to end initially but later positioning may
  change where writes occur.
- **Which header declares `std::ifstream`?** `<fstream>`.

## Multiple-choice questions

1. Which class is used for input file streams? **Answer: `std::ifstream`.**
2. The preferred line-reading loop is: **Answer: `while (std::getline(in,
   line))`.**

## Practical questions

- Write a text file, read it back line by line, and report open/read errors.
- Reopen a file, use `seekg` and `tellg`, and explain the stream state.

## Commonly confused

| Concepts | Difference |
|---|---|
| `eof()` vs successful read | Check the read operation; EOF may only be set by a failed attempt past the end. |
| `app` vs `ate` | Appending forces writes to end; ate only starts positioned there. |
| Formatted vs binary I/O | Formatted I/O converts values to text; binary I/O transfers bytes and needs an explicit portable format for durable data. |
