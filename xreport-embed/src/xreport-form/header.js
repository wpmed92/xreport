import XLabel from './label.js';
import $ as jQ from 'jquery';

function XHeader(text) {
  XLabel.call(this, text);
  this.type = "header";
}

XHeader.prototype = Object.create(XLabel.prototype);

XHeader.prototype.render = function() {
  var view = jQ("<div><h5>" + this.val + "</h5><hr></div>");
  this.bind(view);
  return view;
}

XHeader.prototype.genText = function() {
  return ("\n" + this.val + "\n------------------------------------");
}

export XHeader;
