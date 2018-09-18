import XFormElem from './form-elem.js';
import $ as jQ from 'jquery';

function XTextArea(rows) {
  XFormElem.call(this, "tarea");
  this.rows = 3;
}

XTextArea.prototype = Object.create(XFormElem.prototype);

XTextArea.prototype.render = function() {
  var view = jQ("<textarea class='form-control' rows='" + this.rows + "'></textarea>");
  this.bind(view);
  return view;
}

XTextArea.prototype.getValue = function() {
  return jQ("*[data-x-id='" + this.id + "']").val();
}

XTextArea.prototype.genText = function() {
  return jQ("*[data-x-id='" + this.id + "']").val();
}

export XTextArea;
