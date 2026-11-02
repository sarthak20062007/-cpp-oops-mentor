# Unit 5 — Exception Handling and Templates

Questions support revision; they are not guaranteed examination questions.

## 2-mark questions

1. **What does `throw` do?** It creates/throws an exception object and begins
   stack unwinding toward a matching handler.
2. **What is a function template?** A parameterized function pattern from
   which the compiler can instantiate functions for suitable types.

## 4-mark questions

1. **Explain `try`, `throw`, and `catch`.** Put potentially failing code in a
   `try` block, use `throw expression` to report an exceptional condition, and
   provide compatible `catch` handlers. If no handler matches in the current
   function, the exception propagates outward while automatic objects are
   destroyed. Catch standard exceptions by `const` reference.
2. **Compare type and non-type template parameters.** A type parameter,
   declared with `typename` or `class`, represents a type such as `T`. A
   non-type template parameter represents an allowed compile-time value, such
   as `std::size_t N` in `std::array<T,N>`. The set of permitted parameter
   forms is version-dependent; modern C++ also supports class-type and
   `auto` non-type parameters under constraints.

## 6-mark questions

1. **Explain standard and custom exceptions.** Standard exceptions derive
   from `std::exception` and commonly provide `what()`. Throw specific
   standard types such as `std::invalid_argument` or `std::out_of_range` when
   they describe the failure. A custom type can derive from `std::runtime_error`
   to add domain meaning. Catch by `const std::exception&` when handling a
   family; order derived catches before base catches. Do not use exceptions
   for ordinary expected branching.
2. **Explain template argument deduction.** For function templates, deduction
   compares parameter patterns with call argument types and determines
   template arguments before overload resolution completes. It does not
   generally infer a template parameter solely from the function return type.
   Explicit template arguments can resolve cases where deduction cannot.
   Class template argument deduction (C++17) uses deduction guides, including
   implicit guides, to infer class template arguments from construction
   arguments.

## 10-mark question

1. **Discuss templates and exception safety in generic code.** A function
   template expresses an operation over compatible types; a class template
   parameterizes state/behavior; a variable template parameterizes a variable
   (C++14). Defaults can make arguments optional, non-type parameters can
   encode compile-time values, and deduction reduces explicit syntax. The
   operation still must be valid for each instantiated type. For exceptions,
   propagate errors with meaningful exception types and use RAII so resources
   are released during stack unwinding. Catch by reference, avoid swallowing
   exceptions, and document guarantees when generic operations can throw.

## Viva

- **Can a catch handler for `std::exception` catch derived standard exceptions?**
  Yes, when caught by `const std::exception&`.
- **Can function-template type usually be deduced from its return type?** No,
  not from the return type alone in ordinary function-call deduction.
- **When were variable templates introduced?** C++14.

## Multiple-choice questions

1. How should a polymorphic exception normally be caught? **Answer: by
   `const` reference.**
2. `template<class T, std::size_t N> ...` makes `N` a: **Answer: non-type
   template parameter.**

## Practical questions

- Validate input by throwing a custom exception derived from
  `std::runtime_error`.
- Implement `maximum<T>` and a fixed-capacity `Buffer<T,N>` class template.

## Commonly confused

| Concepts | Difference |
|---|---|
| `throw;` vs `throw e;` | Bare rethrow in a handler preserves the current exception; throwing `e` creates/throws a new exception object. |
| Template parameter vs function argument | Template arguments configure an instantiation; function arguments are runtime values. |
| `typename` vs `class` in type parameters | They are equivalent in a template parameter declaration; `typename` is also needed to disambiguate dependent types. |
