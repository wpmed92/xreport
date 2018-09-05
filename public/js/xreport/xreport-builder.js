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
  var conditionEditorMode = false;

  //TEST: conditional form
  var conditionPool = [];

  var rowEditorComponent = (function() {
    function getView() {
      return $('\
        <div class="dropdown x-row-editor-component ' + (!editState ? "collapse" : "") + '">\
          <button class="btn btn-sm btn-outline-secondary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
            <i class="fas fa-ellipsis-v"></i>\
          </button>\
          <div class="dropdown-menu">\
            <a href="#" class="dropdown-item"><i class="fas fa-font"></i> Szöveges mező</a>\
            <a href="#" class="dropdown-item"><i class="fas fa-text-width"></i> Egyszerű szöveg</a>\
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
            module.addPlainText(row);
            break;
          case 2:
            module.addNumberGroup(row);
            break;
          case 3:
            module.addBoolGroup(row);
            break;
          case 4:
            module.addSelGroup(row);
            break;
          case 5:
            module.addMulSelGroup(row);
            break;
          case 6:
            module.addTextAreaGroup(row);
            break;
          case 7:
            module.addDateGroup(row);
            break;

          //Actions
          //delete
          case 9:
            deleteRow(row);
            break;
          //duplicate
          case 10:
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
    } else if (type === "text") {
      return Object.assign(new XReportForm.PlainText, formElem);
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
    } else if (type === "image") {
      return Object.assign(new XReportForm.Image, formElem);
    } else if (type === "row") {
      var row = Object.assign(new XReportForm.Row, formElem);

      for (var i = 0; i < row.children.length; i++) {
        row.children[i] = createFormElemFromJSON(row.children[i]);
      }

      return row;
    }
  }

  function addToForm(elem, after, insertAt) {
    var row = null;
    var rowView = null;

    if (elem.type === "row") {
      row = elem;
    } else {
      row = new XReportForm.Row();
      row.addChild(elem);
    }

    rowView = row.render();

    if (after) {
      xForm.splice(insertAt, 0, row);
      rowView.insertAfter(after);
    } else {
      xForm.push(row);
      xFormView.append(rowView);
    }

    row.children.forEach(function(child) {
      $("*[data-x-id='" + child.id + "']").parent().closest("div").hover(
        function() {
          $(this).append(editorWrapper($("*[data-x-id='" + child.id + "']"), child, row));
        }, function() {
            $(this).find(".x-form-edit-group").remove();
        }
      );
    });

    rowView.append($("<div class='col-auto d-flex align-items-center x-row-editor'></div>").append(rowEditorComponent.createFor(row)));
  }
  //#endregion

  //#region ROW MANUPULATION
  function appendToRow(row, elem) {
    row.addChild(elem);
    var col = $("<div class='col x-form-wrapper'></div>").append(elem.render());
    col.insertBefore($("*[data-x-id='" + row.id + "']").find(".x-row-editor"));
    col.hover(
      function() {
        $(this).append(editorWrapper($("*[data-x-id='" + elem.id + "']"), elem, row));
      }, function() {
          $(this).find(".x-form-edit-group").remove();
      }
    );
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

    addToForm(newRow, $("*[data-x-id='" + row.id + "']"), insertAt);
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

  //#region CONDITIONAL EDITOR
  //WHEN
  function whenComponent() {
    var component = $("<div></div>");
    var header = $("<h5>Feltétel</h5><hr>");

    component.append(header);
    component.append(ANDGroupComponent());
    component.append(ORConnectorComponent(component));

    return component;
  }

  function whenComponentRow(parent) {
    var row = $("<div class='form-row'></div");

    row.append($("<div class='form-group col'></div>").append(elementSelectorComponent(row, /*withoutEvent*/ false)));
    row.append($("<div class='form-group col'></div>").append(comparatorSelectorComponent()));
    row.append($("<div class='form-group col'></div>").append(valueSelectorComponent(row)));
    row.append($("<div class='form-group col'></div>").append(ANDConnectorComponent(parent)));

    return row;
  }

  function ANDConnectorComponent(parent) {
    var component =  $("<button type='button' class='btn btn-sm btn-primary and-connector'><i class='fas fa-plus'></i></button");

    component.click(function() {
      parent.append(whenComponentRow(parent));
      var btn = $(this);
      btn.replaceWith("<p><span class='badge badge-primary'>ÉS</span></p>");
    });

    return component;
  }

  function ORConnectorComponent(parent) {
    var component = $("<button type='button' class='btn btn-sm btn-primary or-connector'><i class='fas fa-plus'></i></button");

    component.click(function() {
      parent.append(ANDGroupComponent());
      var btn = $(this);
      btn.replaceWith("<p><span class='badge badge-secondary'>VAGY</span></p>");
      parent.append(ORConnectorComponent(parent));
    });

    return component;
  }

  function ANDGroupComponent() {
    var component = $("<div class='and-group'></div>");

    component.append(whenComponentRow(component));

    return component;
  }

  //DO
  function doComponent() {
    var parent = $("<div></div>");
    var component = $("<div class='do-group'></div>");
    var addDoComponent = $("<button type='button' class='btn btn-sm btn-primary do-adder'><i class='fas fa-plus'></i></button");

    component.append(doComponentRow());

    addDoComponent.click(function() {
      component.append(doComponentRow());
    });

    parent.append(component);
    parent.append(addDoComponent);

    return parent;
  }

  function doComponentRow() {
    var component = $("<div class='form-row'></div>");

    component.append($("<div class='form-group col'></div>").append(actionSelectorComponent()));
    component.append($("<div class='form-group col'></div>").append(elementSelectorComponent(component, /*withoutEvent*/ true, /*isActionSelector*/ true)));

    return component;
  }

  function elementSelectorComponent(parent, withoutEvent, isActionSelector) {
    var report = xScheme.report;
    var component = $("<select class='select-element form-control'></select>");

    report.forEach(function(row) {
      row.children.forEach(function(child) {
        if (child.type === "group") {
          var label = child.label.val;

          component.append(jQ('<option>', {
            value: child.child.id,
            text: label,
            data: { type: child.child.type, raw: child.child }
          }));
        } else if (isActionSelector) {
          component.append(jQ('<option>', {
            value: child.id,
            text: child.val,
            data: { type: child.type, raw: child }
          }));
        }
      });
    });

    if (withoutEvent) {
      return component;
    }

    component.change(function() {
      var optionSelected = $("option:selected", this);
      var type = optionSelected.data("type");
      var comparatorList = typeToComparator[type];
      var comparatorSelector = parent.find(".select-comparator").first();
      var valueSelector = parent.find(".condition-value").first();
      comparatorSelector.html("");

      valueSelector.replaceWith(valueSelectorComponent(parent));

      comparatorList.forEach(function(comparator) {
        comparatorSelector.append(jQ('<option>', {
          value: comparator.val,
          text: comparator.text
        }));
      });
    });

    return component;
  }

  var typeToComparator = {
    "innum": [
      {
        val: "eq",
        text: "Egyenlő"
      },
      {
        val: "neq",
        text: "Nem egyenlő"
      },
      {
        val: "lt",
        text: "Kisebb"
      },
      {
        val: "gt",
        text: "Nagyobb"
      },
      {
        val: "gteq",
        text: "Nagyobb egyenlő"
      },
      {
        val: "lteq",
        text: "Kisebb egyenlő"
      }
    ],
    "sel": [
      {
        val: "eq",
        text: "Egyenlő"
      },
      {
        val: "neq",
        text: "Nem egyenlő"
      },
      {
        val: "lt",
        text: "Kisebb"
      },
      {
        val: "gt",
        text: "Nagyobb"
      },
      {
        val: "gteq",
        text: "Nagyobb egyenlő"
      },
      {
        val: "lteq",
        text: "Kisebb egyenlő"
      }
    ],
    "intext": [
      {
        val: "eq",
        text: "Egyenlő"
      },
      {
        val: "neq",
        text: "Nem egyenlő"
      },
      {
        val: "cont",
        text: "Tartalmazza"
      },
      {
        val: "ncont",
        text: "Nem tartalmazza"
      }
    ],
    "inbool": [
      {
        val: "t",
        text: "Igaz"
      },
      {
        val: "f",
        text: "hamis"
      }
    ]
  }

  function comparatorSelectorComponent() {
    return $("<select class='form-control select-comparator'></select>");
  }

  function valueSelectorComponent(row) {
    var component = $("<input class='form-control condition-value'>");
    var selectedElement = row.find(".select-element :selected").data("raw");

    if (selectedElement.type === "sel") {
      component = $("<select class='form-control condition-value'></select>");

      selectedElement.options.forEach(function(option) {
        component.append(jQ('<option>', {
          value: option,
          text : option
        }));
      });
    }

    return component;
  }

  function actionSelectorComponent() {
    var component = $("<select class='form-control select-action'></select>");

    [{ val: "show", text: "Mutat" }, { val: "hide", text: "Elrejt" }].forEach(function(action) {
      component.append(jQ('<option>', {
        value: action.val,
        text: action.text
      }));
    });

    return component;
  }

  function addConditionComponent() {
    var component = $("<button type='button' class='btn btn-primary'>Hozzáad</button>");

    component.click(function() {
      conditionPool.push(buildConditions());
    });

    return component;
  }

  function buildConditions() {
    var condition = {};
    condition.orConnector = [];
    condition.actions = [];

    //Extract conditions
    $(".and-group").each(function() {
      var andConnector = [];

      $(this).find(".form-row").each(function() {
        var row = $(this);
        var and = {};
        and.left = row.find(".select-element").eq(0).val();
        and.right = row.find(".condition-value").eq(0).val();
        and.comp = row.find(".select-comparator").eq(0).val();
        andConnector.push(and);
      });

      condition.orConnector.push(andConnector);
    });

    //Extract actions
    $(".do-group").each(function() {
      $(this).find(".form-row").each(function() {
        var row = $(this);
        var action = {};
        var trueAction = row.find(".select-action").val();
        var falseAction = (trueAction === "show") ? "hide" : "show";
        var target = row.find(".select-element").val();

        action.true = {
          doWhat: trueAction,
          onWhat: target
        };

        action.false = {
          doWhat: falseAction,
          onWhat: target
        };

        condition.actions.push(action);
      });
    });

    return condition;
  }

  function processVal(val) {
    var numericVal = parseInt(val);

    if (isNaN(numericVal)) {
      return val;
    } else {
      return numericVal;
    }
  }

  function getValueFromXElem(id) {
    var val;

    xForm.forEach(function(row) {
      row.children.forEach(function(child) {
        if (child.type === "group") {
          var inId = child.child.id;

          if (inId == id) {
            val = child.child.getValue();
          }
        }
      });
    });

    return val;
  }

  function evalCondition(condition) {
    var leftVal = processVal(getValueFromXElem(condition.left));
    var rightVal = processVal(condition.right);

    switch (condition.comp) {
      case "eq":
        return leftVal == rightVal;
      case "neq":
        return leftVal != rightVal;
      case "lt":
        return leftVal < rightVal;
      case "gt":
        return leftVal > rightVal;
      case "lteq":
        return leftVal <= rightVal;
      case "gteq":
        return leftVal >= rightVal;
    }
  }

  function doAction(action) {
    switch (action.doWhat) {
      case "hide":
        jQ("*[data-x-id='" + action.onWhat + "']").closest(".col").hide();
        break;

      case "show":
        jQ("*[data-x-id='" + action.onWhat + "']").closest(".col").show();
        break;
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

    //TODO: refactor me
    var form = $("<form></form>");
    form.on("change", function() {
      var conditionEvaluator = false;

      conditionPool.forEach(function(condition) {
        var orOutput = [];

        condition.orConnector.forEach(function(andGroup) {
          var andOutput = true;

          andGroup.forEach(function(andCondition) {
            if (!evalCondition(andCondition)) {
              andOutput = false;
              return;
            }
          });

          orOutput.push(andOutput);
        });

        if (orOutput.includes(true)) {
          condition.actions.forEach(function(action) {
            doAction(action.true);
          });
        } else {
          condition.actions.forEach(function(action) {
            doAction(action.false);
          });
        }
      });
    });

    xFormView.wrap(form);

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
      addToForm(celem);

    });

    //Build opinion part
    module.useOpinionSection();
    xFormView.html("");
    json.opinion.forEach(function(opinionElem) {
      var oelem = createFormElemFromJSON(opinionElem);
      addToForm(oelem);
    });

    //Build report part
    module.useReportSection();
    xFormView.html("");

    json.report.forEach(function(reportElem) {
      var relem = createFormElemFromJSON(reportElem);
      addToForm(relem);
    });

    conditionPool = json.conditions || [];

    //Initial trigger;
    xFormView.trigger("change");

    buildConditionView();
  }

  module.toggleConditionEditor = function() {
    conditionEditorMode = !conditionEditorMode;

    if (conditionEditorMode) {
      buildConditionView();
    } else {
      //saveConditions();
    }
  }

  function buildConditionView() {
    var conditionView = $("#x-form-conditions");
    conditionView.html("");

    //When
    conditionView.append(whenComponent());

    //Actions
    conditionView.append(doComponent());
    conditionView.append(addConditionComponent());
  }

  function saveConditions() {
    conditionPool.push(buildConditions());
  }

  module.getReportInJSON = function() {
    xScheme.conditions = conditionPool

    return JSON.stringify(xScheme);
  }

  module.genText = function() {
    var out = "";

    xScheme.report.forEach(function(elem) {
      out += elem.genText();
    });

    return out;
  }

  module.getReportInJSONFile = function() {
    return new Blob([module.getReportInJSON()], {type: "application/json"});
  }

  module.addTextGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szöveges mező");
    group.addChild(new XReportForm.Text());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToForm(group);
  }

  module.addNumberGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szám mező");
    group.addChild(new XReportForm.Num());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToForm(group);
  }

  module.addBoolGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Eldöntendő mező");
    group.addChild(new XReportForm.Bool());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToForm(group);
  }

  module.addSelGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Egyszeres választás");
    group.addChild(new XReportForm.Sel("radio"));

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToForm(group);
  }

  module.addMulSelGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Többszörös választás");
    group.addChild(new XReportForm.MulSel("checkbox"));

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToForm(group);
  }

  module.addPlainText = function(row) {
    var plainText = new XReportForm.PlainText("Egyszerű szöveg");

    if (row) {
      appendToRow(row, plainText);
      return;
    }

    addToForm(plainText);
  }

  module.addTextAreaGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Szabad szöveg");
    group.addChild(new XReportForm.TextArea(4));

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToForm(group);
  }

  module.addDateGroup = function(row) {
    var group = new XReportForm.Group("vertical", "Dátum");
    group.addChild(new XReportForm.Datepicker());

    if (row) {
      appendToRow(row, group);
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


  module.addImage = function() {
    addToForm(new XReportForm.Image());
  }
  //#endregion

  return module;
})($, XReportForm);
