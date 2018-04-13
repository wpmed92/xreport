var XReportBuilder = (function(jQ, XReportForm) {
  var _module = {};
  var xFormView = null;
  var xScheme = {
    title: "",
    clinics: [],
    report: [],
    opinion: []
  };
  var xForm = [];
  var currentRow = new XReportForm.Row();
  var editState = false;
  var inlineMode = false;

  function replacer(key, value) {
    if (key === "id") {
      return undefined;
    } else {
      return value;
    }
  }

  //Wraps every XFormElem into an editor
  function editorWrapper(xElem, row) {
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    var formElemWrapperContent = $("<div class='x-form-wrapper-content'></div>");
    formElemWrapperContent.append(xElem.render());

    //Create editor buttons
    var buttonGroup = $("<div class='btn-group x-form-edit-group' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-primary x-form-edit-btn " + (editState ? "collapse" : "") + "'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-danger x-form-edit-btn " + (editState ? "collapse" : "") + "'><i class='fas fa-minus-circle'></i></button>");
    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);

    //Create editor menu
    editButton.click(function() {
      buildEditor(xElem);
    });

    //Remove elem
    removeButton.click(function() {
      formElemWrapper.remove();
      row.children.splice(row.children.indexOf(xElem), 1);

      if (row.children.length == 0) {
        var curRowIndex = xForm.indexOf(row);
        xForm.splice(curRowIndex, 1);
        currentRow = (curRowIndex < xForm.length) ? xForm[curRowIndex] : xForm[xForm.length-1];
      } else {
        currentRow = row;
        reRenderRow(row);
      }

      diagnosticPrint();
    });

    formElemWrapper.append(formElemWrapperContent);
    formElemWrapper.append(buttonGroup);
    return formElemWrapper;
  }

  function reRenderRow(row) {
    var view = $("*[data-x-id='" + row.id + "']");
    view.replaceWith(row.render(editorWrapper));
  }

  function addRowToForm(row) {
    xForm.push(row);
    xFormView.append(row.render(editorWrapper));
  }

  function addToForm(xElem) {
    if (!inlineMode) {
      currentRow = new XReportForm.Row();
      currentRow.addChild(xElem);
    } else {
      currentRow.addChild(xElem);

      if (currentRow.children.length > 1) {
        reRenderRow(currentRow);
        diagnosticPrint();
        return;
      }
    }

    xForm.push(currentRow);
    xFormView.append(currentRow.render(editorWrapper));
    diagnosticPrint();
  }

  function diagnosticPrint() {
    console.log(JSON.stringify(xForm, replacer));
  }

  function buildEditor(xElem) {
    $("#editor").html(xElem.buildEditor());
    $("#a-editor").tab("show");
  }

  function createFormElemFromJSON(formElem) {
    var type = formElem.type;

    if (type === "group") {
      var group = Object.assign(new XReportForm.Group, formElem);
      group.label = Object.assign(new XReportForm.Label, formElem.label);
      group.child = createFormElemFromJSON(formElem.child);
      return group;
    } else if (type === "intext") {
      return Object.assign(new XReportForm.Text, formElem);
    } else if (type === "innum") {
      return Object.assign(new XReportForm.Num, formElem);
    } else if (type === "inbool") {
      return Object.assign(new XReportForm.Bool, formElem);
    } else if (type === "tarea") {
      return Object.assign(new XReportForm.TextArea, formElem);
    } else if (type === "sel") {
      return Object.assign(new XReportForm.Sel, formElem);
    } else if (type === "mulsel") {
      return Object.assign(new XReportForm.MulSel, formElem);
    } else if (type === "date") {
      return Object.assign(new XReportForm.Datepicker, formElem);
    } else if (type === "row") {
      var row = Object.assign(new XReportForm.Row, formElem);

      for (var i = 0; i < row.children.length; i++) {
        row.children[i] = createFormElemFromJSON(row.children[i]);
      }

      return row;
    }
  }

  _module.initBuilder = function() {
    xScheme = {
      title: "",
      clinics: [],
      report: [],
      opinion: []
    };
  }

  _module.newLineMode = function() {
    inlineMode = false;
  }

  _module.inlineMode = function() {
    inlineMode = true;
  }

  _module.toggleEditState = function() {
    editState = !editState;
    $(".x-form-edit-btn").toggleClass("collapse");
    $(".x-diagnostic").toggleClass("collapse");
    $("#div-editor-panel").toggleClass("collapse");
  }

  _module.useClinicsSection = function() {
    xForm = xScheme.clinics;
    xFormView = jQ("#x-form-clinics");
  }

  _module.useReportSection = function() {
    xForm = xScheme.report;
    xFormView = jQ("#x-form-report");
  }

  _module.useOpinionSection = function() {
    xForm = xScheme.opinion;
    xFormView = jQ("#x-form-opinion");
  }

  _module.buildReportFromJSON = function(name, json) {
    $("#input-scheme-title").val(name);

    //Build clinincs part
    _module.useClinicsSection();
    xFormView.html("");
    json.clinics.forEach(function(clinicsElem) {
      var celem = createFormElemFromJSON(clinicsElem);
      addRowToForm(celem);
      diagnosticPrint();
    });

    //Build report part
    _module.useReportSection();
    xFormView.html("");
    json.report.forEach(function(reportElem) {
      var relem = createFormElemFromJSON(reportElem);
      addRowToForm(relem);
      diagnosticPrint();
    });

    //Build opinion part
    _module.useOpinionSection();
    xFormView.html("");
    json.opinion.forEach(function(opinionElem) {
      var oelem = createFormElemFromJSON(opinionElem);
      addRowToForm(oelem);
    });
  }

  _module.setReportTitle = function(title) {
    xScheme.title = title;
  }

  _module.getReportTitle = function() {
    return xScheme.title;
  }

  _module.getReportInJSON = function() {
    return JSON.stringify(xScheme);
  }

  _module.getReportInJSONFile = function() {
    return new Blob([_module.getReportInJSON()], {type: "application/json"});
  }

  _module.addTextGroup = function() {
    var group = new XReportForm.Group("vertical", "Szöveges mező");
    group.addChild(new XReportForm.Text());
    addToForm(group);
  }

  _module.addNumberGroup = function() {
    var group = new XReportForm.Group("vertical", "Szám mező");
    group.addChild(new XReportForm.Num());
    addToForm(group);
  }

  _module.addBoolGroup = function() {
    var group = new XReportForm.Group("vertical", "Eldöntendő mező");
    group.addChild(new XReportForm.Bool());
    addToForm(group);
  }

  _module.addSelGroup = function() {
    var group = new XReportForm.Group("vertical", "Egyszeres választás");
    group.addChild(new XReportForm.Sel());
    addToForm(group);
  }

  _module.addMulSelGroup = function() {
    var group = new XReportForm.Group("vertical", "Többszörös választás");
    group.addChild(new XReportForm.MulSel("checkbox"));
    addToForm(group);
  }

  _module.addTextAreaGroup = function() {
    var group = new XReportForm.Group("vertical", "Szabad szöveg");
    group.addChild(new XReportForm.TextArea(4));
    addToForm(group);
  }

  _module.addDateGroup = function() {
    var group = new XReportForm.Group("vertical", "Dátum");
    group.addChild(new XReportForm.Datepicker());
    addToForm(group);
  }

  return _module;
})($, XReportForm);
