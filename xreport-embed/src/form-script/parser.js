import { MathExpression } from './ast/expression';
import { BooleanExpression } from './ast/expression';
import { Assignment } from './ast/assignment';
import { IfThen } from './ast/if-then';
import { FunctionCall } from './ast/function-call';
import { ExpressionParser } from './expression-parser';

function Parser(tokenStream) {
    let tokenStream = tokenStream;
    let cursor = -1;
    let ast = [];
    let expressionParser = new ExpressionParser(tokenStream);

    var advanceToken = function() {
        return tokenStream[cursor++];
    }

    var curToken = function() {
        return tokenStream[cursor];
    }

    var peekToken = function() {
        return tokenStream[cursor + 1];
    }

    var parseBooleanExpression = function() {

    }

    var parseAction = function() {
        parseAssignment();
    }

    var parseAssignment = function() {
        if (curToken().type === "VARIABLE_NAME" && peekToken().type === "ASSIGN") {
            var assignment = new Assignment();
            assignment.lhs = curToken().val;
            advanceToken();
            advanceToken();
            assignment.rhs = expressionParser.parse(";");
            ast.push(assignment);
        }
    }

    var parseIfThen = function(ast) {
        if (curToken().type === "IF_KEYWORD") {
            var ifThen = new IfThen();
            ifThen.condition = expressionParser.parse("{");

            while (curToken().type !== "}") {
                ifThen.thenPart.push(parseAction());
            }
            
            ast.push(ifThen);
        }
    }

    var parseFunctionCall = function() {

    }

    this.parse = function() {
        while (cursor < tokenStream.length) {
            parseAssignment();
            parseFunctionCall();
            parseIfThen();
            advanceToken(); 
        }

        return ast;
    }
}