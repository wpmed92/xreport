import { Parser } from './parser';

/**
 * Main entry point of form-script
 * @module form-script
 */

const OPERATORS = {
    //Binary ops
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
    "!=": function(left, right) {
        return left != right;
    },
    "and": function(left, right) {
        return left && right;
    },
    "or": function(left, right) {
        return left || right;
    },
    "^": function(left, right) {
        return left ** right;
    },
    //Unary ops
    "u+": function(val) {
        return val;
    },
    "u-": function(val) {
        return -val;
    },
    "!": function(val) {
        return !val;
    }
}

/**
 * Creates a new Evaluator which can be used to evaluate FormScript code.
 * @class
 */
function Evaluator(context) {
    const dom = context;
    let ast;

    var evalExpression = function(expression) {
        let valueStack = [];

        for (let i = 0; i < expression.outputQueue.length; i++) {
            var tok = expression.outputQueue[i];
        
            if (tok.type === "NUMBER" || tok.type === "STRING") {
                valueStack.push(tok.val);
            }

            if (tok.type === "FUNCALL") {
                let funVal = evalFunctionCall(tok);
                valueStack.push(funVal);
            }

            if (tok.type === "VARIABLE_NAME") {
                valueStack.push(extractValue(tok.val));
            }
        
            if (tok.isOperator) {
                var sum;

                if (tok.isUnary) {
                    var val = valueStack.pop();
                    sum = OPERATORS[tok.val](val);
                } else {
                    var right = valueStack.pop();
                    var left = valueStack.pop();
                    sum = OPERATORS[tok.val](left, right);
                }

                valueStack.push(sum);
            }
        }
        
        return valueStack.pop();
    }

    var extractValue = function(variable) {
        var xElem = dom.getXElemByScriptAlias(variable);
        var val = xElem.getValue();
        var numericVal = parseFloat(val);
    
        if (isNaN(numericVal)) {
            return val;
        } else {
            return numericVal;
        }
    }

    var evalAssignment = function(assignment) {
        var xElem = dom.getXElemByScriptAlias(assignment.lhs);
        var val = evalExpression(assignment.rhs);
        xElem.setValue(val);
    }

    var evalFunctionCall = function(functionCall) {
        var xElem = dom.getXElemByScriptAlias(functionCall.variableName);
        var funName = functionCall.funName;
        var args = [];

        for (let i = 0; i < functionCall.args.length; i++) {
            let arg = functionCall.args[i];
            let evaluatedArg = evalExpression(arg);
            args.push(evaluatedArg);
        }

        return xElem[funName](...args);
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

    /**
     * The main method to evaluate FormScript code
     * @method
     * @param {string} script - FormScript source code
     * @param {string} context - The context in which FormScript code is evaluated. Values: "builder", "viewer"
     */
    this.eval = function(script, context) {
        let parser;

        if (context === "builder" || !ast) {
            parser = new Parser(script);
            ast = parser.parse();
        }

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

    /**
     * Binds the Evaluator to the form.
     * @method
     * @param {object} params.widget - The XReport widget to bind the Evaluator to.
     * @param {string} params.context - The context in which FormScript code is evaluated. Values: "builder", "viewer"
     */
    this.bind = function(params) {
        let that = this;
        let widget = params.widget;
        let form = widget.getForm();

        if (params.context === "builder") {
            form.on("change", function() {
                let start = performance.now();
                that.eval(widget.getScript(), params.context);
                console.log(performance.now() - start);
            });
        } else {
            form.on("change", function() {
                that.eval(dom.getScript(), params.context);
            });
        }
        //Initial trigger to go to "init state"
        widget.getForm().trigger("change");
      }
}

export { Evaluator };