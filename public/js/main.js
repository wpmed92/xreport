//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var currentUser = null;
  XReportBuilder.useClinicsSection();
  moment.locale("hu");

  api.onAuthStateChanged(function(user) {
    currentUser = user;
    loggedInState();
  }, function() {
    loggedOutState();
  });

  function loggedInState() {
    $("#a-login").addClass("d-none");
    $("#a-logout").removeClass("d-none");
    $("#user-info").text(currentUser.displayName);
  }

  function loggedOutState() {
    $("#a-login").removeClass("d-none");
    $("#a-logout").addClass("d-none");
  }
  //Handles tab navigation
  function navTabsClick() {
    $(this).tab('show');
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

  function googleLogin() {
    api.logIn().then(function(result) {
      //currentUser = result.user;
      console.log("Google login succeeded.");
    }).catch(function(error) {
      /*var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;*/
      console.log(error);
    });
  }

  function logOut() {
    api.logOut();
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
  $("#btn-add-date").click(function() {
    XReportBuilder.addDateGroup();
  });
  $("#a-login").click(googleLogin);
  $("#a-logout").click(logOut);
  $("#btn-save-scheme").click(function() {
    if (!currentUser) {
      doGoogleLogin();
      return;
    }

    var title = XReportBuilder.getReportTitle();

    if (!title) {
      return;
    }

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
    XReportBuilder.toggleEditState();
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
  $('.navbar li').click(function(){
    $('.navbar li').removeClass('active');
    $(this).addClass('active');
  });
  $("#btn-newline").click(function() {
    XReportBuilder.newLineMode();
  });
  $("#btn-inline").click(function() {
    XReportBuilder.inlineMode();
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
