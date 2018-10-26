import { XFormElem } from './form-elem.js';
import { XLabel } from './label.js';
import $ from 'jquery';
import * as isFunction from 'lodash.isfunction';

function XFormGroup(orientation, label) {
  XFormElem.call(this, "group");
  this.child = "";
  this.label = new XLabel(label);
  this.hint;
}

XFormGroup.prototype = Object.create(XFormElem.prototype);

XFormGroup.prototype.addChild = function(child) {
  this.child = child;
}

XFormGroup.prototype.buildEditor = function() {
  var model = this;
  var editor = $("<div></div>");
  editor.append(this.label.buildEditor());
  editor.append(this.child.buildEditor());
  return editor;
}

XFormGroup.prototype.render = function() {
  var view = $("<div class='form-group'></div>");
  this.bind(view);

  if (this.child.type === "inbool") {
    var checkLabel = this.child.render();
    view.append(checkLabel.append(this.label.render(this.child.id)));
  } else {
    view.append(this.label.render());
    view.append(this.child.render());
  }

  return view;
}

XFormGroup.prototype.genText = function() {
  if (this.child.type === "inbool") {
    var view = $("*[data-x-id='" + this.id + "']");
    var checked = view.find("input:checked").first();

    if (checked.length > 0) {
      return checked.next().text();
    }
  } else if (isFunction(this.child.genText) && !!this.child.genText() && !this.child.hideFromOutput && !this.child.hidden) {
    let output = (this.label.val) ?  (this.label.val + ": " + this.child.genText()) : this.child.genText();
    output = "<p>" + output + "</p>";
    console.log(output);
    return output;
  }

  return "";
}

export { XFormGroup };
