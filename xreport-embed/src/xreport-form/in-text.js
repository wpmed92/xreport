import XFormElem from './form-elem.js';
import $ as jQ from 'jquery';

function XInText() {
  XFormElem.call(this, "intext");
}

XInText.prototype = Object.create(XFormElem.prototype);

XInText.prototype.render = function() {
  var view = jQ("<input type='text' class='form-control'>")
  this.bind(view);

  return view;
}

XInText.prototype.getValue = function() {
  return jQ("*[data-x-id='" + this.id + "']").val();
}

XInText.prototype.genText = function() {
  return jQ("*[data-x-id='" + this.id + "']").val();
}

export XInText;
