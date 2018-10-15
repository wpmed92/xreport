import { Parser } from './parser';
import { FunctionCall } from './ast/function-call';

const OPERATORS = {
    "+": function(left, right) {
        return left + right;
    },
    "-": function(left, right) {
        return left - right;
    },
    "*": function(left, right) {
        return left * right;
    },
    "/": function(left, right) {
        return left / right;
    },
    "%": function(left, right) {
        return left % right;
    },
    "<=": function(left, right) {
        return left <= right;
    },
    ">=": function(left, right) {
        return left >= right;
    },
    "<": function(left, right) {
        return left < right;
    },
    ">": function(left, right) {
        return left > right;
    },
    "==": function(left, right) {
        return left == right;
    },
    "and": function(left, right) {
        return left && right;
    },
    "or": function(left, right) {
        return left || right;
    }
}

function Evaluator(script, context) {
    const parser = new Parser(script);
    const ast = parser.parse();
    const dom = context;

    var evalExpression = function(expression) {
        let valueStack = [];

        for (let i = 0; i < expression.outputQueue.length; i++) {
            var tok = expression.outputQueue[i];
        
            if (tok.type === "NUMBER" || tok.type === "STRING") {
                valueStack.push(tok.val);
            }

            if (tok.type === "VARIABLE_NAME") {
                valueStack.push(extractValue(tok.val));
            }
        
            if (tok.type.includes("_OP")) {
                var right = valueStack.pop();
                var left = valueStack.pop();
                var sum = OPERATORS[tok.val](left, right);
                valueStack.push(sum);
            }
        }
        
        return valueStack.pop();
    }

    var extractValue = function(variable) {
        var xElem = dom.getXElemById(variable);
        var val = xElem.getValue();
        var numericVal = parseFloat(val);
    
        if (isNaN(numericVal)) {
            return val;
        } else {
            return numericVal;
        }
    }

    var evalAssignment = function(assignment) {
        var xElem = dom.getXElemById(assignment.lhs);
        var val = evalExpression(assignment.rhs);
        xElem.setValue(val);
    }

    var evalFunctionCall = function(functionCall) {
        var xElem = dom.getXElemById(functionCall.variableName);
        var funName = functionCall.funName;
        var args = [];

        for (let i = 0; i < functionCall.args.length; i++) {
            let arg = functionCall.args[i];
            let evaluatedArg = evalExpression(arg);
            args.push(evaluatedArg);
        }

        xElem[funName](...args);
    }

    var evalIfThen = function(ifThen) {
        let condition = evalExpression(ifThen.condition);

        if (condition) {
            for (let i = 0; i < ifThen.true.length; i++) {
                let trueAction = ifThen.true[i];
                
                if (trueAction.type === "FUNCALL") {
                    evalFunctionCall(trueAction);
                } else if (trueAction.type === "ASSIGNMENT") {
                    evalAssignment(trueAction);
                } else {
                    throw "Invalid action: " + trueAction.type;
                }
            }
        } else {
            for (let i = 0; i < ifThen.false.length; i++) {
                var falseAction = ifThen.false[i];
                evalFunctionCall(falseAction);
            }
        }
    }

    this.eval = function() {
        for (let i = 0; i < ast.length; i++) {
            let stmt = ast[i];

            if (stmt.type === "IFTHEN") {
                evalIfThen(stmt);
            } else if (stmt.type === "FUNCALL") {
                evalFunctionCall(stmt);
            } else if (stmt.type === "ASSIGNMENT") {
                evalAssignment(stmt);
            }
        }
    }

    this.attachToForm = function(form) {
        var that = this;

        form.on("change", function() {
            let start = performance.now();
            that.eval();
            console.log(performance.now() - start);
        });
    
        //Initial trigger to go to "init state"
        form.trigger("change");
      }
}

export { Evaluator };