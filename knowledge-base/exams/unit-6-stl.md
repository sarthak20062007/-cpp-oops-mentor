# Unit 6 — Standard Template Library

Use these for practice, not as predictions or guarantees of exam questions.

## 2-mark questions

1. **Name four STL building blocks.** Containers, iterators, algorithms, and
   callable objects/function objects.
2. **What is an iterator?** An object that provides a container- or
   range-specific way to refer to and traverse elements.

## 4-mark questions

1. **Compare ordered and unordered associative containers.** `set`/`map`
   keep keys ordered by a comparator and typically provide logarithmic lookup.
   `unordered_set`/`unordered_map` use hashing, have no sorted iteration order,
   and offer average constant-time lookup with linear worst case. Hash keys
   must satisfy the hash/equality requirements.
2. **Differentiate `set` and `multiset`.** Both are ordered associative
   containers; `set` stores unique keys, while `multiset` permits equivalent
   keys. Both provide logarithmic search/insertion/erasure complexity.

## 6-mark questions

1. **Explain STL components and iterator use.** A container owns or organizes
   elements; an iterator denotes a position; algorithms operate on iterator
   ranges, conventionally `[first,last)`; callables customize operations.
   Example: `std::sort(v.begin(), v.end())`. The end iterator is a sentinel
   position and must not be dereferenced. Iterator invalidation rules vary by
   container and operation.
2. **Compare common sequence containers.** `array<T,N>` has fixed size and
   contiguous storage; `vector<T>` is resizable and contiguous with efficient
   amortized append; `deque<T>` supports efficient operations at both ends;
   `forward_list<T>` is singly linked and supports forward traversal with
   low per-node overhead. Choose according to access/insertion needs rather
   than assuming one is universally best.

## 10-mark question

1. **Explain STL containers, adapters, and algorithms with examples.** Classify
   sequence containers (`array`, `vector`, `deque`, `forward_list`), ordered
   associative containers (`set`, `multiset`, `map`, `multimap`), and
   unordered associative containers. A `queue` is a container adapter that
   exposes FIFO operations over an underlying sequence; it is not directly
   traversed with iterators. Algorithms consume iterator ranges: sort a
   sortable range before binary search, use `copy` with an output iterator
   such as `back_inserter`, and use `count` for matching values. Explain
   uniqueness, ordering, duplicate keys, average vs worst-case complexity,
   and iterator invalidation.

## Viva

- **Is `std::queue` a sequence container?** No; it is a container adapter.
- **Can `std::binary_search` be used on an unsorted range?** No; the range
  must be partitioned with respect to the searched value, normally sorted.
- **Does `unordered_map` iterate in sorted-key order?** No.

## Multiple-choice questions

1. Which container stores unique ordered keys? **Answer: `std::set`.**
2. Which algorithm counts matching elements? **Answer: `std::count`.**

## Practical questions

- Store unique marks in a `set` and map roll numbers to marks with `map`.
- Sort a vector, search for a value, copy it to another vector, and count a
  repeated value.

## Commonly confused

| Concepts | Difference |
|---|---|
| `map` vs `multimap` | Map keys are unique; multimap permits equivalent keys. |
| `vector` vs `deque` | Vector is contiguous; deque supports efficient insertion/removal at both ends but is not one contiguous allocation. |
| `queue` vs `deque` | Queue exposes restricted FIFO operations; deque is a general sequence container. |
