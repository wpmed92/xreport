//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var currentUser = null;
  XReportBuilder.useClinicsSection();
  moment.locale("hu");

  //Handles tab navigation
  function navTabsClick() {
    $(this).tab('show');
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

  function getReports() {
    $("#li-schemes").html("");

    api.getReports().then(function(reports) {
      reports.forEach(function(report) {
        var cardDeckElem = '<div class="card report-list-item" data-id="' + report.id + '">\
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

  //Events
  $(".nav-tabs a").click(navTabsClick);
  $("#btn-add-textbox").click(function() {
    XReportBuilder.addTextGroup();
  });
  $("#btn-add-numberbox").click(function() {
    XReportBuilder.addNumberGroup();
  });
  $("#btn-add-checkbox").click(function() {
    XReportBuilder.addBoolGroup();
  });
  $("#btn-add-select").click(function() {
    XReportBuilder.addSelGroup();
  });
  $("#btn-add-select-multiple").click(function() {
    XReportBuilder.addMulSelGroup();
  });
  $("#btn-add-textarea").click(function() {
    XReportBuilder.addTextAreaGroup();
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
    api.saveReport({
      file: XReportBuilder.getReportInJSONFile(),
      name: XReportBuilder.getReportTitle(),
      creator: currentUser.displayName
    });
  });
  $("body").on('click', ".report-list-item", function() {
    var reportId = $(this).attr("data-id");
    api.getReport(reportId).then(function(report) {
        if (report.exists) {
          console.log("Document data:", report.data());
          $.getJSON(report.data().contentUrl, function(json) {
            XReportBuilder.buildReportFromJSON(report.data().name, json);
            $("#div-builder").removeClass("collapse");
            $("#div-schemes").addClass("collapse");
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
    XReportBuilder.setReportTitle($(this).val());
  })
  //Report section selection
  $("#btn-clinics-section").click(function() {
    XReportBuilder.useClinicsSection();
  });
  $("#btn-report-section").click(function() {
    XReportBuilder.useReportSection();
  });
  $("#btn-opinion-section").click(function() {
    XReportBuilder.useOpinionSection();
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
