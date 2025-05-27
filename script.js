function lexer(input) {
    const tokens = [];
    let position = 0;

    while (position < input.length) {
        let char = input[position];

        if (char === ' ') {
            position++;
            continue;
        }

        if (char === '"') {
            position++;
            let text = '';
            while (position < input.length && input[position] !== '"') {
                text += input[position];
                position++;
            }
            position++;
            tokens.push({ type: 'string', value: text });
            continue;
        }

        if (/[a-zA-Z]/.test(char)) {
            let word = '';
            while (position < input.length && /[a-zA-Z]/.test(input[position])) {
                word += input[position];
                position++;
            }

            if (['maano', 'likho', 'agar', 'warna', 'jabtak'].includes(word)) {
                tokens.push({ type: 'keyword', value: word });
            } else {
                tokens.push({ type: 'identifier', value: word });
            }
            continue;
        }

        if (/[0-9]/.test(char)) {
            let number = '';
            while (position < input.length && /[0-9]/.test(input[position])) {
                number += input[position];
                position++;
            }
            tokens.push({ type: 'number', value: parseInt(number) });
            continue;
        }

        if (/[\+\-\*\/=<>!]/.test(char)) {
            if (input[position + 1] === '=') {
                tokens.push({ type: 'operator', value: char + input[position + 1] });
                position += 2;
            } else {
                tokens.push({ type: 'operator', value: char });
                position++;
            }
            continue;
        }

        if (char === '{' || char === '}') {
            tokens.push({ type: 'brace', value: char });
            position++;
            continue;
        }

        position++;
    }

    return tokens;
}

function parser(tokens) {
    const ast = { type: 'program', body: [] };

    function parseExpression() {
        let expression = '';
        while (tokens.length > 0) {
            const token = tokens[0];
            if (token.type === 'operator' || token.type === 'identifier' || token.type === 'number') {
                expression += token.value + ' ';
                tokens.shift();
            } else {
                break;
            }
        }
        return expression.trim();
    }

    function parseBlock() {
        const body = [];
        while (tokens.length > 0 && tokens[0].type !== 'brace') {
            const statement = parseStatement();
            if (statement) body.push(statement);
        }
        tokens.shift(); // Consume '}'
        return body;
    }

    function parseStatement() {
        const token = tokens.shift();

        if (!token) return null;

        // Variable Declaration (maano x = 5)
        if (token.type === 'keyword' && token.value === 'maano') {
            const identifier = tokens.shift();
            tokens.shift(); // Consume '='
            const value = parseExpression();
            return {
                type: 'declaration',
                name: identifier.value,
                value: value
            };
        }

        // Assignment (a = a + 1)
        if (token.type === 'identifier') {
            const name = token.value;
            if (tokens[0] && tokens[0].value === '=') {
                tokens.shift(); // Consume '='
                const value = parseExpression();
                return {
                    type: 'assignment',
                    name: name,
                    value: value
                };
            }
        }

        // Print Statement (likho "Hello")
        if (token.type === 'keyword' && token.value === 'likho') {
            const value = tokens.shift();
            if (value.type === 'string') {
                return {
                    type: 'print',
                    isString: true,
                    value: value.value
                };
            }
            return {
                type: 'print',
                isString: false,
                value: value.value
            };
        }

        // If-Else Statement (agar x < y { ... } warna { ... })
        if (token.type === 'keyword' && token.value === 'agar') {
            const conditionLeft = tokens.shift();
            const conditionOperator = tokens.shift();
            const conditionRight = tokens.shift();

            tokens.shift(); // Consume '{'
            const body = parseBlock();

            let elseBody = [];
            if (tokens.length > 0 && tokens[0].value === 'warna') {
                tokens.shift();
                tokens.shift(); // Consume '{'
                elseBody = parseBlock();
            }

            return {
                type: 'conditional',
                condition: {
                    left: conditionLeft,
                    operator: conditionOperator.value,
                    right: conditionRight
                },
                body,
                elseBody
            };
        }

        // While Loop (jabtak a < 10 { ... })
        if (token.type === 'keyword' && token.value === 'jabtak') {
            const conditionLeft = tokens.shift();
            const conditionOperator = tokens.shift();
            const conditionRight = tokens.shift();

            tokens.shift(); // Consume '{'
            const body = parseBlock();

            return {
                type: 'loop',
                condition: {
                    left: conditionLeft,
                    operator: conditionOperator.value,
                    right: conditionRight
                },
                body
            };
        }

        return null;
    }

    while (tokens.length > 0) {
        const statement = parseStatement();
        if (statement) ast.body.push(statement);
    }

    return ast;
}

