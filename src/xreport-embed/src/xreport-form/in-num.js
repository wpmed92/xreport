import { XFormElem } from './form-elem';
import $ from 'jquery';

/**
 * Instantiates a new XInNum that renders a numerical input field.
 * @class
 * @augments XFormElem
 */
function XInNum() {
  XFormElem.call(this, "innum");
  this.min = -Infinity;
  this.max = Infinity;
  this.unit = "";
  this.default = 0;
}

XInNum.prototype = Object.create(XFormElem.prototype);

XInNum.prototype.render = function() {
  var model = this;
  var view = $("<input type='number' class='form-control' min='" + model.min + "' max='" + model.max + "' value='" + model.default + "'>");
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

XInNum.prototype.setValue = function(val) {
  return $("*[data-x-id='" + this.id + "']").val(val);
}

XInNum.prototype.getValue = function() {
  return $("*[data-x-id='" + this.id + "']").val();
}

XInNum.prototype.genText = function() {
  var val = $("*[data-x-id='" + this.id + "']").val();

  if (!val) {
    return null;
  }

  return $("*[data-x-id='" + this.id + "']").val() + " " + ((this.unit) ? this.unit : "");
}

XInNum.prototype.prettyPrint = function() {
  var view = "<p>" + $("*[data-x-id='" + this.id + "']").val() + " " + ((this.unit) ? this.unit : "") + "</p>";
  return view;
}

XInNum.prototype.buildEditor = function() {
  var baseEditor = XFormElem.prototype.buildEditor.call(this);
  var model = this;
  var editor = $("<div></div>");
  var view = $("*[data-x-id='" + model.id + "']");
  var defaultWrapper = $("<div class='form-group'><label>Default</label></div>");
  var defaultControl = $("<input type='number' class='form-control'>");
  var minWrapper = $("<div class='form-group'><label>Minimum</label></div>");
  var minControl = $("<input type='number' class='form-control'>");
  var maxWrapper = $("<div class='form-group'><label>Maximum</label></div>");
  var maxControl = $("<input type='number' class='form-control'>");
  var unitWrapper = $("<div class='form-group' class='form-control'><label>Unit</label></div>");
  var unitControl = $("<input type='text' class='form-control'>");

  unitControl.val(model.unit);
  minControl.val(model.min);
  maxControl.val(model.max);
  defaultControl.val(model.default);

  defaultControl.on("change", function() {
    var val = $(this).val();
    model.default = val;
    view.attr("value", val);
  });

  minControl.on("change", function() {
    var val = $(this).val();
    model.min = val;
    view.attr("min", val);
  });

  maxControl.on("change", function() {
    var val = $(this).val();
    model.max = val;
    view.attr("max", val);
  });

  unitControl.on("change", function() {
    var val = $(this).val();
    model.unit = val;

    if (!val) {
      view.parent().find(".input-group-append").remove();
      return;
    }

    if (!view.parent().hasClass("input-group")) {
      view.wrap("<div class='input-group mb-3'></div>");
      view.parent().append("<div class='input-group-append'>\
                              <span class='input-group-text'>" + model.unit + "</span>\
                            </div>");
    } else {
      view.parent().find(".input-group-text").first().html(model.unit);
    }
  });

  minWrapper.append(minControl);
  maxWrapper.append(maxControl);
  unitWrapper.append(unitControl);
  defaultWrapper.append(defaultControl);
  editor.append(minWrapper);
  editor.append(maxWrapper);
  editor.append(unitWrapper);
  editor.append(defaultWrapper);
  baseEditor.append(editor);
  return baseEditor;
}

export { XInNum };
