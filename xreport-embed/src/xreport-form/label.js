import { XFormElem } from './form-elem.js';
import $ from 'jquery';

function XLabel(label) {
  XFormElem.call(this, "label");
  this.val = label;
}

XLabel.prototype = Object.create(XFormElem.prototype);

XLabel.prototype.render = function(forId) {
  var _for = (forId) ? ("for='" + forId + "'") : "";
  var formattedVal = (forId) ? this.val : ("<b>" + this.val + "</b>");
  var view = $("<label " + _for + ">" + formattedVal + "</label>");
  this.bind(view);
  return view;
}

XLabel.prototype.buildEditor = function() {
  var model = this;
  var editor = $("<div class='form-group'></div>");
  editor.append("<label>Field name</label>");
  var inp = $("<input type='text' class='form-control'>");
  inp.val(model.val);

  inp.on("change", function() {
    var val = $(this).val();
    model.val = val;
    var view = $("*[data-x-id='" + model.id + "']");

    if (model.type === "header") {
      view.find(":header").text(val);
    } else {
      if (view.find("b").length > 0) {
        view.find("b").eq(0).text(val);
      } else {
        view.text(val);
      }
    }
  });

  editor.append(inp);
  return editor;
}

export { XLabel };
