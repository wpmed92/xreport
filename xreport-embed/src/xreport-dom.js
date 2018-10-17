//static controls
import { XLabel } from './xreport-form/label.js';
import { XHeader } from './xreport-form/header.js';
import { XPlainText } from './xreport-form/plain-text.js';
import { XInfo } from './xreport-form/info.js';
import { XImage } from './xreport-form/image.js';
import { XTextArea } from './xreport-form/text-area.js';
//input controls
import { XInNum } from './xreport-form/in-num.js';
import { XInText } from './xreport-form/in-text.js';
import { XInBool } from './xreport-form/in-bool.js';
import { XSel } from './xreport-form/sel.js';
import { XMulSel } from './xreport-form/mulsel.js';
import { XRating } from './xreport-form/rating.js';
import { XCalcOut }from './xreport-form/calc-out.js';
import { XDate} from './xreport-form/date.js';
//parents
import { XFormGroup } from './xreport-form/group.js';
import { XFormRow } from './xreport-form/row.js';
//Components
import { RowEditorComponent } from './components/form-builder/row-editor-component';

import $ from 'jquery';
import * as Sortable from "sortablejs";

//Styles
import './css/editor-styles.css';

function XReportDOM() {
  var dom = [];
  var domView = $("<div></div>");
  var cellEditorMode = false;
  var that = this;
  var script = "";
  var isEditor;
  var cellEditorMode;
  var sortable = createSortable();

  function createSortable() {
    return Sortable.create(domView[0], {
      handle: ".x-row-editor",
      onEnd: function (evt) {
        var temp = dom[evt.oldIndex];
        dom.splice(evt.oldIndex, 1);
        dom.splice(evt.newIndex, 0, temp);
      }
    });
  }

  this.init = function() {
    dom = [];
    domView = $("<div></div>");
    cellEditorMode = false;
    sortable = createSortable();
    script = "";
  }

  var addToDOM = function(elem, after, insertAt) {
    var row = null;
    var rowView = null;

    if (elem.type === "row") {
      row = elem;
    } else {
      row = new XFormRow();
      row.addChild(elem);
    }

    rowView = row.render();

    if (after) {
      dom.splice(insertAt, 0, row);
      rowView.insertAfter(after);
    } else {
      dom.push(row);
      domView.append(rowView);
    }

    console.log(isEditor);

    if (isEditor) {
      row.children.forEach(function(child) {
        $("*[data-x-id='" + child.id + "']").parent().closest("div").hover(
          function() {
            if (cellEditorMode) {
              return;
            }
  
            $(this).append(editorWrapper(child, row));
          }, function() {
              $(this).find(".x-form-edit-group").remove();
          }
        );
      });

      let rowEditor = new RowEditorComponent(that);
      rowView.append($("<div class='col-auto d-flex align-items-center x-row-editor'></div>").append(rowEditor.render(row)));
    }
  }

  this.setIsEditor = function(_isEditor) {
    isEditor = _isEditor;
  }

  this.attachEditorControls = function() {
    for (let i = 0; i < dom.length; i++) {
      let row = dom[i];

      for (let j = 0; j < row.children.length; j++) {
        let child = row.children[j];

        $("*[data-x-id='" + child.id + "']").closest(".x-form-wrapper").hover(
          function() {
            if (cellEditorMode) {
              return;
            }

            $(this).append(editorWrapper(child, row));
          }, function() {
              $(this).find(".x-form-edit-group").remove();
          }
        );
      }
    }
  }

  //{Start}[Row manipulation]
  var appendToRow = function(row, elem) {
    row.addChild(elem);
    var col = $("<div class='col x-form-wrapper'></div>").append(elem.render());
    col.insertBefore($("*[data-x-id='" + row.id + "']").find(".x-row-editor"));
    col.hover(
      function() {
        $(this).append(editorWrapper(elem, row));
      }, function() {
          $(this).find(".x-form-edit-group").remove();
      }
    );
  }

  this.duplicateRow = function(row) {
    var insertAt = dom.indexOf(row) + 1;
    var newRow = new XFormRow();

    for (var i = 0; i < row.children.length; i++) {
      newRow.addChild(createFormElemFromJSON(row.children[i]));
      newRow.children[i].id = newRow.children[i].genUniqueId();

      if (newRow.children[i].type === "group") {
        newRow.children[i].label.id = newRow.children[i].label.genUniqueId();
        newRow.children[i].child.id = newRow.children[i].child.genUniqueId();
      }
    }

    addToDOM(newRow, $("*[data-x-id='" + row.id + "']"), insertAt);
  }

  this.deleteRow = function(row) {
    var curRowIndex = dom.indexOf(row);
    dom.splice(curRowIndex, 1);
    $("*[data-x-id='" + row.id + "']").remove();
  }
  //{End}[Row manipulation]

  //{Start}[Editor components]
  var editorWrapper = function(xElem, row) {
    //Create editor buttons
    var buttonGroup = $("<div class='btn-group x-form-edit-group' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-outline-primary x-form-edit-btn'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-outline-danger x-form-edit-btn'><i class='fas fa-minus-circle'></i></button>");

    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);

    //Create editor menu
    editButton.click(function() {
      cellEditorMode = true;
      buildEditor(xElem);
    });

    //Remove elem
    removeButton.click(function() {
      row.children.splice(row.children.indexOf(xElem), 1);

      if (row.children.length == 0) {
        var curRowIndex = dom.indexOf(row);
        dom.splice(curRowIndex, 1);
        $("*[data-x-id='" + row.id + "']").remove();
      } else {
        //elem -> btn-group -> col
        $(this).parent().parent().remove();
      }
    });

    return buttonGroup;
  }

  var buildEditor = function(xElem) {
    cellEditorMode = true;
    sortable.option("disabled", true);
    var editorWrapper = $("<div class='x-editor-wrapper'></div>");
    var closeBtn = $("<button type='button' class='btn btn-sm btn-outline-danger x-editor-close'><i class='far fa-times-circle'></i></div>");

    closeBtn.click(function() {
      $("*[data-x-id='" + xElem.id + "']").removeClass("d-none");
      editorWrapper.remove();
      $(".x-form-edit-btn").toggleClass("collapse");
      sortable.option("disabled", false);
      cellEditorMode = false;
    });

    editorWrapper.append(xElem.buildEditor());
    editorWrapper.append(closeBtn);
    $("*[data-x-id='" + xElem.id + "']").addClass("d-none");
    $("*[data-x-id='" + xElem.id + "']").parent().append(editorWrapper);
    $(".x-form-edit-btn").toggleClass("collapse");
  }
  //{End}[Editor components]

  var createFormElemFromJSON = function(formElem) {
    var type = formElem.type;

    if (type === "group") {
      var group = Object.assign(new XFormGroup, formElem);
      group.label = Object.assign(new XLabel, formElem.label);
      group.child = createFormElemFromJSON(formElem.child);
      return group;
    } else if (type === "text") {
      return Object.assign(new XPlainText, formElem);
    } else if (type === "intext") {
      return Object.assign(new XInText, formElem);
    } else if (type === "innum") {
      return Object.assign(new XInNum, formElem);
    } else if (type === "calcout") {
      return Object.assign(new XCalcOut, formElem);
    } else if (type === "inbool") {
      return Object.assign(new XInBool, formElem);
    } else if (type === "tarea") {
      return Object.assign(new XTextArea, formElem);
    } else if (type === "sel") {
      return Object.assign(new XSel, formElem);
    } else if (type === "mulsel") {
      return Object.assign(new XMulSel, formElem);
    } else if (type === "date") {
      return Object.assign(new XDate, formElem);
    } else if (type === "header") {
      return Object.assign(new XHeader, formElem);
    } else if (type === "info") {
      return Object.assign(new XInfo, formElem);
    } else if (type === "danger") {
      return Object.assign(new XInfo, formElem);
    } else if (type === "rating") {
      return Object.assign(new XRating, formElem);
    } else if (type === "image") {
      return Object.assign(new XImage, formElem);
    } else if (type === "row") {
      var row = Object.assign(new XFormRow, formElem);

      for (var i = 0; i < row.children.length; i++) {
        row.children[i] = createFormElemFromJSON(row.children[i]);
      }

      return row;
    }
  }

  this.getTemplateInJSON = function(_script) {
    var report = {
      report: dom,
      formScript: _script
    }

    return JSON.stringify(report);
  }

  this.getTemplateInJSONFile = function(_script) {
    return new Blob([this.getTemplateInJSON(_script)], { type: "application/json" });
  }

  //{Start}[Add elements]
  this.addTextGroup = function(row) {
    var group = new XFormGroup("vertical", "Text field");
    group.addChild(new XInText());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addNumberGroup = function(row) {
    var group = new XFormGroup("vertical", "Number field");
    group.addChild(new XInNum());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addCalcGroup = function(row) {
    var group = new XFormGroup("vertical", "Calculated field");
    group.addChild(new XCalcOut());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addBoolGroup = function(row) {
    var group = new XFormGroup("vertical", "Boolean field");
    group.addChild(new XInBool());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addSelGroup = function(row) {
    var group = new XFormGroup("vertical", "Single choice");
    group.addChild(new XSel("radio"));

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addMulSelGroup = function(row) {
    var group = new XFormGroup("vertical", "Multiple choice");
    group.addChild(new XMulSel("checkbox"));

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addPlainText = function(row) {
    var plainText = new XPlainText("Plain text");

    if (row) {
      appendToRow(row, plainText);
      return;
    }

    addToDOM(plainText);
  }

  this.addTextAreaGroup = function(row) {
    var group = new XFormGroup("vertical", "Textarea");
    group.addChild(new XTextArea(4));

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addDateGroup = function(row) {
    var group = new XFormGroup("vertical", "Date");
    group.addChild(new XDate());

    if (row) {
      appendToRow(row, group);
      return;
    }

    addToDOM(group);
  }

  this.addHeader = function() {
    addToDOM(new XHeader("Header"));
  }

  this.addInfo = function() {
    addToDOM(new XInfo("Information", "info"));
  }

  this.addRating = function() {
    addToDOM(new XRating());
  }

  this.addImage = function() {
    addToDOM(new XImage());
  }
  //{End}[Add elements]

  this.load = function(url, cb) {
    $.get(url, function(template) {
      template["report"].forEach(function(reportElem) {
        var relem = createFormElemFromJSON(reportElem);
        addToDOM(relem);
      });

      if (sortable == null) {
        sortable = createSortable();
      }

      script = template["formScript"];
      cb();
    });
  }

  this.getContent = function() {
    return dom;
  }

  this.getScript = function() {
    console.log(script);
    return script;
  }

  this.render = function() {
    return domView;
  }

  this.getXElemByScriptAlias = function(scriptAlias) {
    for (let i = 0; i < dom.length; i++) {
      let domElem = dom[i];

      if (domElem.scriptAlias === scriptAlias) {
        return domElem;
      }
      
      if (domElem.children) {
        for (let j = 0; j < domElem.children.length; j++) {
          let domChildElem = domElem.children[j];

          if (domChildElem.scriptAlias === scriptAlias) {
            return domChildElem;
          }

          if (domChildElem.child && domChildElem.child.scriptAlias === scriptAlias) {
            return domChildElem.child;
          }
        }
      }
    }
  }

  this.getValueFromXElem = function(id) {
    var val;

    dom.forEach(function(row) {
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
}

export { XReportDOM };
