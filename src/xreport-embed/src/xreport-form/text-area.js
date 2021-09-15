import { XFormElem } from './form-elem';
import $ from 'jquery';

/**
 * Instantiates a new XTextArea to allow input of long text
 * @class
 * @augments XFormElem
 */
function XTextArea(rows) {
  XFormElem.call(this, "tarea");
  this.rows = 3;
}

XTextArea.prototype = Object.create(XFormElem.prototype);

XTextArea.prototype.render = function() {
  var view = $("<textarea class='form-control' rows='" + this.rows + "'></textarea>");
  this.bind(view);
  return view;
}

XTextArea.prototype.getValue = function() {
  return $("*[data-x-id='" + this.id + "']").val();
}

XTextArea.prototype.genText = function() {
  return $("*[data-x-id='" + this.id + "']").val();
}

export { XTextArea };
