import { XLabel } from './label';
import { XFormElem } from './form-elem';
import $ from 'jquery';

function XInfo(text, type) {
  XLabel.call(this, text);
  this.type = type;
}

XInfo.prototype = Object.create(XLabel.prototype);

XInfo.prototype.render = function() {
  var view = $("<div class='alert alert-" + this.type + "' role='alert'>" + this.val + "</div>");
  this.bind(view);
  return view;
}

XInfo.prototype.buildEditor = function() {
  var baseEditor = XFormElem.prototype.buildEditor.call(this);
  var view = $("<select class='form-control'></select>");
  var model = this;

  view.append($('<option>', {
    value: "info",
    text : "Magyarázó szöveg"
  }));
  view.append($('<option>', {
    value: "danger",
    text : "Figyelmeztető szöveg"
  }));

  view.on("change", function() {
    var val = $(this).val();
    model.type = val;
    var currentView = $("*[data-x-id='" + model.id + "']");
    currentView.replaceWith(model.render());
  });

  baseEditor.append(view);
  
  return baseEditor;
}

export { XInfo };
