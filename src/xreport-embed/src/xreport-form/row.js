import { XFormElem } from './form-elem';
import $ from 'jquery';
import * as isFunction from 'lodash.isfunction';

/**
 * Instantiates a new XFormRow that show elements in a row
 * @class
 * @augments XFormElem
 */
function XFormRow() {
  XFormElem.call(this, "row");
  this.children = [];
}

XFormRow.prototype = Object.create(XFormElem.prototype);

XFormRow.prototype.addChild = function(child) {
  this.children.push(child);
}

XFormRow.prototype.render = function() {
  var view = $("<div class='form-row'></div>");
  var model = this;
  this.bind(view);

  this.children.forEach(function(child) {
    var col = $("<div style='overflow-x: auto;' class='col my-auto x-form-wrapper'></div>");
    col.append(child.render());
    view.append(col);
  });

  return view;
}

XFormRow.prototype.buildEditor = function() {
  var model = this;
  var editor = $("<div></div>");

  model.children.forEach(function(child) {
    editor.append(child.buildEditor());
  });

  return editor;
}

XFormRow.prototype.genText = function() {
  var out = "";

  this.children.forEach(function(child) {
    if (isFunction(child.genText) && child.genText() !== "" && !child.hideFromOutput && !child.hidden) {
      out += child.genText();

      if (child.type !== "header") {
        out += ", ";
      }
    }
  });

  if (out !== "") {
    out = out.slice(0, out.length - 2);
    out += "\n";
  }

  return out;
}

export { XFormRow };
