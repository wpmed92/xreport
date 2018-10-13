import { AST } from './ast';

function Assignment() {
    AST.call(this, "ASSIGNMENT");
    this.lhs = null;
    this.rhs = null;
}

export { Assignment };