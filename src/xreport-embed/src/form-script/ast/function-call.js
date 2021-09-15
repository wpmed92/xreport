import { AST } from './ast';

/**
 * Instantiates a new FunctionCall AST
 * @class
 * @augments AST
 */
function FunctionCall() {
    AST.call(this, "FUNCALL");
    this.variableName = "";
    this.funName = "";
    this.args = [];
}

export { FunctionCall };