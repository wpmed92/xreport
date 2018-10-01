import { XReportDOM } from './xreport-dom.js';
import { XReportEvaluator } from './xreport-evaluator.js';
import { XReportRenderer } from './xreport-render.js';

const xreportDOM = new XReportDOM();
const xreportRenderer = new XReportRenderer(xreportDOM);

export function makeWidget(url, title, targetId) {
  xreportDOM.load(url, function(dom, conditions) {
    let form = xreportRenderer.render(dom, title, targetId);
    let xreportEval = new XReportEvaluator(xreportDOM, conditions);
    xreportEval.attachToForm(form);
  });
}

export function genReportOutput() {
  xreportRenderer.genText();
}
