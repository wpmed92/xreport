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
  var currentUser = null;

  moment.locale("hu");

  //Handles tab navigation
  function navTabsClick() {
    $(this).tab('show');
  }

  function buildEditor(xelem) {
    $("#editor").html(xelem.buildEditor());
    $("#a-editor").tab("show");
  }

  var formRow = new XReportForm.Row();

  function addToForm(xelem) {
    if (!isInlineMode()) {
      formRow = new XReportForm.Row();
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
        elem = new XReportForm.Group("vertical", "Szöveges mező");
        elem.addChild(new XReportForm.Text());
        break;

      case "innum":
        elem = new XReportForm.Group("vertical", "Szám mező");
        elem.addChild(new XReportForm.Num());
        break;

      case "inbool":
        elem = new XReportForm.Group("vertical", "Eldöntendő mező");
        elem.addChild(new XReportForm.Bool());
        break;

      case "sel":
        elem = new XReportForm.Group("vertical", "Egyszeres választás");
        elem.addChild(new XReportForm.Sel());
        break;

      case "mulsel":
        elem = new XReportForm.Group("vertical", "Többszörös választás");
        elem.addChild(new XReportForm.MulSel("checkbox"));
        break;

      case "tarea":
        elem = new XReportForm.Group("vertical", "Szabad szöveg");
        elem.addChild(new XReportForm.TextArea(4));
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
        var cardDeckElem = '<div class="card">\
                              <div class="card-body">\
                                <h4 class="card-title">' + report.data().name + '</h4>\
                                <h6 class="card-subtitle mb-2 text-muted">' + "Neuroradiológia" + '</h6>\
                                <p class="card-text"><small class="text-muted">Készítette <strong>' + report.data().creator + "</strong>, " + moment(report.data().createdAt).fromNow()  + '</small></p>\
                              </div>\
                            </div>';
        $("#li-schemes").append(cardDeckElem);
      });
    }).catch(function(error) {
      console.log(error);
    });
  }

  function createFormElemFromJSON(formElem) {
    var type = formElem.type;

    if (type === "group") {
      var group = Object.assign(new XReportForm.Group, formElem);
      group.label = Object.assign(new xReportForm.label, formElem.label);
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

  function buildReportFromJSON(json) {
    //Build clinincs part
    xformView = $("#x-form-clinics");
    json.clinics.forEach(function(clinicsElem) {
      var celem = createFormElemFromJSON(clinicsElem);
      addToForm(celem);
    });

    //Build report part
    xformView = $("#x-form-report");
    json.report.forEach(function(reportElem) {
      var relem = createFormElemFromJSON(reportElem);
      addToForm(relem);
    });

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
  $("#a-login").click(function() {
    api.login().then(function(result) {
      currentUser = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.log(error);
    });
  });
  $("#btn-save-scheme").click(function() {
    var reportJSON = JSON.stringify(xscheme);
    var reportFile = new Blob([reportJSON], {type: "application/json"});
    api.saveReport({
      file: reportFile,
      name: xscheme.title,
      creator: currentUser.displayName
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
