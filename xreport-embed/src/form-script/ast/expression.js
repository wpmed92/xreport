import { AST } from './ast';

function Expression() {
    AST.call(this, "MATH_EXP");
    this.outputQueue = [];
}

export { Expression };