# Unit 2 — Inheritance

These are practice questions based on the supplied syllabus, not predictions of
exam questions.

## 2-mark questions

1. **What is a base class?** A class whose members or interface are inherited
   by another class.
2. **What is a protected member?** A member available to the class and its
   derived classes, but not ordinarily accessible through an unrelated
   outside object expression.

## 4-mark questions

1. **Name and explain inheritance forms.** Single: one base and one derived
   class; multilevel: a derived class becomes a base for another; hierarchical:
   multiple derived classes share a base; multiple: one derived class has
   multiple direct bases; hybrid: a combination of forms.
2. **Explain construction and destruction order.** Base subobjects are
   initialized before derived members and the derived constructor body.
   Destruction occurs in reverse order: derived destructor body, derived
   members, then base subobjects. Initialize bases in the member-initializer
   list; textual initializer order follows declaration order, not list order.

## 6-mark questions

1. **Compare public and private inheritance.** Public inheritance preserves
   public substitutability: public base members remain public, protected stay
   protected, and private base members remain inaccessible directly to the
   derived class. Private inheritance makes inherited public and protected
   members private in the derived interface. Public inheritance models an
   "is-a" relationship; private inheritance is an implementation technique
   and composition is often clearer. A derived class never gains direct access
   to a base class's private members.
2. **Explain ambiguity and the diamond problem.** If two bases provide a
   same-named member, an unqualified lookup in the derived class can be
   ambiguous; qualify it (`Left::print()`) or define a resolving member. In a
   diamond, two intermediate bases may each contain a copy of a common base.
   Virtual inheritance (`class Left : virtual public Base`) shares one base
   subobject; the most-derived class initializes that virtual base.

## 10-mark question

1. **Describe inheritance with access control, overriding, and a hierarchy.**
   Define a base class for common state/operations and derived classes for
   specialized behavior. Explain public/protected/private access conversion,
   note that private base data remains inaccessible directly, and show
   constructor order. A derived function only overrides a virtual base
   function when its signature matches; use `override` so the compiler catches
   mismatches. Distinguish overloading (same name, different parameter list)
   from overriding (derived replacement of a virtual function). Discuss the
   five structural forms and the diamond ambiguity/virtual-base remedy. Prefer
   public inheritance only when derived objects can honor the base contract.

## Viva

- **Are base constructors inherited automatically in every case?** No.
  Constructors are not ordinary inherited functions; `using Base::Base` can
  expose base constructors, subject to language rules.
- **Which class initializes a virtual base?** The most-derived class.
- **Does a derived class access a base's private member directly?** No; expose
  controlled protected/public operations if needed.

## Multiple-choice questions

1. Public inheritance changes an inherited public member to: **public.**
2. In a virtual diamond, the shared virtual base is initialized by: **the
   most-derived class.**

## Practical questions

- Build a diamond hierarchy and demonstrate the difference between ordinary
  and virtual inheritance.
- Override a virtual method and demonstrate base-pointer dispatch.

## Commonly confused

| Concepts | Difference |
|---|---|
| Overriding vs overloading | Override replaces a matching virtual behavior in a derived class; overloads differ by parameter lists. |
| Inheritance vs composition | Inheritance models substitutability; composition expresses a has-a implementation relationship. |
| Virtual base vs virtual function | Virtual inheritance shares a base subobject; virtual functions enable dynamic dispatch. |