function generate(node, language) {
    switch (node.type) {
        case 'program':
            return node.body.map((stmt) => generate(stmt, language)).join('\n');
        case 'declaration':
            if (language === 'js') {
                return `let ${node.name} = ${node.value};`;
            } else if (language === 'cpp' || language === 'java' || language === 'c') {
                return `int ${node.name} = ${node.value};`;
            } else if (language === 'python') {
                return `${node.name} = ${node.value}`;
            }
            break;
        case 'assignment':
            return `${node.name} = ${node.value};`;
        case 'print':
            if (language === 'js') {
                return node.isString ? `console.log("${node.value}");` : `console.log(${node.value});`;
            } else if (language === 'cpp') {
                return node.isString ? `std::cout << "${node.value}" << std::endl;` : `std::cout << ${node.value} << std::endl;`;
            } else if (language === 'java') {
                return node.isString ? `System.out.println("${node.value}");` : `System.out.println(${node.value});`;
            } else if (language === 'c') {
                return node.isString ? `printf("${node.value}\\n");` : `printf("%d\\n", ${node.value});`;
            } else if (language === 'python') {
                return node.isString ? `print("${node.value}")` : `print(${node.value})`;
            }
            break;
        case 'conditional':
            const cond = `${node.condition.left.value} ${node.condition.operator} ${node.condition.right.value}`;
            const ifBody = node.body.map((stmt) => generate(stmt, language)).join('\n');
            const elseBody = node.elseBody.map((stmt) => generate(stmt, language)).join('\n');
            if (language === 'python') {
                return `if ${cond}:\n${ifBody.replace(/\n/g, '\n    ')}\n${elseBody ? `else:\n${elseBody.replace(/\n/g, '\n    ')}` : ''}`;
            } else {
                return `if (${cond}) {\n${ifBody}\n}${elseBody ? ` else {\n${elseBody}\n}` : ''}`;
            }
        case 'loop':
            const loopCond = `${node.condition.left.value} ${node.condition.operator} ${node.condition.right.value}`;
            const loopBody = node.body.map((stmt) => generate(stmt, language)).join('\n');
            if (language === 'python') {
                return `while ${loopCond}:\n${loopBody.replace(/\n/g, '\n    ')}`;
            } else {
                return `while (${loopCond}) {\n${loopBody}\n}`;
            }
        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
}

function compileAndRun() {
    const input = document.getElementById('codeInput').value;
    const outputElement = document.getElementById('output');
    const convertedCodeElement = document.getElementById('convertedCode');
    const language = document.getElementById('languageSelect').value;

    try {
        const tokens = lexer(input);
        const ast = parser(tokens);

        const jsCode = generate(ast, 'js');

        
        const convertedCode = generate(ast, language);

       
        convertedCodeElement.textContent = convertedCode;
        let consoleOutput = '';
        const originalConsoleLog = console.log;
        console.log = function (message) {
            consoleOutput += message + '\n';
            originalConsoleLog.apply(console, arguments);
        };

        eval(jsCode); 
        console.log = originalConsoleLog;

       
        outputElement.textContent = consoleOutput.trim();
    } catch (error) {
        outputElement.textContent = `Error: ${error.message}`;
        convertedCodeElement.textContent = '';
    }
}