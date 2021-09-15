import { AST } from './ast';

/**
 * Instantiates a new IfThen AST
 * @class
 * @augments AST
 */
function IfThen() {
    AST.call(this, "IFTHEN");
    this.condition = null;
    this.true = [];
    this.false = [];
}

export { IfThen };