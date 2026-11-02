# Unit 1 — Fundamentals of Object-Oriented Programming

These are study questions based on the official Unit 1 topics, not predictions
or guarantees about an examination.

## 2-mark questions

1. **What is a class and what is an object?** A class is a user-defined type
   describing data and operations. An object is a concrete instance of that
   type with its own lifetime and non-static data.
2. **What is a function prototype?** A declaration that tells the compiler a
   function's name, return type, and parameter types before its definition is
   needed, for example `int add(int, int);`.

## 4-mark questions

1. **Differentiate a C++ `struct` and `class`.** Both can contain data,
   functions, constructors, access control, and inheritance. The language
   defaults differ: members and base inheritance are public in a `struct` and
   private in a `class`. These are defaults, not restrictions; either can
   declare `public`, `private`, or `protected` explicitly. The choice is mainly
   a convention: simple public aggregates often use `struct`, encapsulated
   interfaces often use `class`.
2. **Explain constructor and destructor.** A constructor initializes an object
   when it is created; it has the class name and no return type. A destructor
   runs when the object's lifetime ends; it is named `~ClassName`, takes no
   parameters, and cannot be overloaded. Constructors acquire/establish valid
   state; destructors release directly owned resources. Prefer RAII types such
   as `std::string` and smart pointers over manual cleanup.

## 6-mark questions

1. **Explain object memory and static members.** Each object stores its
   non-static data members; member functions are not copied into every object.
   A static data member has one class-level instance shared by all objects.
   `sizeof(Object)` includes implementation-required padding and may include
   virtual-dispatch bookkeeping, so it is not simply the sum of source-level
   member sizes. Static functions have no `this` pointer and can directly
   access only static members. Example: a static `count` can track live
   instances, incremented in constructors and decremented in destructors.
2. **Compare arrays and strings.** A built-in `T[N]` has fixed extent and
   contiguous elements; it does not carry its length when passed as a pointer.
   `std::array<T,N>` retains a compile-time size and container interface.
   `std::string` owns a resizable sequence of characters and safely manages its
   storage; a C string is a null-terminated character array. Prefer
   `std::string` for ordinary text and use bounds-aware access when indexing.

## 10-mark question

1. **Compare procedural and object-oriented programming and illustrate
   encapsulation.** Procedural design groups operations into functions and
   passes data between them; it suits small, algorithm-centered tasks but can
   make shared state harder to protect as a program grows. Object-oriented
   design groups state and operations into objects, allowing access control,
   abstraction, and reuse through composition or inheritance. Neither
   paradigm is universally superior; good C++ often combines free functions,
   value types, and classes. For a `BankAccount`, keep `balance` private,
   expose `deposit` and validated `withdraw`, and prevent callers from
   assigning an invalid balance directly. This localizes invariants and makes
   the public interface clearer. Mention that an object is an instance, a
   class is its type, and access labels express the intended interface.

## Viva

- **Can a constructor return a value?** No; constructors have no return type.
- **Can a static member function use `this`?** No; it is called for the class,
  not a particular object.
- **Is a friend function a member?** No. It is a non-member granted access by
  the class declaration.

## Multiple-choice questions

1. Which is the default member access in a `class`? **Answer: private.**
   `struct` defaults to public access.
2. Which member is shared by all instances? **Answer: a static data member.**
   Non-static data members belong to each object.

## Practical questions

- Implement a `Student` class with private marks, a constructor, and a
  validation member function.
- Add a static live-object counter and a friend function that computes a
  statistic without exposing the data publicly.

## Commonly confused

| Concepts | Difference |
|---|---|
| Declaration vs definition | Declaration introduces a name/type; definition provides the entity's implementation or storage. |
| `const` vs `constexpr` | `const` prevents modification through that name; `constexpr` additionally requires a constant-expression initializer where applicable. |
| Static vs non-static member | Static belongs to the class; non-static state belongs to each object. |
