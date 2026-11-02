#include <cstddef>
#include <iostream>
#include <stdexcept>
#include <string>

class InvalidMark : public std::runtime_error {
public:
    explicit InvalidMark(const std::string& message) : std::runtime_error(message) {}
};

template <typename T>
T larger(T first, T second) {
    return first < second ? second : first;
}

template <typename T, std::size_t Size>
class Box {
public:
    explicit Box(T value) : value_(value) {}
    T value() const { return value_; }
    static constexpr std::size_t capacity = Size;

private:
    T value_;
};

template <typename T>
constexpr T zero = T{0}; // Variable templates require C++14 or later.

int main() {
    try {
        const int mark = 105;
        if (mark < 0 || mark > 100) {
            throw InvalidMark("Mark must be between 0 and 100");
        }
    } catch (const InvalidMark& error) {
        std::cout << "Validation: " << error.what() << '\n';
    }

    std::cout << "Larger: " << larger(7, 11) << '\n';
    Box<int, 4> box(9); // C++17 class template argument deduction.
    std::cout << "Box: " << box.value() << ", capacity " << box.capacity << '\n';
    std::cout << "Double zero: " << zero<double> << '\n';
}
