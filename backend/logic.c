#include <string.h>

// Compares the user's answer with the correct one
int validate_answer(const char* user_answer) {
    const char* correct = "H2O";
    return strcmp(user_answer, correct) == 0 ? 1 : 0;
}
