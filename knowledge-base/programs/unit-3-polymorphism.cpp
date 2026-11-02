#include <iostream>
#include <memory>

class Complex {
public:
    int real;
    int imaginary;

    Complex(int r, int i) : real(r), imaginary(i) {}
    Complex operator+(const Complex& other) const {
        return {real + other.real, imaginary + other.imaginary};
    }
    Complex& operator++() {
        ++real;
        ++imaginary;
        return *this;
    }
};

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
};

class Rectangle final : public Shape {
public:
    Rectangle(double width, double height) : width_(width), height_(height) {}
    double area() const override { return width_ * height_; }

private:
    double width_;
    double height_;
};

int area(int side) { return side * side; }
double area(double radius) { return 3.14159 * radius * radius; }

int main() {
    const Complex sum = Complex(2, 3) + Complex(4, 1);
    std::cout << "Sum: " << sum.real << '+' << sum.imaginary << "i\n";

    Complex value(1, 2);
    ++value;
    std::cout << "After ++: " << value.real << '+' << value.imaginary << "i\n";

    std::cout << "Square area: " << area(4) << '\n';
    std::cout << "Circle area: " << area(2.0) << '\n';

    std::unique_ptr<Shape> shape = std::make_unique<Rectangle>(3, 5);
    std::cout << "Rectangle area: " << shape->area() << '\n';
}
