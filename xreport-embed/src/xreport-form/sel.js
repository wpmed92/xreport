import { XFormElem } from './form-elem.js';
import $ from 'jquery';

function XSel(style) {
  XFormElem.call(this, "sel");
  this.style = style || "default";
  this.options = ["Opció 1", "Opció 2"];
}

XSel.prototype = Object.create(XFormElem.prototype);

XSel.prototype.render = function() {
  var view = "";
  var model = this;
  model.style = "radio";

  if (this.style === "radio") {
    view = $("<div></div>");

    for (var i = 0; i < model.options.length; i++) {
      view.append($('<div class="form-check">\
                        <input class="form-check-input" type="radio" name="' + model.id + '" id="' + model.id +  "-" + i + '" value="option1">\
                        <label class="form-check-label" for="' + model.id + "-" + i + '">'
                          + model.options[i] +
                        '</label>\
                      </div>')
                    );
    }
  } else {
    view = $("<select class='form-control'></select>");

    model.options.forEach(function(option) {
      view.append($('<option>', {
        value: option,
        text : option
      }));
    });
  }

  this.bind(view);
  return view;
}

XSel.prototype.getValue = function() {
  var view = $("*[data-x-id='" + this.id + "']");
  var selectedLabel = view.find("input:checked").first().next();

  return selectedLabel.text();
}

XSel.prototype.checkOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).prop("checked", true);
}

XSel.prototype.uncheckOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).prop("checked", false);
}

XSel.prototype.showOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).parent().removeClass("collapse");
}

XSel.prototype.hideOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).parent().addClass("collapse");
}

XSel.prototype.genText = function() {
  var view = $("*[data-x-id='" + this.id + "']");
  var selectedLabel = view.find("input:checked").first().next();

  return selectedLabel.text();
}

XSel.prototype.buildEditor = function() {
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

export { XSel };
