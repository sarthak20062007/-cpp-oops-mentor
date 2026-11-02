#include <iostream>
#include <string>
#include <utility>

class Student {
private:
    std::string name_;
    int mark_;
    inline static int count_ = 0;

public:
    Student(std::string name, int mark) : name_(std::move(name)), mark_(mark) {
        ++count_;
    }

    ~Student() { --count_; }

    void display() const { std::cout << name_ << ": " << mark_ << '\n'; }
    static int count() { return count_; }
    friend double average(const Student&, const Student&);
};

double average(const Student& first, const Student& second) {
    return (first.mark_ + second.mark_) / 2.0;
}

int main() {
    Student a("Asha", 84);
    Student b("Ravi", 92);
    a.display();
    b.display();
    std::cout << "Students: " << Student::count() << '\n';
    std::cout << "Average: " << average(a, b) << '\n';
}
