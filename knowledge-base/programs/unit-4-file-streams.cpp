#include <cstdio>
#include <fstream>
#include <iostream>
#include <string>

int main() {
    const std::string path = "cpp-mentor-file-demo.txt";
    {
        std::ofstream output(path);
        if (!output) {
            std::cerr << "Could not open output file\n";
            return 1;
        }
        output << "C++ streams\nSecond line\n";
    }

    std::ifstream input(path);
    if (!input) {
        std::cerr << "Could not open input file\n";
        return 1;
    }

    std::string line;
    std::getline(input, line);
    std::cout << "First line: " << line << '\n';

    input.clear(); // Clear eof/fail state before repositioning.
    input.seekg(0, std::ios::beg);
    char firstCharacter = '\0';
    input.get(firstCharacter);
    std::cout << "First character: " << firstCharacter << '\n';

    input.close();
    if (std::remove(path.c_str()) != 0) {
        std::cerr << "Could not remove demonstration file\n";
        return 1;
    }
}
