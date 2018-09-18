import XFormElem from './form-elem.js';
import $ as jQ from 'jquery';

function XInBool(style) {
  XFormElem.call(this, "inbool");
  this.style = style || "checkbox";
}

XInBool.prototype = Object.create(XFormElem.prototype);

XInBool.prototype.render = function(checked) {
  var view = jQ("<div class='form-check'>\
                  <input id='" + this.id + "' class='form-check-input' type='" + this.style + "'" + (checked ? "checked" : "") + ">\
                </div>");
  this.bind(view);
  return view;
}

export XInBool;
