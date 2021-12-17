import { XLabel } from './label';
import { XFormElem } from './form-elem';
import $ from 'jquery';

/**
 * Instantiates a new XPlainText
 * @class
 * @augments XFormElem
 */
function XPlainText(text) {
  XLabel.call(this, text);
  this.type = "text";
  this.color = "primary";
}

XPlainText.prototype = Object.create(XLabel.prototype);

XPlainText.prototype.render = function() {
  var view = $("<b class='text-" + this.color + "'>" + this.val + "</b>");
  this.bind(view);
  return view;
}

XPlainText.prototype.buildEditor = function() {
  var baseEditor = XFormElem.prototype.buildEditor.call(this);
  var labelEditor = XLabel.prototype.buildEditor.call(this);
  var view = $("<select class='form-control'></select>");
  var model = this;

  view.append($('<option>', {
    value: "primary",
    text : "Primary"
  }));
  view.append($('<option>', {
    value: "secondary",
    text : "Secondary"
  }));
  view.append($('<option>', {
    value: "success",
    text : "Success"
  }));
  view.append($('<option>', {
    value: "danger",
    text : "Danger"
  }));
  view.append($('<option>', {
    value: "warning",
    text : "Warning"
  }));
  view.append($('<option>', {
    value: "info",
    text : "Information"
  }));

  view.on("change", function() {
    var val = $(this).val();
    model.color = val;
    var currentView = $("*[data-x-id='" + model.id + "']");
    currentView.replaceWith(model.render());
  });

  baseEditor.append(labelEditor);
  baseEditor.append(view);
  
  return baseEditor;
}

export { XPlainText };
