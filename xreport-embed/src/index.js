import { XReportDOM } from './xreport-dom.js';
import { XReportEvaluator } from './xreport-evaluator.js';
import * as renderer from './xreport-render.js';

export function makeWidget(url, title, targetId) {
  let xreportDOM = new XReportDOM();

  xreportDOM.load(url, function(dom, conditions) {
    let form = renderer.render(dom, title, targetId);
    let xreportEval = new XReportEvaluator(xreportDOM, conditions);
    xreportEval.attachToForm(form);
  });
}
