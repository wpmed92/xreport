//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var xscheme = {
    title: "",
    form: []
  };

  var rules = [];

  var xform = xscheme.form;

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
    var view = $("<label>" + this.val + "</label>");
    this.bind(view);
    return view;
  }

  XLabel.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div class='form-group'></div>");
    editor.append("<label>Mező neve</label>");
    var inp = $("<input type='text' class='form-control'>");
    inp.val(model.val);

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
  function XInNum(min, max, rule) {
    XFormElem.call(this, "innum");
    this.min = min;
    this.max = max;
    this.rule = rule;
  }

  XInNum.prototype = Object.create(XFormElem.prototype);

  XInNum.prototype.render = function() {
    var model = this;
    var view = $("<input type='number' class='form-control'>");
    this.bind(view);
    return view;
  }

  XInNum.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div></div>");
    var view = $("*[data-x-id='" + model.id + "']");
    var minWrapper = $("<div class='form-group'><label>Minimum érték</label></div>");
    var minControl = $("<input type='number' class='form-control'>");
    var maxWrapper = $("<div class='form-group'><label>Maximum érték</label></div>");
    var maxControl = $("<input type='number' class='form-control'>");

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

    minWrapper.append(minControl);
    maxWrapper.append(maxControl);
    editor.append(minWrapper);
    editor.append(maxWrapper);
    return editor;
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
    return $("<textarea class='form-control' rows='" + this.rows + "'></textarea>");
  }

  //Select
  function XSel() {
    XFormElem.call(this, "sel");
    this.options = [];
  }

  XSel.prototype = Object.create(XFormElem.prototype);

  XSel.prototype.render = function() {
    var view = $("<select class='form-control'></select>");
    this.bind(view);
    return view;
  }

  XSel.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var textArea = $("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var updateOptionsBtn = $("<br><button type='button' class='btn btn-secondary'>Mentés</button>");
    var view = $("*[data-x-id='" + model.id + "']");

    updateOptionsBtn.click(function() {
      var text = textArea.val();
      var splitted = text.split(';');

      splitted.forEach(function(option) {
        if (!option || option === "") {
          return;
        }

        model.options.push(option);
        view.append($('<option>', {
          value: option,
          text : option
        }));
      });
    });

    editor.append(textArea);
    editor.append(updateOptionsBtn);
    return editor;
  }

  //Multiple select
  function XMulSel() {
    XFormElem.call(this, "mulsel");
    this.options = [];
  }

  XMulSel.prototype = Object.create(XFormElem.prototype);

  XMulSel.prototype.render = function(customRenderer) {
    var view = $("<select class='form-control' multiple></select>");
    this.bind(view);
    return view;
  }

  XMulSel.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var textArea = $("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var updateOptionsBtn = $("<br><button type='button' class='btn btn-secondary'>Mentés</button>");
    var view = $("*[data-x-id='" + model.id + "']");

    updateOptionsBtn.click(function() {
      var text = textArea.val();
      var splitted = text.split(';');

      splitted.forEach(function(option) {
        if (!option || option === "") {
          return;
        }

        model.options.push(option);
        view.append($('<option>', {
          value: option,
          text : option
        }));
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
    var editor = $("<div></div>");
    editor.append(this.label.buildEditor());
    editor.append(this.child.buildEditor());
    return editor;
  }

  XFormGroup.prototype.render = function() {
    var viewWrapper = $("<div></div>");
    var view = $("<div class='form-group'></div>");
    var diagnostic = $("<div><span class='text-info x-diagnostic'>group: " + this.id + "; label: " + this.label.id + "; input: " + this.child.id + "</span></div>");
    viewWrapper.append(diagnostic);
    this.bind(view);
    view.append(diagnostic);

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
    var view = $("<div class='form row'></div>");
    this.bind(view);
    var equalColWidth = Math.floor(this.children.length, 12);
    var needsBalancing = this.children.length % 12;

    if (equalColWidth >= 1) {
      this.children.forEach(function(child) {
        var col = $("<div class='col-" + equalColWidth + "'></div>");
        col.append(child.render());
        view.append(col);
      });
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

  function addToForm(xelem) {
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    formElemWrapper.append(xelem.render());
    var buttonGroup = $("<div class='btn-group x-form-edit-group' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-primary x-form-edit-btn'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-danger x-form-edit-btn'><i class='fas fa-minus-circle'></i></button>");
    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);
    editButton.click(function() {
      buildEditor(xelem);
    });
    removeButton.click(function() {
      formElemWrapper.remove();
      xform = xform.filter(function(el) {
        return el.id !== xelem.id;
      });
    });
    formElemWrapper.append(buttonGroup);
    $("#x-form").append(formElemWrapper);
  };

  function replacer(key, value) {
    if (key === "id") {
      return undefined;
    } else {
      return value;
    }
  }

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

      case "tarea":
        var tarea = new XFormGroup("vertical", "Szabad szöveg");
        tarea.addChild(new XTextArea(4));
        xform.push(tarea);
        addToForm(tarea);
        break;

      default:
        console.log("Unknown form elem: " + type);
        break;
    }

    console.log(JSON.stringify(xform, replacer));
  }

  function getSchemesFromStorage() {
    $("#div-grid-schemes").html("");

    var keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
      var col = $("<div class='col-3'></div>");
      var card = $("<div class='card'></div>");
      var cardBody = $("<div class='card-body'></div>");
      cardBody.append("<div style='font-size:3em' class='d-flex justify-content-center'><i class='fas fa-file-medical-alt'></i></div>");
      cardBody.append("<div class='d-flex justify-content-center'><h5 clas='card-title'>" + key + "</h5></div>");
      card.append(cardBody);
      col.append(card);
      $("#div-grid-schemes").append(col);
    }
  }

  function getElem(xid) {
    return $("*[data-x-id='" + c + "']")
  }

  //Events
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
  $("#btn-add-textarea").click(function() {
    addFormElem("tarea");
  });
  $("#btn-save-scheme").click(function() {
    localStorage.setItem(xscheme.title, JSON.stringify(xscheme.form));
  });
  $("#btn-toggle-edit").click(function(e) {
    e.preventDefault();
    $(".x-form-edit-btn").toggleClass("collapse");
    $(".x-diagnostic").toggleClass("collapse");
  });
  $("#btn-run-script").click(function() {
    var scriptText = $("#script-area").val();
  });

  //Navbar
  $("#a-builder").click(function() {
    $("#div-builder").removeClass("collapse");
    $("#div-schemes").addClass("collapse");
  });
  $("#a-schemes").click(function() {
    $("#div-schemes").removeClass("collapse");
    $("#div-builder").addClass("collapse");
    getSchemesFromStorage();
  });
});
