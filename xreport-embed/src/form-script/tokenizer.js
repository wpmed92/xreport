function Tokenizer(script) {
  let script = script;
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

  var isNumericalLiteral = function(token) {
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
      char === ";" || char === " " ||
      char === "\n" || char === "\t" ||
      char === ".";
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

  this.tokenize = function() {
    while (cursor < script.length) {
      skipSpaces();
      
      if (getChar() == "'" || getChar() == '"') {
        var stringLiteral = parseString();
        tokenStream.push({ type: 'STRING_LITERAL', val: stringLiteral });
      } else if (getChar() == '=') {
        tokenStream.push({ type: 'EQUAL_SIGN' });
      } else if (getChar() == '<') {
        tokenStream.push({ type: 'LT_SIGN' });
      } else if (getChar() == '>') {
        tokenStream.push({ type: 'GT_SIGN' });
      } else if (getChar() == '+') {
        tokenStream.push({ type: 'PLUS_SIGN' });
      } else if (getChar() == '-') {
        tokenStream.push({ type: 'MINUS_SIGN' });
      } else if (getChar() == '*') {
        tokenStream.push({ type: 'MUL_SIGN' });
      } else if (getChar() == '/') {
        tokenStream.push({ type: 'DIV_SIGN' });
      } else if (getChar() == ':') {
        tokenStream.push({ type: 'COLON' });
      } else if (getChar() == ';') {
        tokenStream.push({ type: 'SEMI_COLON' });
      } else if (getChar() == '.') {
        tokenStream.push({ type: 'PROP_ACCESS' });
      } else if (getChar() == ',') {
        tokenStream.push({ type: 'COMMA' });
      } else if (getChar() == '(') {
        tokenStream.push({ type: 'OPEN_PARENTH'});
      } else if (getChar() == ')') {
        tokenStream.push({ type: 'CLOSING_PARENTH'});
      } else {
        var token = parseToken();
        
        if (isNumericalLiteral(token)) {
          tokenStream.push({ type: "NUMERICAL_LITERAL", val: parseInt(token) });
        } else if (token === "and") {
          tokenStream.push({ type: "AND_KEYWORD" });
        } else if (token === "or") {
          tokenStream.push({ type: "OR_KEYWORD" });
        } else if (token === "if") {
          tokenStream.push({ type: "IF_KEYWORD" });
        } else if (token === "then") {
          tokenStream.push({ type: "THEN_KEYWORD" });
        } else if (isVariableName(token)) {
          tokenStream.push({ type: "VARIABLE_NAME", val: token });
        } else {
          throw "Invalid token " + "'" + token + "'";
        }
      }
      
      move();
    }
  }
}

export { Tokenizer };