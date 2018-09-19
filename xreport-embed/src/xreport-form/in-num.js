import { XFormElem } from './form-elem.js';
import $ from 'jquery';

function XInNum() {
  XFormElem.call(this, "innum");
  this.min = -Infinity;
  this.max = Infinity;
  this.unit = "";
}

XInNum.prototype = Object.create(XFormElem.prototype);

XInNum.prototype.render = function() {
  var model = this;
  var view = $("<input type='number' class='form-control' min='" + model.min + "' max='" + model.max + "' >");
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

XInNum.prototype.buildEditor = function() {
  var model = this;
  var editor = $("<div></div>");
  var view = $("*[data-x-id='" + model.id + "']");
  var minWrapper = $("<div class='form-group'><label>Minimum érték</label></div>");
  var minControl = $("<input type='number' class='form-control'>");
  var maxWrapper = $("<div class='form-group'><label>Maximum érték</label></div>");
  var maxControl = $("<input type='number' class='form-control'>");
  var unitWrapper = $("<div class='form-group' class='form-control'><label>Mértékegység</label></div>");
  var unitControl = $("<input type='text' class='form-control'>");

  unitControl.val(model.unit);
  minControl.val(model.min);
  maxControl.val(model.max);

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
  editor.append(minWrapper);
  editor.append(maxWrapper);
  editor.append(unitWrapper);

  return editor;
}

export { XInNum };
