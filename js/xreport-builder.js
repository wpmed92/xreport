//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var xform = [];

  function XFormElem(type) {
    var that = this;
    that.type = type;
  }

  XFormElem.prototype.getType = function() {
    return this.type;
  }

  XFormElem.prototype.render = function() {
    console.log("Render called.");
  }


  function XInNum(min, max) {
    XFormElem.call(this, "innum");
    this.min = min;
    this.max = max;
  }

  XInNum.prototype = Object.create(XFormElem.prototype);

  XInNum.prototype.render = function() {
    return $("<input type='number' class='form-control'>");
  }

  function XInText() {
    XFormElem.call(this, "intext");
  }

  XInText.prototype.render = function() {
    return $("<input type='text' class='form-control'>");
  }

  function XInBool() {
    XFormElem.call(this, "inbool");
  }

  XInBool.prototype.render = function() {
    return $("<div class='form-check'>\
                <input class='form-check-input' type='checkbox'>\
              </div>");
  }

  function XSel() {
    XFormElem.call(this, "sel");
    this.options = [];
  }

  XSel.prototype.render = function() {
    return $("<select class='form-control'></select>");
  }

  function XMulSel() {
    XFormElem.call(this, "mulsel");
    this.options = [];
  }

  XMulSel.prototype.addOption = function(option) {
    this.options.push(option);
  }

  XMulSel.prototype.render = function() {
      return $("<select class='form-control' multiple></select>");
  }

  //orientation can be "horizontal" or "vertical"
  function XFormGroup(orientation, label) {
    this.child = "";
    this.label = label;
    this.orientation = orientation;
  }

  XFormGroup.prototype.addChild = function(child) {
    this.child = child;
  }

  XFormGroup.prototype.buildEditor = function() {
    var model = this;
    var labelEditor = $("<input type='text' class='form-control'>");
    labelEditor.on("change", function() {
      var inp = $(this).val();
      model.label = inp;
      console.log(JSON.stringify(xform));
    });

    return labelEditor;
  }

  XFormGroup.prototype.render = function() {
    var viewVertical = $("<div class='form-group'></div>");
    var viewHorizontal = $("<div class='form-group row'></div>");
    var view = "";

    if (this.orientation === "vertical") {
      view = viewVertical;
      view.append($("<label>" + this.label + "</label>"));
      view.append(this.child.render());
    } else if (this.orientation === "horizontal") {
      view = viewHorizontal;
      view.append($("<label class='col-sm-2 col-form-label'>" + this.label + "</label>"));
      view.append($("<div class='col-sm-10'></div>").append(this.child.render()));
    } else {
      console.log("Unknown orientation");
    }

    return view;
  }


  var editors = {
    "label": '<div class="form-group">\
                <label>Label name</label>\
                <input type="text" class="form-control">\
              </div>',
    "select": '<div class="form-group">\
                <input type="text" class="form-control">\
                <button class="btn btn-primary" type="button">Add option</button>\
              </div>',
    "input": '<div class="form-group">\
                <label>Placeholder text</label>\
                <input type="text" class="form-control">\
              </div>',
    "multiple-select": '<div class="form-group">\
                          <label>Options</label>\
                          <input type="text" class="form-control" placeholder="Option 1">\
                          <input type="text" class="form-control" placeholder="Option 2">\
                          <button class="btn btn-primary" type="button">Add option</button>\
                        </div>'
  }

  function getEditorForType(type, id) {
    var editor = $(editors[type]);

    if (type === "label" || type === "input") {
      editor.find("input").first().change(function() {
        var inp = $(this);
        var val = inp.val();

        if (type === "label") {
          $("#" + id).text(val);
        } else {
          $("#" + id).attr("placeholder", val);
        }
      });
    } else if (type === "select") {
      var optionsInput = editor.find("input").first();
      editor.find(".btn").first().click(function() {
        $("#" + id).append($('<option>', { value: optionsInput.val(), text: optionsInput.val() }));
      });
    } else if (type === "multiple-select") {
      var inputOption1 = editor.find("input").first();
      var inputOption2 = editor.find("input").last();
      var label1 = $("#" + id).find("label").first();
      var label2 = $("#" + id).find("label").last();
      inputOption1.change(function() {
        label1.val($(this).val())
      });
      inputOption2.change(function() {
        label2.val($(this).val())
      });
    }

    return editor;
  }

  var uniqueIdToChildren = giveUniqueIdToChildren();

  function giveUniqueIdToChildren() {
    var counter = 0;

    return function(elem) {
      elem.children().each(function() {
        var child = $(this);

        //If it's a div we're in a form-check
        if (child.is("div")) {
          child.children().each(function() {
            var grandChild = $(this);
            grandChild.attr("id", grandChild.prop("nodeName")  + "-" + counter++);
          });
        } else {
          child.attr("id", child.prop("nodeName") + "-" + counter++);
        }
      });
    }
  }

  //Click on an element in the TEMPLATE SELECTOR
  function templateElemClick() {
    var target = $(this);

    //NOTE: this is the currently working code
    /*var cloneElem = target.parent().find(".x-template").clone();
    uniqueIdToChildren(cloneElem);
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    formElemWrapper.append(cloneElem);
    var buttonGroup = $("<div class='btn-group x-form-edit-button' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-primary'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-danger'><i class='fas fa-minus-circle'></i></button>");
    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);
    editButton.click(formElemClick);
    removeButton.click(function() {
      formElemWrapper.remove();
    });
    formElemWrapper.append(buttonGroup);
    $("#x-form").append(formElemWrapper);*/

    //NOTE: this is the experimental part
    /*var testGroup = new XFormGroup("horizontal", "T2 gócok");
    testGroup.addChild(new XInNum(1,10));

    $("#x-form").append(testGroup.render());*/

    return false;
  }

  //Click on an element in the FORM currently being built
  function formElemClick() {
    var target = $(this).parent().parent().find(".x-template");
    var editorView = $("<div></div>");

    target.children().each(function() {
      var currentElement = $(this);
      var id = currentElement.attr("id");
      var type = currentElement.prop("nodeName").toLowerCase();

      //If we find a div in children, that is required to be a form-check
      if (type === "div") {
        type = "multiple-select";
      }

      var editor = getEditorForType(type, id);
      editorView.append(editor);
    });

    $("#editor").html(editorView)
    $("#a-editor").tab("show");
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
    xform.push(xelem);
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
  });

  function addFormElem(type) {
    switch (type) {
      case "intext":
        var text = new XFormGroup("vertical", "Szöveges mező");
        text.addChild(new XInText());
        addToForm(text);
        break;

      case "innum":
        var num = new XFormGroup("horizontal", "Szám mező");
        num.addChild(new XInNum());
        addToForm(num);
        break;

      case "inbool":
        var boolean = new XFormGroup("vertical", "Eldöntendő mező");
        boolean.addChild(new XInBool());
        addToForm(boolean);
        break;

      case "sel":
        break;

      case "mulsel":
        break;

      default:
        console.log("Unknown form elem: " + type);
        break;
    }

    console.log(JSON.stringify(xform));
  }

  $(".x-template-add-button").click(templateElemClick);
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
});
