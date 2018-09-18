import XLabel from './label.js';
import $ as jQ from 'jquery';

function XInfo(text, type) {
  XLabel.call(this, text);
  this.type = type;
}

XInfo.prototype = Object.create(XLabel.prototype);

XInfo.prototype.render = function() {
  var view = jQ("<div class='alert alert-" + this.type + "' role='alert'>" + this.val + "</div>");
  this.bind(view);
  return view;
}

XInfo.prototype.buildEditor = function() {
  var baseEditor = XLabel.prototype.buildEditor.call(this);
  var view = jQ("<select class='form-control'></select>");
  var model = this;

  view.append(jQ('<option>', {
    value: "info",
    text : "Magyarázó szöveg"
  }));
  view.append(jQ('<option>', {
    value: "danger",
    text : "Figyelmeztető szöveg"
  }));

  view.on("change", function() {
    var val = $(this).val();
    model.type = val;
    var currentView = jQ("*[data-x-id='" + model.id + "']");
    currentView.replaceWith(model.render());
  });

  baseEditor.append(view);
  return baseEditor;
}

export XInfo;
