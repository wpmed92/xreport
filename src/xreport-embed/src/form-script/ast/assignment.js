import { AST } from './ast';

/**
 * Instantiates a new Assignment AST
 * @class
 * @augments AST
 */
function Assignment() {
    AST.call(this, "ASSIGNMENT");
    this.lhs = null;
    this.rhs = null;
}

export { Assignment };