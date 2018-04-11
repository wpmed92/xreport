//XReport form components
var XReportForm = (function(jQ) {
  //Base XFormElem
  function XFormElem(type) {
    var that = this;
    that.type = type;
    that.id = that.genUniqueId();
  }

  XFormElem.prototype.genUniqueId = function() {
    XFormElem.numInstances = (XFormElem.numInstances || 0) + 1;
    return "x-elem-" + XFormElem.numInstances;
  }

  XFormElem.prototype.bind = function(view) {
    view.attr("data-x-id", this.id);
  }

  XFormElem.prototype.buildEditor = function() {

  }

  //label
  function XLabel(label) {
    XFormElem.call(this, "label");
    this.val = label;
  }

  XLabel.prototype = Object.create(XFormElem.prototype);

  XLabel.prototype.render = function() {
    var view = jQ("<label>" + this.val + "</label>");
    this.bind(view);
    return view;
  }

  XLabel.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div class='form-group'></div>");
    editor.append("<label>Mező neve</label>");
    var inp = jQ("<input type='text' class='form-control'>");
    inp.val(model.val);

    inp.on("change", function() {
      var val = jQ(this).val();
      model.val = val;
      var view = jQ("*[data-x-id='" + model.id + "']");
      view.text(val);
    });

    editor.append(inp);
    return editor;
  }

  //Numberbox
  function XInNum(min, max, unit) {
    XFormElem.call(this, "innum");
    this.min = min;
    this.max = max;
    this.unit = unit;
  }

  XInNum.prototype = Object.create(XFormElem.prototype);

  XInNum.prototype.render = function() {
    var model = this;
    var view = jQ("<input type='number' class='form-control'>");
    this.bind(view);
    return view;
  }

  XInNum.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div></div>");
    var view = jQ("*[data-x-id='" + model.id + "']");
    var minWrapper = jQ("<div class='form-group'><label>Minimum érték</label></div>");
    var minControl = jQ("<input type='number' class='form-control'>");
    var maxWrapper = jQ("<div class='form-group'><label>Maximum érték</label></div>");
    var maxControl = jQ("<input type='number' class='form-control'>");
    var unitWrapper = jQ("<div class='form-group' class='form-control'><label>Mértékegység</label></div>");
    var unitControl = jQ("<input type='text' class='form-control'>");

    minControl.val(model.min);
    maxControl.val(model.max);

    minControl.on("change", function() {
      var val = jQ(this).val();
      model.min = val;
      view.attr("min", val);
    });

    maxControl.on("change", function() {
      var val = jQ(this).val();
      model.max = val;
      view.attr("max", val);
    });

    unitControl.on("change", function() {
      var val = jQ(this).val();
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

  //Textbox
  function XInText() {
    XFormElem.call(this, "intext");
  }

  XInText.prototype = Object.create(XFormElem.prototype);

  XInText.prototype.render = function() {
    return jQ("<input type='text' class='form-control'>");
  }

  //Checkbox
  function XInBool(style) {
    XFormElem.call(this, "inbool");
    this.style = style || "checkbox";
  }

  XInBool.prototype = Object.create(XFormElem.prototype);

  XInBool.prototype.render = function() {
    return jQ("<div class='form-check'>\
                <input class='form-check-input' type='" + this.style + "'>\
              </div>");
  }

  //textArea
  function XTextArea(rows) {
    XFormElem.call(this, "tarea");
    this.rows = 3;
  }

  XTextArea.prototype = Object.create(XFormElem.prototype);

  XTextArea.prototype.render = function() {
    return jQ("<textarea class='form-control' rows='" + this.rows + "'></textarea>");
  }

  //Select
  function XSel(style) {
    XFormElem.call(this, "sel");
    this.style = style || "default";
    this.options = [];
  }

  XSel.prototype = Object.create(XFormElem.prototype);

  XSel.prototype.render = function() {
    var view = "";

    if (this.style === "radio") {
      view = jQ("<div></div>");
    } else {
      view = jQ("<select class='form-control'></select>");
    }

    this.bind(view);
    return view;
  }

  XSel.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var textArea = jQ("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var updateOptionsBtn = jQ("<br><button type='button' class='btn btn-secondary'>Mentés</button>");
    var view = jQ("*[data-x-id='" + model.id + "']");

    updateOptionsBtn.click(function() {
      var text = textArea.val();
      var splitted = text.split(';');
      model.options = [];

      splitted.forEach(function(option) {
        if (!option || option === "") {
          return;
        }

        model.options.push(option);

        if (model.style === "radio") {
            var inbool = new XInBool("radio");
            var inboolView = inbool.render();
            inboolView.find("input").first().attr("name", model.id);
            var radio = inboolView.append(new XLabel(option).render());
            view.append(radio);
        } else {
          view.append(jQ('<option>', {
            value: option,
            text : option
          }));
        }
      });
    });

    editor.append(textArea);
    editor.append(updateOptionsBtn);
    return editor;
  }

  //Multiple select
  function XMulSel(style) {
    XFormElem.call(this, "mulsel");
    this.style = style || "default";
    this.options = [];
  }

  XMulSel.prototype = Object.create(XFormElem.prototype);

  XMulSel.prototype.render = function() {
    var view = "";

    if (this.style === "checkbox") {
      view = jQ("<div></div>");
    } else {
      view = jQ("<select class='form-control' multiple></select>");
    }

    this.bind(view);
    return view;
  }

  XMulSel.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var textArea = jQ("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var updateOptionsBtn = jQ("<br><button type='button' class='btn btn-secondary'>Mentés</button>");
    var view = jQ("*[data-x-id='" + model.id + "']");

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

        if (model.style === "checkbox") {
            var inbool = new XInBool();
            var inboolView = inbool.render();
            var check = inboolView.append(new XLabel(option).render());
            view.append(check);
        } else {
          view.append(jQ('<option>', {
            value: option,
            text : option
          }));
        }
      });
    });

    editor.append(textArea);
    editor.append(updateOptionsBtn);
    return editor;
  }

  //Form group
  //orientation can be "horizontal" or "vertical"
  function XFormGroup(orientation, label) {
    XFormElem.call(this, "group");
    this.child = "";
    this.label = new XLabel(label);
    this.orientation = orientation;
  }

  XFormGroup.prototype = Object.create(XFormElem.prototype);

  XFormGroup.prototype.addChild = function(child) {
    this.child = child;
  }

  XFormGroup.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div></div>");
    editor.append(this.label.buildEditor());
    editor.append(this.child.buildEditor());
    return editor;
  }

  XFormGroup.prototype.render = function() {
    var viewWrapper = jQ("<div></div>");
    var view = jQ("<div class='form-group'></div>");
    var diagnostic = jQ("<div><span class='text-info x-diagnostic'>group: " + this.id + "; label: " + this.label.id + "; input: " + this.child.id + "</span></div>");
    //viewWrapper.append(diagnostic);
    this.bind(view);
    //view.append(diagnostic);

    if (this.orientation === "vertical") {
      if (this.child.type === "inbool") {
        view.append(this.child.render().append(this.label.render()));
      } else {
        view.append(this.label.render());
        view.append(this.child.render());
      }
    } else {
      console.log("Unknown orientation");
    }

    viewWrapper.append(view);
    return viewWrapper;
  }

  //Form row (for custom elems)
  function XFormRow() {
    XFormElem.call(this, "row");
    this.children = [];
  }

  XFormRow.prototype = Object.create(XFormElem.prototype);

  XFormRow.prototype.addChild = function(child) {
    this.children.push(child);
  }

  XFormRow.prototype.render = function() {
    var view = jQ("<div class='form row'></div>");
    this.bind(view);
    var equalColWidth = Math.floor(12 / this.children.length);
    var needsBalancing = this.children.length % 12;

    if (equalColWidth >= 1) {
      this.children.forEach(function(child) {
        var col = jQ("<div class='col-" + equalColWidth + "'></div>");
        col.append(child.render());
        view.append(col);
      });
    }

    return view;
  }

  XFormRow.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div></div>");

    model.children.forEach(function(child) {
      editor.append(child.buildEditor());
    });

    return editor;
  }

  return {
    Label: XLabel,
    Text: XInText,
    Num: XInNum,
    Bool: XInBool,
    Sel: XSel,
    MulSel: XMulSel,
    Group: XFormGroup,
    Row: XFormRow,
    TextArea: XTextArea
  }
})($);