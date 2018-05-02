var XReportBuilder = (function(jQ, XReportForm) {
  //#region PRIVATE VARIABLES
  var module = {};
  var xFormView = null;
  var xScheme = {
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
        <div class="dropdown x-row-editor-component ' + (!editState ? "collapse" : "") + '">\
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
            module.addTextGroup(row);
            break;
          case 1:
            module.addNumberGroup(row);
            break;
          case 2:
            module.addBoolGroup(row);
            break;
          case 3:
            module.addSelGroup(row);
            break;
          case 4:
            module.addMulSelGroup(row);
            break;
          case 5:
            module.addTextAreaGroup(row);
            break;
          case 6:
            module.addDateGroup(row);
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
  function editorWrapper(view, xElem, row) {
    //Create editor buttons
    var buttonGroup = $("<div class='btn-group x-form-edit-group' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-outline-primary x-form-edit-btn'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-outline-danger x-form-edit-btn'><i class='fas fa-minus-circle'></i></button>");

    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);

    //Create editor menu
    editButton.click(function() {
      buildEditor(xElem);
    });

    //Remove elem
    removeButton.click(function() {
      row.children.splice(row.children.indexOf(xElem), 1);

      if (row.children.length == 0) {
        var curRowIndex = xForm.indexOf(row);
        xForm.splice(curRowIndex, 1);
        $("*[data-x-id='" + row.id + "']").remove();
      } else {
        //elem -> btn-group -> col
        $(this).parent().parent().remove();
      }
    });

    return buttonGroup;
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
    } else if (type === "danger") {
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
    xFormView.append(row.render());
    $("*[data-x-id='" + xElem.id + "']").parent().closest("div").hover(
      function() {
        $(this).append(editorWrapper($("*[data-x-id='" + xElem.id + "']"), xElem, row));
      }, function() {
          $(this).find(".x-form-edit-group").remove();
      }
    );
  }
  //#endregion

  //#region ROW MANUPULATION
  function renderRow(row, prevElem) {
    var newRow = row.render();

    if (prevElem) {
      newRow.insertAfter(prevElem);
    } else {
      xFormView.append(newRow);
    }
  }

  function addRowToForm(row) {
    xForm.push(row);
    xFormView.append(row.render());

    row.children.forEach(function(child) {
      $("*[data-x-id='" + child.id + "']").parent().closest("div").hover(
        function() {
          $(this).append(editorWrapper($("*[data-x-id='" + child.id + "']"), child, row));
        }, function() {
            $(this).find(".x-form-edit-group").remove();
        }
      );
    });

    $("*[data-x-id='" + row.id + "']").append($("<div class='col-auto d-flex align-items-center'></div>").append(rowEditorComponent.createFor(row)));
  }

  function duplicateRow(row) {
    var insertAt = xForm.indexOf(row) + 1;
    var newRow = new XReportForm.Row();

    for (var i = 0; i < row.children.length; i++) {
      newRow.addChild(createFormElemFromJSON(row.children[i]));
      newRow.children[i].id = newRow.children[i].genUniqueId();

      if (newRow.children[i].type === "group") {
        newRow.children[i].label.id = newRow.children[i].label.genUniqueId();
        newRow.children[i].child.id = newRow.children[i].child.genUniqueId();
      }
    }

    xForm.splice(insertAt, 0, newRow);
    renderRow(newRow, /*prevElem*/$("*[data-x-id='" + row.id + "']"));
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
  //#endregion

  //#region API
  module.initBuilder = function() {
    xScheme = {
      clinics: [],
      report: [],
      opinion: []
    };

    if (sortable) {
      sortable.destroy();
      sortable = null;
    }
  }

  module.toggleEditState = function() {
    editState = !editState;
    $(".x-form-edit-btn").toggleClass("collapse");
    $(".x-diagnostic").toggleClass("collapse");
    $(".x-editor-wrapper").toggleClass("collapse");
    $(".x-row-editor-component").toggleClass("collapse");
    $("#div-editor-panel").toggleClass("collapse");
    sortable.option("disabled", !editState);
  }

  module.useClinicsSection = function() {
    xForm = xScheme.clinics;
    xFormView = jQ("#x-form-clinics");
  }

  module.useReportSection = function(clear) {
    xForm = xScheme.report;
    xFormView = jQ("#x-form-report");

    if (clear) {
      xFormView.html("");
    }

    if (sortable == null) {
      sortable = Sortable.create(xFormView[0], {
        disabled: !editState,
        onEnd: function (evt) {
          var temp = xForm[evt.oldIndex];
          xForm.splice(evt.oldIndex, 1);
          xForm.splice(evt.newIndex, 0, temp);
      	}
      });
    }
  }

  module.useOpinionSection = function() {
    xForm = xScheme.opinion;
    xFormView = jQ("#x-form-opinion");
  }

  module.buildReportFromJSON = function(json) {
    //Build clinincs part
    module.useClinicsSection();
    xFormView.html("");
    json.clinics.forEach(function(clinicsElem) {
      var celem = createFormElemFromJSON(clinicsElem);
      addRowToForm(celem);

    });

    //Build opinion part
    module.useOpinionSection();
    xFormView.html("");
    json.opinion.forEach(function(opinionElem) {
      var oelem = createFormElemFromJSON(opinionElem);
      addRowToForm(oelem);
    });

    //Build report part
    module.useReportSection();
    xFormView.html("");
    json.report.forEach(function(reportElem) {
      var relem = createFormElemFromJSON(reportElem);
      addRowToForm(relem);

    });
  }

  module.getReportInJSON = function() {
    return JSON.stringify(xScheme, replacer);
  }

  module.getReportInJSONFile = function() {
    return new Blob([module.getReportInJSON()], {type: "application/json"});
  }

  module.addTextGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szöveges mező");
    group.addChild(new XReportForm.Text());

    if (row) {
      row.addChild(group);
      renderRow(row);
      return;
    }

    addToForm(group);
  }

  module.addNumberGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szám mező");
    group.addChild(new XReportForm.Num());

    if (row) {
      row.addChild(group);
      renderRow(row);
      return;
    }

    addToForm(group);
  }

  module.addBoolGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Eldöntendő mező");
    group.addChild(new XReportForm.Bool());

    if (row) {
      row.addChild(group);
      renderRow(row);
      return;
    }

    addToForm(group);
  }

  module.addSelGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Egyszeres választás");
    group.addChild(new XReportForm.Sel("radio"));

    if (row) {
      row.addChild(group);
      renderRow(row);
      return;
    }

    addToForm(group);
  }

  module.addMulSelGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Többszörös választás");
    group.addChild(new XReportForm.MulSel("checkbox"));

    if (row) {
      row.addChild(group);
      renderRow(row);
      return;
    }

    addToForm(group);
  }

  module.addTextAreaGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szabad szöveg");
    group.addChild(new XReportForm.TextArea(4));

    if (row) {
      row.addChild(group);
      renderRow(row);
      return;
    }

    addToForm(group);
  }

  module.addDateGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Dátum");
    group.addChild(new XReportForm.Datepicker());

    if (row) {
      row.addChild(group);
      renderRow(row);
      return;
    }

    addToForm(group);
  }

  module.addHeader = function() {
    addToForm(new XReportForm.Header("Szekció cím"));
  }

  module.addInfo = function() {
    addToForm(new XReportForm.Info("Magyarázó szöveg", "info"));
  }
  
  module.addRating = function() {
    addToForm(new XReportForm.Rating());
  }
  //#endregion

  return module;
})($, XReportForm);
