import XLabel from './label.js';
import $ as jQ from 'jquery';

function XPlainText(text) {
  XLabel.call(this, text);
  this.type = "text";
  this.color = "primary";
}

XPlainText.prototype = Object.create(XLabel.prototype);

XPlainText.prototype.render = function() {
  var view = jQ("<b class='text-" + this.color + "'>" + this.val + "</b>");
  this.bind(view);
  return view;
}

XPlainText.prototype.buildEditor = function() {
  var baseEditor = XLabel.prototype.buildEditor.call(this);
  var view = jQ("<select class='form-control'></select>");
  var model = this;

  view.append(jQ('<option>', {
    value: "primary",
    text : "Elsődleges"
  }));
  view.append(jQ('<option>', {
    value: "secondary",
    text : "Másodlagos"
  }));
  view.append(jQ('<option>', {
    value: "success",
    text : "Siker"
  }));
  view.append(jQ('<option>', {
    value: "danger",
    text : "Veszély"
  }));
  view.append(jQ('<option>', {
    value: "warning",
    text : "Figyelmeztetés"
  }));
  view.append(jQ('<option>', {
    value: "info",
    text : "Információ"
  }));

  view.on("change", function() {
    var val = $(this).val();
    model.color = val;
    var currentView = jQ("*[data-x-id='" + model.id + "']");
    currentView.replaceWith(model.render());
  });

  baseEditor.append(view);
  return baseEditor;
}

export XPlainText;
