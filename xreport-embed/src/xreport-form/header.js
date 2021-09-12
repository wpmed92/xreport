import { XLabel } from './label.js';
import $ from 'jquery';

/**
 * Instantiates a new XHeader element. Mainly used for visually separating sections.
 * @class
 * @augments XFormElem
 */
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
  return ("\n" + this.val + "\n------------------------------------");
}

XHeader.prototype.prettyPrint = function() {
  var view = $("<div><h5>" + this.val + "</h5><hr></div>");
  return view;
}

export { XHeader };
