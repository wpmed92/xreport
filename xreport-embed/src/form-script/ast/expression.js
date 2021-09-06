import { AST } from './ast';

function Expression(outputQueue) {
    AST.call(this, "EXP");
    this.outputQueue = outputQueue;
}

export { Expression };