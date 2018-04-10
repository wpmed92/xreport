//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var xscheme = {
    title: "",
    clinics: [],
    report: [],
    opinion: []
  };

  var rules = [];

  var xform = xscheme.clinics;
  var xformView = $("#x-form-clinics");

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
  function XInNum(min, max, unit) {
    XFormElem.call(this, "innum");
    this.min = min;
    this.max = max;
    this.unit = unit;
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
    var unitWrapper = $("<div class='form-group' class='form-control'><label>Mértékegység</label></div>");
    var unitControl = $("<input type='text' class='form-control'>");

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

  //Textbox
  function XInText() {
    XFormElem.call(this, "intext");
  }

  XInText.prototype = Object.create(XFormElem.prototype);

  XInText.prototype.render = function() {
    return $("<input type='text' class='form-control'>");
  }

  //Checkbox
  function XInBool(style) {
    XFormElem.call(this, "inbool");
    this.style = style || "checkbox";
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
  function XSel(style) {
    XFormElem.call(this, "sel");
    this.style = style || "default";
    this.options = [];
  }

  XSel.prototype = Object.create(XFormElem.prototype);

  XSel.prototype.render = function() {
    var view = "";

    if (this.style === "radio") {
      view = $("<div></div>");
    } else {
      view = $("<select class='form-control'></select>");
    }

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
          view.append($('<option>', {
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
      view = $("<div></div>");
    } else {
      view = $("<select class='form-control' multiple></select>");
    }

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
          view.append($('<option>', {
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
    var editor = $("<div></div>");
    editor.append(this.label.buildEditor());
    editor.append(this.child.buildEditor());
    return editor;
  }

  XFormGroup.prototype.render = function() {
    var viewWrapper = $("<div></div>");
    var view = $("<div class='form-group'></div>");
    var diagnostic = $("<div><span class='text-info x-diagnostic'>group: " + this.id + "; label: " + this.label.id + "; input: " + this.child.id + "</span></div>");
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
    var view = $("<div class='form row'></div>");
    this.bind(view);
    var equalColWidth = Math.floor(12 / this.children.length);
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

  XFormRow.prototype.buildEditor = function() {
    var model = this;
    var editor = $("<div></div>");

    model.children.forEach(function(child) {
      editor.append(child.buildEditor());
    });

    return editor;
  }

  //Handles tab navigation
  function navTabsClick() {
    $(this).tab('show');
  }

  function buildEditor(xelem) {
    $("#editor").html(xelem.buildEditor());
    $("#a-editor").tab("show");
  }

  var formRow = new XFormRow();

  function addToForm(xelem) {
    if (!isInlineMode()) {
      formRow = new XFormRow();
    }

    xform.push(xelem);
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    var formElemWrapperContent = $("<div class='x-form-wrapper-content'></div>");
    formElemWrapperContent.append(xelem.render());
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
    formElemWrapper.append(formElemWrapperContent);
    formElemWrapper.append(buttonGroup);
    xformView.append(formElemWrapper);
  };

  function replacer(key, value) {
    if (key === "id") {
      return undefined;
    } else {
      return value;
    }
  }

  function addInline(elem) {
    formRow.addChild(elem);

    if (formRow.children.length > 1) {
      var view = $("*[data-x-id='" + formRow.id + "']").parent();
      view.empty();
      view.append(formRow.render());
    } else {
      addToForm(formRow);
    }
  }

  function isInlineMode() {
    return $("#btn-inline").hasClass("active");
  }

  function addFormElem(type) {
    var elem = "";

    switch (type) {
      case "intext":
        elem = new XFormGroup("vertical", "Szöveges mező");
        elem.addChild(new XInText());
        break;

      case "innum":
        elem = new XFormGroup("vertical", "Szám mező");
        elem.addChild(new XInNum());
        break;

      case "inbool":
        elem = new XFormGroup("vertical", "Eldöntendő mező");
        elem.addChild(new XInBool());
        break;

      case "sel":
        elem = new XFormGroup("vertical", "Egyszeres választás");
        elem.addChild(new XSel());
        break;

      case "mulsel":
        elem = new XFormGroup("vertical", "Többszörös választás");
        elem.addChild(new XMulSel("checkbox"));
        break;

      case "tarea":
        elem = new XFormGroup("vertical", "Szabad szöveg");
        elem.addChild(new XTextArea(4));
        break;

      default:
        console.log("Unknown form elem: " + type);
        break;
    }

    if (isInlineMode()) {
      addInline(elem);
    } else {
      addToForm(elem);
    }

    //Diagnostic
    console.log(JSON.stringify(xform, replacer));
  }

  function getReports() {
    $("#li-schemes").html("");

    api.getReports().then(function(reports) {
      reports.forEach(function(report) {
        $("#li-schemes").append("<a href='#' class='list-group-item list-group-item-action report-list-item' data-id='" + report.id + "'>" + report.data().name + "</a>");
      });
    }).catch(function(error) {
      console.log(error);
    });
  }

  function assigner(formElem) {
    var type = formElem.type;

    if (type === "group") {
      var group = Object.assign(new XFormGroup, formElem);
      group.label = Object.assign(new XLabel, formElem.label);

      if (formElem.child.type === "inbool")
      group.child = Object.assign(new XInBool, formElem.child);
    } else if (type === "intext") {
      return new XInText();
    } else if (type === "innum") {
      return new XInNum();
    } else if ()
  }
  function buildReportFromJSON(json) {
    //Build clinincs part
    json.clinics.forEach(function(clinicsElem) {
      if (clinicsElem.type === "group") {
        var group = Object.assign(new XFormGroup, formElem);
        group.label = Object.assign(new XLabel, formElem.label);

        if (formElem.child.type === "inbool")
        group.child = Object.assign(new XInBool, formElem.child);
        addToForm(group);
      }
    });

    //Build report part

    //Build opinion part
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
    var reportJSON = JSON.stringify(xscheme);
    var reportFile = new Blob([reportJSON], {type: "application/json"});
    api.saveReport({
      file: reportFile,
      name: xscheme.title,
      creator: "Test User"
    });
  });
  $("body").on('click', "#li-schemes a", function() {
    var reportId = $(this).attr("data-id");
    api.getReport(reportId).then(function(report) {
        if (report.exists) {
          console.log("Document data:", report.data());
          $.getJSON(report.data().contentUrl, function(json) {
            buildReportFromJSON(json);
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
  });
  $("#btn-toggle-edit").click(function(e) {
    e.preventDefault();
    $(".x-form-edit-btn").toggleClass("collapse");
    $(".x-diagnostic").toggleClass("collapse");
  });
  $("#btn-run-script").click(function() {
    var scriptText = $("#script-area").val();
  });

  $("#input-scheme-title").on("change", function(e) {
    e.preventDefault();
    xscheme.title = $(this).val();
  })
  //Report section selection
  $("#btn-clinics-section").click(function() {
    xform = xscheme.clinics;
    xformView = $("#x-form-clinics");
  });
  $("#btn-report-section").click(function() {
    xform = xscheme.report;
    xformView = $("#x-form-report");
  });
  $("#btn-opinion-section").click(function() {
    xform = xscheme.opinion;
    xformView = $("#x-form-opinion");
  });

  //Navbar
  $("#a-builder").click(function() {
    $("#div-builder").removeClass("collapse");
    $("#div-schemes").addClass("collapse");
  });
  $("#a-schemes").click(function() {
    $("#div-schemes").removeClass("collapse");
    $("#div-builder").addClass("collapse");
    getReports();
  });
});
