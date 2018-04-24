var XReportBuilder = (function(jQ, XReportForm) {
  //#region PRIVATE VARIABLES
  var _module = {};
  var xFormView = null;
  var xScheme = {
    title: "",
    clinics: [],
    report: [],
    opinion: []
  };
  var xForm = [];
  var editState = false;
  var sortable = null;

  var rowEditorComponent = (function() {
    function getView() {
      return $('\
        <div class="dropdown">\
          <button class="btn btn-sm btn-outline-secondary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
            <i class="fas fa-ellipsis-v"></i>\
          </button>\
          <div class="dropdown-menu">\
            <a href="#" class="dropdown-item"><i class="fas fa-font"></i> Szöveges mező</a>\
            <a href="#" class="dropdown-item"><i class="fas fa-hashtag"></i> Szám mező</a>\
            <a href="#" class="dropdown-item"><i class="far fa-check-square"></i> Eldöntendő mező</a>\
            <a href="#" class="dropdown-item"><i class="fas fa-bars"></i> Egyszeres választás</a>\
            <a href="#" class="dropdown-item"><i class="fas fa-list"></i> Többszörös választás</a>\
            <a href="#" class="dropdown-item"><i class="fas fa-text-width"></i> Szabadszöveges mező</a>\
            <a href="#" class="dropdown-item"><i class="fas fa-calendar-alt"></i> Dátum</a>\
            <div class="dropdown-divider"></div>\
            <a href="#" class="dropdown-item"><i class="fas fa-trash"></i> Törlés</a>\
            <a href="#" class="dropdown-item"><i class="fas fa-copy"></i> Duplikálás</a>\
          </div>\
        </div>'
      );
    }

    var init = function(row) {
      var view = getView();
      view.find('.dropdown-menu .dropdown-item').on("click", function(e) {

        e.preventDefault();
        var i = $(this).index();

        switch (i) {
          case 0:
            _module.addTextGroup(row);
            break;
          case 1:
            _module.addNumberGroup(row);
            break;
          case 2:
            _module.addBoolGroup(row);
            break;
          case 3:
            _module.addSelGroup(row);
            break;
          case 4:
            _module.addMulSelGroup(row);
            break;
          case 5:
            _module.addTextAreaGroup(row);
            break;
          case 6:
            _module.addDateGroup(row);
            break;

          //Actions
          //delete
          case 8:
            deleteRow(row);
            break;
          //duplicate
          case 9:
            duplicateRow(row);
            break;
        }
      });

      return view;
    }

    return {
      createFor: init
    }
  })();
  //#endregion

  //#region EDITOR CONTROLS
  function editorWrapper(xElem, row) {
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    var formElemWrapperContent = $("<div class='x-form-wrapper-content'></div>");
    formElemWrapperContent.append(xElem.render());

    //Create editor buttons
    var buttonGroup = $("<div class='btn-group x-form-edit-group' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-outline-primary x-form-edit-btn " + (editState ? "collapse" : "") + "'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-outline-danger x-form-edit-btn " + (editState ? "collapse" : "") + "'><i class='fas fa-minus-circle'></i></button>");

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
      } else {
        renderRow(row, /*rerender*/ true);
      }

      diagnosticPrint();
    });

    formElemWrapper.append(formElemWrapperContent);
    formElemWrapper.append(buttonGroup);

    return formElemWrapper;
  }

  function buildEditor(xElem) {
    sortable.option("disabled", true);
    var view = $("*[data-x-id='" + xElem.id + "']");
    var editorWrapper = $("<div class='x-editor-wrapper'></div>");
    var closeBtn = $("<button type='button' class='btn btn-sm btn-outline-danger x-editor-close'><i class='far fa-times-circle'></i></div>");

    closeBtn.click(function() {
      $("*[data-x-id='" + xElem.id + "']").removeClass("d-none");
      editorWrapper.remove();
      $(".x-form-edit-btn").toggleClass("collapse");
      sortable.option("disabled", false);
    });

    editorWrapper.append(xElem.buildEditor());
    editorWrapper.append(closeBtn);
    $("*[data-x-id='" + xElem.id + "']").addClass("d-none");
    $("*[data-x-id='" + xElem.id + "']").parent().append(editorWrapper);
    $(".x-form-edit-btn").toggleClass("collapse");
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
    } else if (type === "header") {
      return Object.assign(new XReportForm.Header, formElem);
    } else if (type === "info") {
      return Object.assign(new XReportForm.Info, formElem);
    } else if (type === "rating") {
      return Object.assign(new XReportForm.Rating, formElem);
    } else if (type === "row") {
      var row = Object.assign(new XReportForm.Row, formElem);

      for (var i = 0; i < row.children.length; i++) {
        row.children[i] = createFormElemFromJSON(row.children[i]);
      }

      return row;
    }
  }

  function addToForm(xElem) {
    var row = new XReportForm.Row();
    row.addChild(xElem);
    xForm.push(row);
    renderRow(row, /*rerender*/ false);
    diagnosticPrint();
  }
  //#endregion

  //#region ROW MANUPULATION
  function renderRow(row, replace) {
    var newRow = row.render();

    if (replace) {
      $("*[data-x-id='" + row.id + "']").replaceWith(newRow);
    } else {
      xFormView.append(newRow);
    }

    row.children.forEach(function(child) {
      $("*[data-x-id='" + child.id + "']").replaceWith(editorWrapper(child, row));
    });

    newRow.append($("<div class='col-auto d-flex align-items-center'></div>").append(rowEditorComponent.createFor(row)));
  }

  function addRowToForm(row) {
    xForm.push(row);
    renderRow(row, /*replace*/ false);
  }

  function duplicateRow(row) {
    var curRowIndex = xForm.indexOf(row);
    var newRow = new XReportForm.Row();

    for (var i = 0; i < row.children.length; i++) {
      newRow.addChild(createFormElemFromJSON(row.children[i]));
      newRow.children[i].id = newRow.children[i].genUniqueId();

      if (newRow.children[i].type === "group") {
        newRow.children[i].label.id = newRow.children[i].label.genUniqueId();
        newRow.children[i].child.id = newRow.children[i].child.genUniqueId();
      }
    }

    xForm.splice(curRowIndex, 0, newRow);
    renderRow(newRow, /*replace*/false);
  }

  function deleteRow(row, view) {
    var curRowIndex = xForm.indexOf(row);
    xForm.splice(curRowIndex, 1);
    $("*[data-x-id='" + row.id + "']").remove();
  }
  //#endregion

  //#region UTILS
  function replacer(key, value) {
    if (key === "id") {
      return undefined;
    } else {
      return value;
    }
  }

  function diagnosticPrint() {
    console.log(JSON.stringify(xForm, replacer));
  }
  //#endregion

  //#region API
  _module.initBuilder = function() {
    xScheme = {
      title: "",
      clinics: [],
      report: [],
      opinion: []
    };
  }

  _module.toggleEditState = function() {
    editState = !editState;
    $(".x-form-edit-btn").toggleClass("collapse");
    $(".x-diagnostic").toggleClass("collapse");
    $(".x-editor-wrapper").toggleClass("collapse");
    $("#div-editor-panel").toggleClass("collapse");
  }

  _module.useClinicsSection = function() {
    xForm = xScheme.clinics;
    xFormView = jQ("#x-form-clinics");
  }

  _module.useReportSection = function() {
    xForm = xScheme.report;
    xFormView = jQ("#x-form-report");
    sortable = Sortable.create(document.getElementById("x-form-report"), {
      onEnd: function (evt) {
    		var itemEl = evt.item;
        var temp = xForm[evt.oldIndex];
        xForm[evt.oldIndex] = xForm[evt.newIndex];
        xForm[evt.newIndex] = temp;
    	}
    });
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

    _module.useReportSection();
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

  _module.addTextGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szöveges mező");
    group.addChild(new XReportForm.Text());

    if (row) {
      row.addChild(group);
      renderRow(row, /*rerender*/ true);
      return;
    }

    addToForm(group);
  }

  _module.addNumberGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szám mező");
    group.addChild(new XReportForm.Num());

    if (row) {
      row.addChild(group);
      renderRow(row, /*rerender*/ true);
      return;
    }

    addToForm(group);
  }

  _module.addBoolGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Eldöntendő mező");
    group.addChild(new XReportForm.Bool());

    if (row) {
      row.addChild(group);
      renderRow(row, /*rerender*/ true);
      return;
    }

    addToForm(group);
  }

  _module.addSelGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Egyszeres választás");
    group.addChild(new XReportForm.Sel());

    if (row) {
      row.addChild(group);
      renderRow(row, /*rerender*/ true);
      return;
    }

    addToForm(group);
  }

  _module.addMulSelGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Többszörös választás");
    group.addChild(new XReportForm.MulSel("checkbox"));

    if (row) {
      row.addChild(group);
      renderRow(row, /*rerender*/ true);
      return;
    }

    addToForm(group);
  }

  _module.addTextAreaGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szabad szöveg");
    group.addChild(new XReportForm.TextArea(4));

    if (row) {
      row.addChild(group);
      renderRow(row, /*rerender*/ true);
      return;
    }

    addToForm(group);
  }

  _module.addDateGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Dátum");
    group.addChild(new XReportForm.Datepicker());

    if (row) {
      row.addChild(group);
      renderRow(row, /*rerender*/ true);
      return;
    }

    addToForm(group);
  }

  _module.addHeader = function() {
    addToForm(new XReportForm.Header("Szekció cím"));
  }

  _module.addInfo = function() {
    addToForm(new XReportForm.Info("Magyarázó szöveg", "info"));
  }

  _module.addRating = function() {
    addToForm(new XReportForm.Rating());
  }
  //#endregion

  return _module;
})($, XReportForm);
