import { AST } from './ast';

function IfThen() {
    AST.call(this, "IFTHEN");
    this.condition = null;
    this.true = [];
    this.false = [];
}

export { IfThen };