//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var xform = [];

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

  XFormElem.prototype.buildEditor = function() {

  }

  //label
  function XLabel(label) {
    XFormElem.call(this, "label");
    this.val = label;
  }

  XLabel.prototype = Object.create(XFormElem.prototype);

  XLabel.prototype.render = function() {
    var view = $("<label>" + this.val + "</label>");
    view.attr("data-x-id", this.id);
    return view;
  }

  XLabel.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div class='form-group'></div>");
    editor.append("<label>Mező neve</label>");
    var inp = $("<input type='text' class='form-control'>");

    inp.on("change", function() {
      var val = $(this).val();
      model.val = val;
      var view = $("*[data-x-id='" + model.id + "']");
      view.text(val);
    });

    editor.append(inp);
    return editor;
  }

  //Numberbox
  function XInNum(min, max) {
    XFormElem.call(this, "innum");
    this.min = min;
    this.max = max;
  }

  XInNum.prototype = Object.create(XFormElem.prototype);

  XInNum.prototype.render = function() {
    return $("<input type='number' class='form-control'>");
  }

  //Textbox
  function XInText() {
    XFormElem.call(this, "intext");
  }

  XInText.prototype = Object.create(XFormElem.prototype);

  XInText.prototype.render = function() {
    return $("<input type='text' class='form-control'>");
  }

  //Checkbox
  function XInBool() {
    XFormElem.call(this, "inbool");
  }

  XInBool.prototype = Object.create(XFormElem.prototype);

  XInBool.prototype.render = function() {
    return $("<div class='form-check'>\
                <input class='form-check-input' type='checkbox'>\
              </div>");
  }

  //Select
  function XSel() {
    XFormElem.call(this, "sel");
    this.options = [];
  }

  XSel.prototype = Object.create(XFormElem.prototype);

  XSel.prototype.render = function() {
    var view = $("<select class='form-control'></select>");
    view.attr("data-x-id", this.id);
    return view;
  }

  XSel.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var inp = $("<input type='text' class='form-control'>");
    var view = $("*[data-x-id='" + model.id + "']");

    inp.on("change", function() {
      var val = $(this).val();
      model.options.push(val);
      view.append($('<option>', {
        value: val,
        text : val
      }));
    });

    editor.append(inp);
    return editor;
  }

  //Multiple select
  function XMulSel() {
    XFormElem.call(this, "mulsel");
    this.options = [];
  }

  XMulSel.prototype = Object.create(XFormElem.prototype);

  XMulSel.prototype.render = function() {
    var view = $("<select class='form-control' multiple></select>");
    view.attr("data-x-id", this.id);
    return view;
  }

  XMulSel.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var inp = $("<input type='text' class='form-control'>");
    var view = $("*[data-x-id='" + model.id + "']");

    inp.on("change", function() {
      var val = $(this).val();
      model.options.push(val);
      view.append($('<option>', {
        value: val,
        text : val
      }));
    });

    editor.append(inp);
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
    var editor = $("<div></div>");
    editor.append(this.label.buildEditor());
    editor.append(this.child.buildEditor());
    return editor;
  }

  XFormGroup.prototype.render = function() {
    var viewVertical = $("<div class='form-group'></div>");
    var viewHorizontal = $("<div class='form-group row'></div>");
    var view = "";

    if (this.orientation === "vertical") {
      view = viewVertical;

      if (this.child.type === "inbool") {
        view.append(this.child.render().append(this.label.render()));
      } else {
        view.append(this.label.render());
        view.append(this.child.render());
      }
    } else {
      console.log("Unknown orientation");
    }

    return view;
  }

  //Handles tab navigation
  function navTabsClick() {
    $(this).tab('show');
  }

  function buildEditor(xelem) {
    $("#editor").html(xelem.buildEditor());
    $("#a-editor").tab("show");
  }

  function renderForm() {
    $("#x-form").html("");

    xform.forEach(function(xelem) {
      addToForm(xelem);
    });
  }

  function addToForm(xelem) {
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    formElemWrapper.append(xelem.render());
    var buttonGroup = $("<div class='btn-group x-form-edit-button' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-primary'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-danger'><i class='fas fa-minus-circle'></i></button>");
    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);
    editButton.click(function() {
      buildEditor(xelem);
    });
    removeButton.click(function() {
      formElemWrapper.remove();
    });
    formElemWrapper.append(buttonGroup);
    $("#x-form").append(formElemWrapper);
  };

  function addFormElem(type) {
    switch (type) {
      case "intext":
        var text = new XFormGroup("vertical", "Szöveges mező");
        text.addChild(new XInText());
        xform.push(text);
        addToForm(text);
        break;

      case "innum":
        var num = new XFormGroup("vertical", "Szám mező");
        num.addChild(new XInNum());
        xform.push(num);
        addToForm(num);
        break;

      case "inbool":
        var boolean = new XFormGroup("vertical", "Eldöntendő mező");
        boolean.addChild(new XInBool());
        xform.push(boolean);
        addToForm(boolean);
        break;

      case "sel":
        var sel = new XFormGroup("vertical", "Választás");
        sel.addChild(new XSel());
        xform.push(sel);
        addToForm(sel);
        break;

      case "mulsel":
        var mulsel = new XFormGroup("vertical", "Választás");
        mulsel.addChild(new XMulSel());
        xform.push(mulsel);
        addToForm(mulsel);
        break;

      default:
        console.log("Unknown form elem: " + type);
        break;
    }

    console.log(JSON.stringify(xform));
  }

  $(".nav-tabs a").click(navTabsClick);
  $("#btn-add-textbox").click(function() {
    addFormElem("intext");
  });
  $("#btn-add-numberbox").click(function() {
    addFormElem("innum");
  });
  $("#btn-add-checkbox").click(function() {
    addFormElem("inbool");
  });
  $("#btn-add-select").click(function() {
    addFormElem("sel");
  });
  $("#btn-add-select-multiple").click(function() {
    addFormElem("mulsel");
  });
});
