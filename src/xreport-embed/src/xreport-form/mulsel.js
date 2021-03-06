import { XFormElem } from './form-elem';
import { XInBool } from './in-bool';
import { XLabel } from './label';
import $ from 'jquery';

/**
 * Instantiates a new XMulSel to show a multiple selection field
 * @class
 * @augments XFormElem
 */
function XMulSel(style) {
  XFormElem.call(this, "mulsel");
  this.style = style || "default";
  this.options = ["Option 1", "Option 2"];
}

XMulSel.prototype = Object.create(XFormElem.prototype);

XMulSel.prototype.render = function() {
  var view = "";
  var model = this;

  if (this.style === "checkbox") {
    view = $("<div></div>");

    model.options.forEach(function(option) {
      var inbool = new XInBool();
      var isOptionChecked = option.startsWith("*");

      if (isOptionChecked) {
        option = option.slice(1, option.length);
      }

      var inboolView = inbool.render(isOptionChecked);
      var check = inboolView.append(new XLabel(option).render(inbool.id));
      view.append(check);
    });
  } else {
    view = $("<select class='form-control' multiple></select>");
  }

  this.bind(view);
  return view;
}

XMulSel.prototype.checkOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).prop("checked", true);
}

XMulSel.prototype.uncheckOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).prop("checked", false);
}

XMulSel.prototype.showOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).parent().removeClass("collapse");
}

XMulSel.prototype.hideOption = function(option) {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']");
  var indexOfOption = model.options.indexOf(option);
  view.find("input").eq(indexOfOption).parent().addClass("collapse");
}

XMulSel.prototype.genText = function() {
  var out = "";
  var view = $("*[data-x-id='" + this.id + "']");

  view.find("input:checked").each(function() {
    var label = $(this).next();
    out += label.text() + ", ";
  });

  out = out.slice(0, out.length - 2);

  return out;
}

XMulSel.prototype.buildEditor = function() {
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
    view.empty();
    model.options = [];

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

export { XMulSel };
