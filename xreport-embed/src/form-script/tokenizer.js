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

  var isNumber = function(token) {
	  return !isNaN(parseFloat(token));
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

  var getChar = function() {
    return script[cursor];
  }

  var peekChar = function() {
    return script[cursor + 1];
  }

  this.tokenize = function() {
    while (cursor < script.length) {
      skipSpaces();
      
      if (getChar() == "'" || getChar() == '"') {
        var stringLiteral = parseString();
        tokenStream.push({ type: 'STRING', val: stringLiteral });
      } else if (getChar() == '=') {
        if (peekChar() == '=') {
          tokenStream.push({ type: 'EQUAL_OP', val: getChar() + peekChar() });
          move();
        } else {
          tokenStream.push({ type: 'ASSIGN', val: getChar() });
        }
      } else if (getChar() == '<') {
        if (peekChar() == '=') {
          tokenStream.push({ type: 'LT_EQUAL_OP', val: getChar() + peekChar() });
          move();
        } else {
          tokenStream.push({ type: 'LT_OP', val: getChar() });
        }
      } else if (getChar() == '>') {
        if (peekChar() == '=') {
          tokenStream.push({ type: 'GT_EQUAL_OP', val: getChar() + peekChar() });
          move();
        } else {
          tokenStream.push({ type: 'GT_OP', val: getChar() });
        }
      } else if (getChar() == '+') {
        tokenStream.push({ type: 'PLUS_OP', val: getChar() });
      } else if (getChar() == '-') {
        tokenStream.push({ type: 'MINUS_OP', val: getChar() });
      } else if (getChar() == '*') {
        tokenStream.push({ type: 'MUL_OP', val: getChar() });
      } else if (getChar() == '/') {
        tokenStream.push({ type: 'DIV_OP', val: getChar() });
      } else if (getChar() == '%') {
        tokenStream.push({ type: 'MOD_OP', val: getChar() });
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
        
        if (isNumber(token)) {
          tokenStream.push({ type: "NUMBER", val: parseFloat(token) });
        } else if (token === "and") {
          tokenStream.push({ type: "AND_OP", val: token });
        } else if (token === "or") {
          tokenStream.push({ type: "OR_OP", val: token});
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

    return tokenStream;
  }
}

export { Tokenizer };