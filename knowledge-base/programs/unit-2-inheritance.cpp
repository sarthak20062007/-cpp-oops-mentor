#include <iostream>

struct Person {
    void identify() const { std::cout << "Person\n"; }
};

struct Employee : Person {};
struct Manager : Employee {};
struct Student : Person {};
struct Worker {
    void work() const { std::cout << "Working\n"; }
};
struct TeachingAssistant : Student, Worker {};

struct Device {
    int serial = 7;
};
struct Printer : virtual Device {};
struct Scanner : virtual Device {};
struct AllInOne : Printer, Scanner {};

struct Animal {
    virtual ~Animal() = default;
    virtual void sound() const { std::cout << "Animal sound\n"; }
};
struct Dog : Animal {
    void sound() const override { std::cout << "Dog barks\n"; }
};

int main() {
    Manager manager;
    manager.identify(); // Single and multilevel inheritance.

    Student student;    // Hierarchical inheritance from Person.
    student.identify();

    TeachingAssistant assistant; // Multiple inheritance.
    assistant.work();

    AllInOne machine; // Hybrid diamond; virtual base gives one Device subobject.
    std::cout << "Shared serial: " << machine.serial << '\n';

    Dog dog;
    Animal& animal = dog;
    animal.sound(); // Virtual overriding through a base reference.
}
