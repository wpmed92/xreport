import { XReportDOM } from './xreport-dom.js';
import { XReportRenderer } from './xreport-render.js';
import { Evaluator } from './form-script/evaluator';
import 'bootstrap';

const xreportDOM = new XReportDOM();
const xreportRenderer = new XReportRenderer(xreportDOM);

export function makeWidget(url, title, targetId, success) {
  return new Promise((resolve, reject) => {
    let testScript = "if xElemacp5w2ezp == 'Opció 2' { xElem0hilmf3sb.hide(); }";
    console.log("In xreport-embed");

    xreportDOM.load(url, function(dom, formScript) {
      let form = xreportRenderer.render(xreportDOM, title, targetId, /*editorMode*/true);
      /*let xreportEval = new Evaluator(testScript, xreportDOM);
      xreportEval.attachToForm(form);*/
      resolve();
    });
  });
}

export function togglePreviewMode() {
  xreportRenderer.togglePreviewMode();
}

export function getReportAsText() {
  return xreportRenderer.getReportAsText();
}
