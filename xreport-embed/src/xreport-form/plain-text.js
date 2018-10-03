import { XLabel } from './label.js';
import $ from 'jquery';

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
  var baseEditor = XLabel.prototype.buildEditor.call(this);
  var view = $("<select class='form-control'></select>");
  var model = this;

  view.append($('<option>', {
    value: "primary",
    text : "Elsődleges"
  }));
  view.append($('<option>', {
    value: "secondary",
    text : "Másodlagos"
  }));
  view.append($('<option>', {
    value: "success",
    text : "Siker"
  }));
  view.append($('<option>', {
    value: "danger",
    text : "Veszély"
  }));
  view.append($('<option>', {
    value: "warning",
    text : "Figyelmeztetés"
  }));
  view.append($('<option>', {
    value: "info",
    text : "Információ"
  }));

  view.on("change", function() {
    var val = $(this).val();
    model.color = val;
    var currentView = $("*[data-x-id='" + model.id + "']");
    currentView.replaceWith(model.render());
  });

  baseEditor.append(view);
  return baseEditor;
}

export { XPlainText };
