import { MathExpression } from './ast/math-expression';
import { BooleanExpression } from './ast/boolean-expression';
import { Assignment } from './ast/assignment';
import { IfThen } from './ast/if-then';
import { FunctionCall } from './ast/function-call';

function Parser(tokenStream) {
    let tokenStream = tokenStream;
    let cursor = 0;
    let ast = [];

    var curToken = function() {
        return tokenStream[cursor];
    }

    var peekToken = function() {
        return tokenStream[cursor + 1];
    }

    var parseMathExpression = function() {

    }

    var parseBooleanExpression = function() {

    }

    var parseAssignment = function() {
        var assignment = new Assignment();

        if (curToken().type === "VARIABLE_NAME" && peekToken().type === "EQUAL_SIGN") {
            assignment.lhs = token.val;
        }

        assignment.rhs = parseExpression();
        ast.push(assignment);
    }

    var parseIfThen = function() {
        if (curToken().type === "IF_KEYWORD") {
            
        }
    }

    var parseFunctionCall = function() {

    }

    this.parse = function() {
        var token = tokenStream[cursor];

        while (true) {

        }
    }
}