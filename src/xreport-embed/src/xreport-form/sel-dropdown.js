import { XFormElem } from './form-elem';
import $ from 'jquery';

/**
 * Instantiates a new XSelDropdown to show a dropdown single selection field
 * @class
 * @augments XFormElem
 */
function XSelDropdown(style) {
  XFormElem.call(this, "selDropdown");
  this.options = ["Opció 1", "Opció 2"];
}

XSelDropdown.prototype = Object.create(XFormElem.prototype);

XSelDropdown.prototype.render = function() {
  var view = "";
  var model = this;
  model.style = "radio";

  view = $("<select class='form-control'></select>");

  model.options.forEach(function(option) {
      view.append($('<option>', {
      value: option,
      text : option
      }));
  });

  this.bind(view);
  return view;
}

XSelDropdown.prototype.getValue = function() {
  var view = $("*[data-x-id='" + this.id + "']");
  var selectedOption = view.find(":selected").text();

  return selectedOption;
}

XSelDropdown.prototype.checkOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).prop("checked", true);
}

XSelDropdown.prototype.uncheckOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).prop("checked", false);
}

XSelDropdown.prototype.genText = function() {
  var view = $("*[data-x-id='" + this.id + "']");
  var selectedOption = view.find(":selected").text();

  return selectedOption;
}

XSelDropdown.prototype.buildEditor = function() {
  var baseEditor = XFormElem.prototype.buildEditor.call(this);
  var model = this;
  var editor = $("<div class='form-group'></div>");
  editor.append("<label>Options</label>");
  var textArea = $("<textarea class='form-control' rows='5' id='comment'></textarea>");
  var updateOptionsBtn = $("<br><button type='button' class='btn btn-secondary'>Save</button>");
  var view = $("*[data-x-id='" + model.id + "']");

  updateOptionsBtn.click(function() {
    var text = textArea.val();
    var splitted = text.split(';');
    model.options = [];
    view.html("");

    splitted.forEach(function(option) {
      if (!option || option === "") {
        return;
      }

      model.options.push(option);
    });

    view.replaceWith(model.render());
  });

  var optionsStringified = "";

  model.options.forEach(function(option) {
    optionsStringified += option + ";";
  });

  textArea.val(optionsStringified);
  editor.append(textArea);
  editor.append(updateOptionsBtn);
  baseEditor.append(editor);

  return baseEditor;
}

export { XSelDropdown };
