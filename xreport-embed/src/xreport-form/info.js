import { XLabel } from './label';
import { XFormElem } from './form-elem';
import $ from 'jquery';

function XInfo(text, type) {
  XLabel.call(this, text);
  this.type = type;
}

XInfo.prototype = Object.create(XLabel.prototype);

XInfo.prototype.render = function() {
  var view = $("<div></div>");
  var questionMark = $("<i class='fas fa-question-circle text-info'></i>");
  var infoContent = $("<div class='alert alert-" + this.type + " collapse' role='alert'>" + this.val + "</div>");

  questionMark.click(function() {
    $(this).next().toggleClass("collapse");
  });

  view.append(questionMark);
  view.append(infoContent);
  this.bind(infoContent);
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
