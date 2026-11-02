# Unit 3 — Polymorphism

Practice material only; no question is guaranteed to appear in an examination.

## 2-mark questions

1. **Define polymorphism.** The ability to use a common operation/interface
   with behavior that varies by overload or by the dynamic object type.
2. **What is a pure virtual function?** A virtual function declared with
   `= 0`, for example `virtual void draw() const = 0;`.

## 4-mark questions

1. **Compare compile-time and run-time polymorphism.** Overload resolution
   selects function/operator overloads from compile-time types and signatures.
   Virtual dispatch selects an override based on the dynamic type of an object
   accessed through a base pointer or reference. Compile-time examples include
   function and operator overloading; runtime examples use virtual functions.
2. **Why should a polymorphic base class have a virtual destructor?** Deleting
   a derived object through a base pointer when the base destructor is
   non-virtual has undefined behavior. A public virtual destructor ensures
   derived cleanup runs; a protected non-virtual destructor can instead
   prohibit deletion through the base interface.

## 6-mark questions

1. **Explain operator overloading rules with an example.** An operator
   overload is a function named `operator<symbol>` that defines meaningful
   behavior for a user-defined type. For example, `Complex operator+(const
   Complex&) const` returns a new value with summed real and imaginary parts.
   At least one operand must be a class or enumeration type. Overloading
   cannot change precedence, associativity, or operand count; operators such
   as `::`, `.`, `.*`, and `?:` cannot be overloaded. Preserve expected
   semantics and avoid surprising side effects.
2. **Describe a virtual table carefully.** Compilers commonly implement
   dynamic dispatch with per-type function-pointer tables and per-object
   bookkeeping, but the C++ standard does not mandate a vtable or its layout.
   A virtual call uses the object's dynamic type to select the final overrider.
   Explain the model as an implementation technique, not a portable object
   layout guarantee.

## 10-mark question

1. **Explain runtime polymorphism using an abstract base.** Declare a base
   interface with a pure virtual operation and virtual destructor. Derive
   concrete types that override the operation. Store or pass derived objects
   through base references/pointers; the call dispatches to the final
   overrider. Explain that an abstract class cannot be instantiated, but can
   have constructors, data, and implemented functions. A base pointer does
   not itself own an object; ownership must be managed, preferably with a
   suitable smart pointer. Include the virtual-destructor requirement and
   `override` for diagnostics.

## Viva

- **Can a static member function be virtual?** No; virtual dispatch requires
  an object and a `this` pointer.
- **Can an operator overload change precedence?** No.
- **Is a vtable required by the C++ standard?** No; it is a common
  implementation strategy.

## Multiple-choice questions

1. Which dispatch uses a dynamic object's type? **Answer: virtual dispatch.**
2. Which function may have no body in a concrete derived object? **Answer: a
   pure virtual function in an abstract base; a concrete derived type must
   provide a final overrider before it can be instantiated.**

## Practical questions

- Overload unary prefix `++` and binary `+` for a small value class.
- Create an abstract `Shape` interface and calculate areas through base
  pointers with safe destruction.

## Commonly confused

| Concepts | Difference |
|---|---|
| Pure virtual vs virtual | Both are virtual; `= 0` makes the function pure and the class abstract unless a final overrider exists. |
| Overload vs override | Overloads are resolved by signature; overrides replace virtual behavior in a derived object. |
| Base pointer type vs dynamic type | Static type controls accessible interface; dynamic type selects virtual overrides. |
