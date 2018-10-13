import { AST } from './ast';

function IfThen() {
    AST.call(this, "IFTHEN");
    this.condition = null;
    this.thenPart = [];
}

export { IfThen };