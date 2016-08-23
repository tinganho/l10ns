
#include <string>

#ifndef L10NS_TYPES_H
#define L10NS_TYPES_H

using namespace std;

struct range {
    unsigned int start;
    unsigned int end;
};

enum syntax_kind {

    /// Grammar nodes
    variable,

    /// Punctuations
    opening_brace,
    closing_brace,
    comma,
};

struct node : range {
    syntax_kind kind;
};

struct diagnostic {
    string* message;
    node* node;
};

#endif //L10NS_TYPES_H
