function Tokenizer(script) {
  let tokenStream = [];
  let lineCounter = 0;
  let cursor = 0;

  var parseString = function() {
    var terminator = getChar();
    var str = "";
    move();
    
    while (getChar() != terminator) {
      if (cursor === script.length) {
        throw { type: "TOKENIZER_ERROR", msg: "String not closed." };
      }

      str += getChar();
      move();
    }
    
    return str;
  }

  var parseToken = function() {
    var token = "";
    
    while (!isTerminalCharacter(getChar()) && cursor < script.length) {
      token += getChar();
      move();
    }
    
    moveBack();
    return token;
  }

  var isInteger = function(token) {
	  return /^\d+$/.test(token);
  }

  var isVariableName = function(token) {
	  return /[_a-zA-Z][_a-zA-Z0-9]*/.test(token);
  }

  var isTerminalCharacter = function(char) {
    return char === "'" || char === '"' || 
      char === "<" || char === ">" ||
      char === "=" || char === "(" ||
      char === ")" || char === "+" ||
      char === "-" || char === "/" ||
      char === "*" || char === ":" ||
      char === "!" || char === "^" ||
      char === ";" || char === " " ||
      char === "{" || char === "}" ||
      char === "\n" || char === "\t" ||
      char === "." || char === ",";
  }

  var skipSpaces = function() {
	  while ((getChar() == ' ' || getChar() == '\n' || getChar() == '\t') && cursor < script.length) {
  	  move();
    }
  }

  var move = function() {
	  cursor++;
  }

  var moveBack = function() {
	  cursor--;
  }

  var rollback = function(to) {
    cursor = to;
  }

  var getChar = function() {
    return script[cursor];
  }

  var peekChar = function() {
    return script[cursor + 1];
  }

  var prevToken = function() {
    return tokenStream[tokenStream.length - 1];
  }

  var isCurrentOpUnary = function() {
    return !(prevToken().type === "NUMBER" || prevToken().type === "STRING" || 
    prevToken().type === "VARIABLE_NAME" || prevToken().type === "RIGHT_BRACKET");
  }

  this.tokenize = function() {
    while (cursor < script.length) {
      skipSpaces();
      
      if (getChar() == "'" || getChar() == '"') {
        var stringLiteral = parseString();
        tokenStream.push({ type: 'STRING', val: stringLiteral });
      } else if (getChar() == '=') {
        if (peekChar() == '=') {
          tokenStream.push({ type: 'EQUAL', isOperator: true, val: getChar() + peekChar() });
          move();
        } else {
          tokenStream.push({ type: 'ASSIGN', val: getChar() });
        }
      } else if (getChar() == '<') {
        if (peekChar() == '=') {
          tokenStream.push({ type: 'LT_EQUAL', isOperator: true, val: getChar() + peekChar() });
          move();
        } else {
          tokenStream.push({ type: 'LT', isOperator: true, val: getChar() });
        }
      } else if (getChar() == '>') {
        if (peekChar() == '=') {
          tokenStream.push({ type: 'GT_EQUAL', isOperator: true, val: getChar() + peekChar() });
          move();
        } else {
          tokenStream.push({ type: 'GT', isOperator: true, val: getChar() });
        }
      } else if (getChar() == '!') {
        if (peekChar() == '=') {
          tokenStream.push({ type: 'NOT_EQUAL', isOperator: true, val: getChar() + peekChar() });
          move();
        } else {
          tokenStream.push({ type: 'NOT', isOperator: true, isUnary: true, val: getChar() });
        }
      } else if (getChar() == '+') {
        if (isCurrentOpUnary()) {
          tokenStream.push({ type: 'UNARY_PLUS', isOperator: true, isUnary: true, val: "u" + getChar() });
        } else {
          tokenStream.push({ type: 'PLUS', isOperator: true, val: getChar() });
        }
      } else if (getChar() == '-') {
        if (isCurrentOpUnary()) {
          tokenStream.push({ type: 'UNARY_MINUS', isOperator: true, isUnary: true, val: "u" + getChar() });
        } else {
          tokenStream.push({ type: 'MINUS', isOperator: true, val: getChar() });
        }
      } else if (getChar() == '^') {
        tokenStream.push({ type: 'EXP', isOperator: true, val: getChar() });
      } else if (getChar() == '*') {
        tokenStream.push({ type: 'MUL', isOperator: true, val: getChar() });
      } else if (getChar() == '/') {
        tokenStream.push({ type: 'DIV', isOperator: true, val: getChar() });
      } else if (getChar() == '%') {
        tokenStream.push({ type: 'MOD', isOperator: true, val: getChar() });
      } else if (getChar() == ':') {
        tokenStream.push({ type: 'COLON', val: getChar()});
      } else if (getChar() == ';') {
        tokenStream.push({ type: 'SEMI_COLON', val: getChar() });
      } else if (getChar() == '.') {
        tokenStream.push({ type: 'DOT', val: getChar() });
      } else if (getChar() == ',') {
        tokenStream.push({ type: 'COMMA', val: getChar() });
      } else if (getChar() == '(') {
        tokenStream.push({ type: 'LEFT_BRACKET', val: getChar()});
      } else if (getChar() == ')') {
        tokenStream.push({ type: 'RIGHT_BRACKET', val: getChar()});
      } else if (getChar() == '{') {
        tokenStream.push({ type: 'LEFT_CURLY', val: getChar()});
      } else if (getChar() == '}') {
        tokenStream.push({ type: 'RIGHT_CURLY', val: getChar()});
      } else {
        var token = parseToken();
        
        if (isInteger(token)) {
          if (peekChar() === '.') {
            var anchorPoint = cursor;
            move();
            move();
            var decimalPart = parseToken();

            if (isInteger(decimalPart)) {
              var floatNumber = token + "." + decimalPart;
              tokenStream.push({ type: "NUMBER", val: floatNumber });
            } else {
              rollback(anchorPoint);
            }
          } else {
            tokenStream.push({ type: "NUMBER", val: parseInt(token) });
          }
        } else if (token === "and") {
          tokenStream.push({ type: "AND", isOperator: true, val: token });
        } else if (token === "or") {
          tokenStream.push({ type: "OR", isOperator: true, val: token});
        } else if (token === "if") {
          tokenStream.push({ type: "IF_KEYWORD", val: token });
        } else if (isVariableName(token)) {
          tokenStream.push({ type: "VARIABLE_NAME", val: token });
        } else {
          throw "Invalid token " + "'" + token + "'";
        }
      }
      
      move();
    }

    console.log(JSON.stringify(tokenStream));

    return tokenStream;
  }
}

export { Tokenizer };