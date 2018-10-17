import { XReportDOM } from './xreport-dom.js';
import { XReportRenderer } from './xreport-render.js';
import { Evaluator } from './form-script/evaluator';
import 'bootstrap';

const xreportDOM = new XReportDOM();
const xreportRenderer = new XReportRenderer(xreportDOM);

export function makeWidget(url, title, targetId, editorMode) {
  return new Promise((resolve, reject) => {
    let xreportEval = new Evaluator(xreportDOM);
    xreportDOM.init();
    
    //Init an empty builder
    if (!url) {
      xreportDOM.setIsEditor(true);
      let component = xreportRenderer.render(xreportDOM, title, targetId, /*editorMode*/ true, xreportEval);
      xreportEval.bind({ context: "builder", widget: component });
      resolve();
    } else {
      xreportDOM.setIsEditor(editorMode);
      xreportDOM.load(url, function() {
        let component = xreportRenderer.render(xreportDOM, title, targetId, /*editorMode*/ editorMode);
        xreportEval.bind({ context: "viewer", widget: component });
        resolve();
      });
    }
  }, function(error) {
    reject(error);
  });
}

export function togglePreviewMode() {
  xreportRenderer.togglePreviewMode();
}

export function getReportAsText() {
  return xreportRenderer.getReportAsText();
}

export function getTemplateForUpload() {
  return xreportRenderer.getTemplateAsPayload();
}
