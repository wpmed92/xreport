import XFormElem from './form-elem.js';
import $ as jQ from 'jquery';

function XCalcOut() {
  XFormElem.call(this, "calcout");
  this.min = -Infinity;
  this.max = Infinity;
  this.unit = "";
}

XCalcOut.prototype = Object.create(XFormElem.prototype);

XCalcOut.prototype.render = function() {
  var model = this;
  var view = jQ("<input type='number' class='form-control' min='" + model.min + "' max='" + model.max + "' disabled>");
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
  return jQ("*[data-x-id='" + this.id + "']").val();
}

XCalcOut.prototype.genText = function() {
  var val = jQ("*[data-x-id='" + this.id + "']").val();

  if (!val) {
    return null;
  }

  return jQ("*[data-x-id='" + this.id + "']").val() + " " + ((this.unit) ? this.unit : "");
}

XCalcOut.prototype.buildEditor = function() {
  var model = this;
  var editor = jQ("<div></div>");
  var view = jQ("*[data-x-id='" + model.id + "']");
  var unitWrapper = jQ("<div class='form-group' class='form-control'><label>Mértékegység</label></div>");
  var unitControl = jQ("<input type='text' class='form-control'>");
  unitControl.val(model.unit);

  unitControl.on("change", function() {
    var val = jQ(this).val();
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

export XCalcOut;
