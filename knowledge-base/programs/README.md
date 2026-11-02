# Practical C++ program collection

These are standalone teaching examples, not guaranteed examination questions.
Compile each from the repository root with:

```sh
clang++ -std=c++17 -Wall -Wextra -pedantic knowledge-base/programs/<file>.cpp -o /tmp/cpp-mentor-example
/tmp/cpp-mentor-example
```

The file-I/O example creates and removes its demonstration file. Expected
outputs below assume a successful run.

## Unit 1 — Classes and members

[`unit-1-classes-and-members.cpp`](./unit-1-classes-and-members.cpp) uses a
parameterized constructor, destructor, an inline static data member, a static
member function, and a friend function. `Student` owns each object's name and
mark; the shared count belongs to the class. The friend can read private marks
to calculate an average.

```text
Asha: 84
Ravi: 92
Students: 2
Average: 88
```

## Unit 2 — Inheritance forms and overriding

[`unit-2-inheritance.cpp`](./unit-2-inheritance.cpp) demonstrates single,
multilevel, hierarchical, multiple, and hybrid inheritance. The diamond's
`Printer` and `Scanner` virtually inherit `Device`, so `AllInOne` contains one
shared `Device` base subobject. It also overrides `Animal::sound` and calls it
through a base reference.

```text
Person
Person
Working
Shared serial: 7
Dog barks
```

## Unit 3 — Overloading and runtime polymorphism

[`unit-3-polymorphism.cpp`](./unit-3-polymorphism.cpp) overloads `area` by
parameter type, overloads binary `+` and prefix `++` for `Complex`, and
demonstrates a pure-virtual `Shape` interface implemented by `Rectangle`.
Deleting the object through `unique_ptr<Shape>` is safe because the base
destructor is virtual.

```text
Sum: 6+4i
After ++: 2+3i
Square area: 16
Circle area: 12.5664
Rectangle area: 15
```

## Unit 4 — File streams, navigation, and errors

[`unit-4-file-streams.cpp`](./unit-4-file-streams.cpp) checks stream-open
failures, writes text with `ofstream`, reads a line with `getline`, clears the
input state, seeks to the beginning, reads a character, closes the stream, and
removes the temporary file.

```text
First line: C++ streams
First character: C
```

## Unit 5 — Exceptions and templates

[`unit-5-exceptions-templates.cpp`](./unit-5-exceptions-templates.cpp) throws
and catches a custom `runtime_error`, uses a deduced function-template argument,
defines a class template with a non-type argument and a C++17 deduction guide
provided by the constructor, and declares a C++14 variable template.

```text
Validation: Mark must be between 0 and 100
Larger: 11
Box: 9, capacity 4
Double zero: 0
```

## Unit 6 — Containers, iterators, and algorithms

[`unit-6-stl-containers.cpp`](./unit-6-stl-containers.cpp) introduces the
sequence, ordered associative, unordered associative containers, a container
adapter, and iterator traversal. Hash container iteration order is intentionally
not printed because it is unspecified.

```text
Array first: 2
Vector sum: 10
Deque ends: 1,4
Forward list first: 3
Set/multiset sizes: 2/3
Map mark: 90
Multimap attempts: 2
Unordered sizes: 2/3
Unordered map score: 88
Unordered multimap entries: 2
Queue front: 10
```

[`unit-6-stl-algorithms.cpp`](./unit-6-stl-algorithms.cpp) uses sorting,
binary search on sorted input, copying into a vector through a back inserter,
and counting matching values.

```text
Sorted: 1 2 2 4 5
Found 4: yes
Count of 2: 2
Copied size: 5
```

## Line-by-line learning

Read each example from its includes downward. Includes provide the declarations
used by the program; class declarations define state and behavior; `main`
constructs objects or containers and calls the operations being demonstrated.
Comments identify the lines illustrating a particular syllabus concept.
Students can ask the mentor to explain a named file or a pasted line range in
more detail.
