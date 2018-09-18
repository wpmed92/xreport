import XFormElem from './form-elem.js';
import $ as jQ from 'jquery';
import _ from 'lodash';

function XFormRow() {
  XFormElem.call(this, "row");
  this.children = [];
}

XFormRow.prototype = Object.create(XFormElem.prototype);

XFormRow.prototype.addChild = function(child) {
  this.children.push(child);
}

XFormRow.prototype.render = function() {
  var view = jQ("<div class='form-row'></div>");
  var model = this;
  this.bind(view);

  this.children.forEach(function(child) {
    var col = jQ("<div class='col my-auto x-form-wrapper'></div>");
    col.append(child.render());
    view.append(col);
  });

  return view;
}

XFormRow.prototype.buildEditor = function() {
  var model = this;
  var editor = jQ("<div></div>");

  model.children.forEach(function(child) {
    editor.append(child.buildEditor());
  });

  return editor;
}

XFormRow.prototype.genText = function() {
  var out = "";

  this.children.forEach(function(child) {
    if (_.isFunction(child.genText) && child.genText() !== "") {
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

return XFormRow;
