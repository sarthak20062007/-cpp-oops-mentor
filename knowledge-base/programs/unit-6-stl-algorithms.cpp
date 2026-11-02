#include <algorithm>
#include <iostream>
#include <iterator>
#include <vector>

int main() {
    std::vector<int> values{5, 2, 4, 2, 1};
    std::sort(values.begin(), values.end());

    const auto found = std::binary_search(values.begin(), values.end(), 4);
    std::vector<int> copied;
    std::copy(values.begin(), values.end(), std::back_inserter(copied));
    const auto twos = std::count(copied.begin(), copied.end(), 2);

    std::cout << "Sorted:";
    for (int value : values) std::cout << ' ' << value;
    std::cout << "\nFound 4: " << (found ? "yes" : "no")
              << "\nCount of 2: " << twos << "\nCopied size: " << copied.size() << '\n';
}
