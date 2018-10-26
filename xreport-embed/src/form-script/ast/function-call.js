import { AST } from './ast';

function FunctionCall() {
    AST.call(this, "FUNCALL");
    this.variableName = "";
    this.funName = "";
    this.args = [];
}

export { FunctionCall };