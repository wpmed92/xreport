/* Expression parser based on the Shunting-yard algorithm */
import { Expression } from './ast/expression';

const OP_PRECEDENCE_MAP = {
    'and': 1,
    'or': 1,
    '!=': 2,
    '==': 2,
    '<=': 3,
    '<' : 3,
    '>=': 3,
    '>': 3,
    '+': 4,
    '-': 4,
    '*': 5,
    '/': 5,
    '%': 5
}

function ExpressionParser(tokenStream) {
    var operatorStack = [];
    var outputQueue = [];
    var cursor = 0;

    var curToken = function() {
        return tokenStream[cursor];
    }

    var advanceToken = function() {
        return tokenStream[cursor++];
    }

    var hasHigherPrecedenceOpOnStack = function(token) {
        var op = operatorStack[operatorStack.length - 1];

        if (!op) {
            return false;
        }

        return OP_PRECEDENCE_MAP[op.val] > OP_PRECEDENCE_MAP[token.val];
    }

    this.parse = function(terminator) {
        while (advanceToken().type !== terminator) {
            var token = curToken();

            if (token.type === "NUMBER" || token.type === "VARIABLE_NAME") {
                outputQueue.push(token);
            } else if (token.type.includes("_OP")) {
                while (hasHigherPrecedenceOpOnStack(token)) {
                    outputQueue.push(operatorStack.pop());
                }

                operatorStack.push(token);
            } else if (token.type === "LEFT_BRACKET") {
                operatorStack.push(token);
            } else if (token.type === "RIGHT_BRACKET") {
                while (operatorStack[operatorStack.length - 1].type !== "LEFT_BRACKET") {
                    outputQueue.push(operatorStack.pop());
                }

                //Discard LEFT_BRACKET
                operatorStack.pop();
            } else {
                throw "Invalid token '" + token.val + "' in expression.";
            }
        }

        while (operatorStack.lenth > 0) {
            outputQueue.push(operatorStack.pop());
        }

        return new Expression(outputQueue);
    }
}

export { ExpressionParser };