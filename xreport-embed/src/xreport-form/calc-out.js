import { XFormElem } from './form-elem.js';
import $ from 'jquery';

function XCalcOut() {
  XFormElem.call(this, "calcout");
  this.min = -Infinity;
  this.max = Infinity;
  this.unit = "";
}

XCalcOut.prototype = Object.create(XFormElem.prototype);

XCalcOut.prototype.render = function() {
  var model = this;
  var view = $("<input type='number' class='form-control' min='" + model.min + "' max='" + model.max + "' disabled>");
  this.bind(view);

  if (model.unit) {
    view.wrap("<div class='input-group mb-3'></div>");
    view.parent().append("<div class='input-group-append'>\
                            <span class='input-group-text'>" + model.unit + "</span>\
                          </div>");
    view = view.parent();
  }

  return view;
}

XCalcOut.prototype.getValue = function() {
  return $("*[data-x-id='" + this.id + "']").val();
}

XCalcOut.prototype.genText = function() {
  var val = $("*[data-x-id='" + this.id + "']").val();

  if (!val) {
    return null;
  }

  return $("*[data-x-id='" + this.id + "']").val() + " " + ((this.unit) ? this.unit : "");
}

XCalcOut.prototype.buildEditor = function() {
  var model = this;
  var editor = $("<div></div>");
  var view = $("*[data-x-id='" + model.id + "']");
  var unitWrapper = $("<div class='form-group' class='form-control'><label>Mértékegység</label></div>");
  var unitControl = $("<input type='text' class='form-control'>");
  unitControl.val(model.unit);

  unitControl.on("change", function() {
    var val = $(this).val();
    var wasUnitEmpty = model.unit === "";
    model.unit = val;

    if (wasUnitEmpty) {
      view.replaceWith(model.render());
    } else {
      view.parent().replaceWith(model.render());
    }
  });

  unitWrapper.append(unitControl);
  editor.append(unitWrapper);
  return editor;
}

export { XCalcOut };
