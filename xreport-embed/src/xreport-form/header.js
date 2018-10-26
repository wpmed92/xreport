import { XLabel } from './label.js';
import $ from 'jquery';

function XHeader(text) {
  XLabel.call(this, text);
  this.type = "header";
}

XHeader.prototype = Object.create(XLabel.prototype);

XHeader.prototype.render = function() {
  var view = $("<div><h5>" + this.val + "</h5><hr></div>");
  this.bind(view);
  return view;
}

XHeader.prototype.genText = function() {
  return ("<br><b>" + this.val + "</b><br>");
}

XHeader.prototype.prettyPrint = function() {
  var view = $("<div><h5>" + this.val + "</h5><hr></div>");
  return view;
}

export { XHeader };
