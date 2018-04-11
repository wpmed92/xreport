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

  function replacer(key, value) {
    if (key === "id") {
      return undefined;
    } else {
      return value;
    }
  }

  function addToForm(xElem) {
    /*if (!isInlineMode()) {
      formRow = new xReportForm.row();
    }*/

    xForm.push(xElem);
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    var formElemWrapperContent = $("<div class='x-form-wrapper-content'></div>");
    formElemWrapperContent.append(xElem.render());
    var buttonGroup = $("<div class='btn-group x-form-edit-group' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-primary x-form-edit-btn'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-danger x-form-edit-btn'><i class='fas fa-minus-circle'></i></button>");
    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);
    editButton.click(function() {
      buildEditor(xElem);
    });
    removeButton.click(function() {
      formElemWrapper.remove();
      xForm = xForm.filter(function(el) {
        return el.id !== xElem.id;
      });
    });
    formElemWrapper.append(formElemWrapperContent);
    formElemWrapper.append(buttonGroup);
    xFormView.append(formElemWrapper);

    //Diagnostic
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
    } else if (type === "row") {
      var row = Object.assign(new XReportForm.Row, formElem);
      row.children.forEach(function(child) {
        child = createFormElemFromJSON(child);
      });
      return row;
    }
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
      addToForm(celem);
    });

    //Build report part
    _module.useReportSection();
    xFormView.html("");
    json.report.forEach(function(reportElem) {
      var relem = createFormElemFromJSON(reportElem);
      addToForm(relem);
    });

    //Build opinion part
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

  return _module;
})($, XReportForm);
