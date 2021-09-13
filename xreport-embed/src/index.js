import { XReportDOM } from './xreport-dom.js';
import { XReportRenderer } from './xreport-render.js';
import { Evaluator } from './form-script/evaluator';
import 'bootstrap';

/**
 * Main entry point of xreport-dom library.
 * @module xreport-dom
 */
const xreportDOM = new XReportDOM();
const xreportRenderer = new XReportRenderer(xreportDOM);

/**
 * Make an embedded template builder or viewer widget.
 * @param {string} url - The URL of the template JSON.
 * @param {string} title - The title of the template.
 * @param {string} targetId - The id of the element that will host the widget.
 * @param {boolean} editorMode - 'true' for builder, 'false' for viewer.
 * @returns {Promise}
 */
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
        xreportEval.bind({ context: editorMode ? "builder" : "viewer", widget: component });
        resolve();
      });
    }
  }, function(error) {
    reject(error);
  });
}

/**
 * Toggles between showing the form and the text output.
 */
export function togglePreviewMode() {
  xreportRenderer.togglePreviewMode();
}

/**
 * Get the generated report as text.
 * @returns {string}
 */
export function getReportAsText() {
  return xreportRenderer.getReportAsText();
}

/**
 * Get the template in JSON format.
 * @returns {object}
 */
export function getTemplateForUpload() {
  return xreportRenderer.getTemplateAsPayload();
}
