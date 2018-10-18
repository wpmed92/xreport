import { Assignment } from './ast/assignment';
import { IfThen } from './ast/if-then';
import { FunctionCall } from './ast/function-call';
import { Expression } from './ast/expression';
import { Tokenizer } from './tokenizer';

const OP_PRECEDENCE_MAP = {
    //Binary ops
    'or': { precedence: 0, associavity: "left" },
    'and': { precedence: 1, associavity: "left" },
    '!=': { precedence: 2, associavity: "left" },
    '==': { precedence: 2, associavity: "left" },
    '<=': { precedence: 3, associavity: "left" },
    '<' : { precedence: 3, associavity: "left" },
    '>=': { precedence: 3, associavity: "left" },
    '>': { precedence: 3, associavity: "left" },
    '+': { precedence: 4, associavity: "left" },
    '-': { precedence: 4, associavity: "left" },
    '*': { precedence: 5, associavity: "left" },
    '/': { precedence: 5, associavity: "left" },
    '%': { precedence: 5, associavity: "left" },
    '^': { precedence: 6, associavity: "right" },
    //Unary ops
    'u-': { precedence: 7, associavity: "right" },
    'u+': { precedence: 7, associavity: "right" },
    '!': { precedence: 7, associavity: "right" }
}

const INVERT_FUNCTION = {
    "show": "hide",
    "hide": "show",
    "showOption": "hideOption",
    "hideOption": "showOption",
    "checkOption": "uncheckOption",
    "uncheckOption": "checkOption"
}

function Parser(script) {
    let tokenizer = new Tokenizer(script);
    let tokenStream = tokenizer.tokenize();
    let cursor = 0;
    let ast = [];

    //Expression parsing
    var operatorStack = [];
    var outputQueue = [];

    var advanceToken = function() {
        cursor++;
    }

    var curToken = function() {
        return tokenStream[cursor];
    }

    var peekToken = function() {
        return tokenStream[cursor + 1];
    }

    var parseAction = function() {
        var action = parseAssignment();

        if (!action) {
            action = parseFunctionCall();
        }

        return action;
    }

    var parseAssignment = function() {
        if (curToken().type === "VARIABLE_NAME" && peekToken().type === "ASSIGN") {
            var assignment = new Assignment();
            assignment.lhs = curToken().val;
            advanceToken();
            advanceToken();
            assignment.rhs = parseExpression(";");

            return assignment;
        }

        return null;
    }

    var invertFunction = function(action) {
        let inverted = new FunctionCall();
        inverted.variableName = action.variableName;
        inverted.funName = INVERT_FUNCTION[action.funName];
        inverted.args = action.args;

        return inverted;
    }

    var parseIfThen = function(ast) {
        if (curToken().type === "IF_KEYWORD") {
            var ifThen = new IfThen();
            advanceToken();
            ifThen.condition = parseExpression();

            if (curToken().type != "LEFT_CURLY") {
              throw "{ expected";
            }

            advanceToken();

            while (curToken().type !== "RIGHT_CURLY") {
                var action = parseAction();

                if (action) {
                    ifThen.true.push(action);

                    if (action.type === "FUNCALL" && INVERT_FUNCTION[action.funName]) {
                        ifThen.false.push(invertFunction(action));
                    }
                } else {
                    throw "Invalid statement in if body.";
                }

                advanceToken();
            }
            
            return ifThen;
        }

        return null;
    }

    var parseFunctionCall = function() {
        if (curToken().type === "VARIABLE_NAME" && peekToken().type === "DOT") {
            var functionCall = new FunctionCall();
            functionCall.variableName = curToken().val;
            advanceToken();
            advanceToken();

            if (curToken().type === "VARIABLE_NAME") {
                functionCall.funName = curToken().val;
            } else {
                throw "Variable name expected.";
            }

            advanceToken();

            if (curToken().type === "LEFT_BRACKET") {
                advanceToken();
                functionCall.args.push(parseExpression());

                while (curToken().type === "COMMA") {
                  advanceToken();
                  functionCall.args.push(parseExpression());
                }

                advanceToken();

                if (curToken().type !== "SEMI_COLON") {
                  throw "End of statement expected";
                }
            }

            return functionCall;
        }

        return null;
    }

    var hasHigherPrecedenceOpOnStack = function(token) {
        var op = operatorStack[operatorStack.length - 1];

        if (!op) {
            return false;
        }

        return OP_PRECEDENCE_MAP[op.val].precedence >= OP_PRECEDENCE_MAP[token.val].precedence;
    }

    var getPrecedence = function(op) {
        console.log(op);

        if (!op) {
            return undefined;
        }

        return OP_PRECEDENCE_MAP[op.val].precedence;
    }

    var getAssociavity = function(op) {
        console.log(op);

        if (!op) {
            return undefined;
        }

        return OP_PRECEDENCE_MAP[op.val].associavity;
    }

    var parseExpression = function() {
        operatorStack = [];
        outputQueue = [];

        while (cursor < tokenStream.length) {
            var token = curToken();

            if (token.type === "NUMBER" || token.type === "VARIABLE_NAME" || token.type === "STRING") {
                outputQueue.push(token);
            } else if (token.isOperator) {
                let top = operatorStack[operatorStack.length - 1];

                while (top && top.isOperator && (getAssociavity(token) === "left" && getPrecedence(token) <= getPrecedence(top)) 
                || (getAssociavity(token) === "right" && getPrecedence(token) < getPrecedence(top))) {
                    outputQueue.push(operatorStack.pop());
                    top = operatorStack[operatorStack.length - 1];
                }

                operatorStack.push(token);
            } else if (token.type === "LEFT_BRACKET") {
                operatorStack.push(token);
            } else if (token.type === "RIGHT_BRACKET") {
                if (peekToken().type === "SEMI_COLON") {
                  break;
                }

                while (operatorStack[operatorStack.length - 1].type !== "LEFT_BRACKET") {
                    outputQueue.push(operatorStack.pop());
                }

                //Discard LEFT_BRACKET
                operatorStack.pop();
            } else {
                break;
            }

            advanceToken();
        }

        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }

        return new Expression(outputQueue);
    }

    this.parse = function() {
      while (cursor < tokenStream.length) {
        var stmt = parseAssignment();

        if (!stmt) {
            stmt = parseFunctionCall();
        }

        if (!stmt) {
            stmt = parseIfThen();
        }

        if (!stmt) {
            throw "Invalid statement.";
        }

        ast.push(stmt);
        advanceToken();
      }

      return ast;
    }
}

export { Parser };