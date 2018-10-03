import { XFormElem } from './form-elem.js';
import $ from 'jquery';

function XInText() {
  XFormElem.call(this, "intext");
}

XInText.prototype = Object.create(XFormElem.prototype);

XInText.prototype.render = function() {
  var view = $("<input type='text' class='form-control'>")
  this.bind(view);

  return view;
}

XInText.prototype.getValue = function() {
  return $("*[data-x-id='" + this.id + "']").val();
}

XInText.prototype.genText = function() {
  return $("*[data-x-id='" + this.id + "']").val();
}

XInText.prototype.prettyPrint = function() {
  var view = "<p>" + $("*[data-x-id='" + this.id + "']").val() + "</p>";
  return view;
}

export { XInText };
