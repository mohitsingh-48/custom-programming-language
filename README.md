# Custom Language Compiler

A web-based compiler that translates code written in a simple custom programming language into multiple target programming languages (JavaScript, Python, C++, Java, and C).

## Features

- **Simple Custom Language Syntax:**
  - `maano` - Variable declaration
  - `likho` - Print statement
  - `agar` - If condition
  - `warna` - Else statement
  - `jabtak` - While loop

- **Multi-Language Support:**
  - JavaScript (with live execution)
  - Python
  - C++
  - Java
  - C

- **Interactive Web Interface:**
  - Real-time code conversion
  - Live output for JavaScript execution
  - Syntax highlighting
  - Modern, responsive design

## Example Code

Here are some examples of how to use the custom language:

### 1. Basic Variable Declaration and Printing
```
maano x = 5
likho x
```

### 2. Arithmetic Operations
```
maano first = 10
maano second = 20
maano sum = first + second
likho "Sum of two numbers is:"
likho sum
```

### 3. Conditional Statements
```
maano x = 5
maano y = 10
agar x < y {
    likho "x is less than y"
} warna {
    likho "x is greater than or equal to y"
}
```

### 4. Loops
```
maano a = 0
jabtak a < 5 {
    likho a
    a = a + 1
}
```

## How to Use

1. Open `index1.html` in a web browser
2. Write your code in the custom language syntax in the textarea
3. Select your target programming language from the dropdown
4. Click "Run Code" to:
   - See the converted code in your chosen programming language
   - See the output (if JavaScript is selected)

## Project Structure

- `index1.html` - The main web interface
- `script.js` - Contains the compiler implementation (lexer, parser, and code generator)
- `styles.css` - CSS styling for the web interface

## Technical Implementation

The compiler works in three main stages:

1. **Lexical Analysis (Lexer):**
   - Breaks down input code into tokens
   - Identifies keywords, identifiers, numbers, and operators

2. **Syntax Analysis (Parser):**
   - Converts tokens into an Abstract Syntax Tree (AST)
   - Validates the program structure

3. **Code Generation:**
   - Converts the AST into target programming language code
   - Handles language-specific syntax and features

## Browser Compatibility

The compiler works in all modern web browsers:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Notes

- JavaScript mode provides live execution in the browser
- For other languages, the compiler generates equivalent code that can be run in their respective environments
- The project uses a clean, minimalist design with a matrix-inspired background
