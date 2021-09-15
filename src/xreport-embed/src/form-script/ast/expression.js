import { AST } from './ast';

/**
 * Instantiates a new Expression AST
 * @class
 * @augments AST
 */
function Expression(outputQueue) {
    AST.call(this, "EXP");
    this.outputQueue = outputQueue;
}

export { Expression };