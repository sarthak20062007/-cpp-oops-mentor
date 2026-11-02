#include <array>
#include <deque>
#include <forward_list>
#include <iostream>
#include <map>
#include <queue>
#include <set>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

int main() {
    const std::array<int, 3> fixed{2, 4, 6};
    std::vector<int> values{1, 2, 3};
    values.push_back(4);
    std::deque<int> ends{2, 3};
    ends.push_front(1);
    ends.push_back(4);
    std::forward_list<int> linked{3, 2, 1};

    std::set<int> unique{3, 1, 3};
    std::multiset<int> repeated{3, 1, 3};
    std::map<std::string, int> marks{{"Asha", 90}};
    std::multimap<std::string, int> attempts{{"Ravi", 70}, {"Ravi", 82}};
    std::unordered_set<int> hashed{4, 4, 5};
    std::unordered_multiset<int> repeatedHashed{4, 4, 5};
    std::unordered_map<std::string, int> scores{{"Mina", 88}};
    std::unordered_multimap<std::string, int> scoreHistory{{"Dev", 72}, {"Dev", 80}};

    std::queue<int> line;
    line.push(10);
    line.push(20);

    int sum = 0;
    for (auto it = values.cbegin(); it != values.cend(); ++it) sum += *it;

    std::cout << "Array first: " << fixed.front() << '\n';
    std::cout << "Vector sum: " << sum << '\n';
    std::cout << "Deque ends: " << ends.front() << ',' << ends.back() << '\n';
    std::cout << "Forward list first: " << linked.front() << '\n';
    std::cout << "Set/multiset sizes: " << unique.size() << '/' << repeated.size() << '\n';
    std::cout << "Map mark: " << marks.at("Asha") << '\n';
    std::cout << "Multimap attempts: " << attempts.count("Ravi") << '\n';
    std::cout << "Unordered sizes: " << hashed.size() << '/' << repeatedHashed.size() << '\n';
    std::cout << "Unordered map score: " << scores.at("Mina") << '\n';
    std::cout << "Unordered multimap entries: " << scoreHistory.count("Dev") << '\n';
    std::cout << "Queue front: " << line.front() << '\n';
}
