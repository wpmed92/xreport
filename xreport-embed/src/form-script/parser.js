function Parser(tokenStream) {
    let tokenStream = tokenStream;
    let cursor = 0;
    let ast = [];

    var parseExpression = function() {

    }

    var parseAssignment = function() {
        var assignment = new Assignment();

        if (curToken().type === "VARIABLE_NAME" && peekToken().type === "EQUAL_SIGN") {
            assignment.lhs = token.val;
        }

        assignment.rhs = parseExpression();
        ast.push(assignment);
    }

    this.parse = function() {
        var token = tokenStream[cursor];

        while (true) {

        }
    }
}