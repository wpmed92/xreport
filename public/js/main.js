//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var currentUser = null;
  var currentReportId = null;

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

  function navTabsClick() {
    $(this).tab('show');
  }

  function startLoading() {
    $("#anim-loader").removeClass("d-none");
    $("#li-schemes").addClass("d-none");
  }

  function stopLoading() {
    $("#anim-loader").addClass("d-none");
    $("#li-schemes").removeClass("d-none");
  }

  function getReports() {
    $("#li-schemes").html("");
    startLoading();

    api.getReports().then(function(reports) {
      reports.forEach(function(report) {
        var cardDeckElem = '<div class="col-12 col-xl-4 col-lg-4 col-md-6 col-sm-12">\
                              <div class="card report-list-item h-100" data-id="' + report.id + '">\
                                <div class="card-body">\
                                  <h4 class="card-title">' + report.data().name + '</h4>\
                                  <h6 class="card-subtitle mb-2 text-muted">' + "Neuroradiológia" + '</h6>\
                                  <p class="card-text"><small class="text-muted">Készítette <strong>' + report.data().creator + "</strong>, " + moment(report.data().createdAt).fromNow()  + '</small></p>\
                                </div>\
                              </div>\
                            <div>';
        $("#li-schemes").append(cardDeckElem);
        stopLoading();
      });
    }).catch(function(error) {
      stopLoading();
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

  function saveScheme() {
    if (!currentUser) {
      doGoogleLogin();
      return;
    }

    var title = XReportBuilder.getReportTitle();

    if (!title) {
      return;
    }

    var payload = {
      file: XReportBuilder.getReportInJSONFile(),
      name: XReportBuilder.getReportTitle(),
      creator: currentUser.displayName
    };

    //Edit report
    if (currentReportId) {
      api.editReport(payload, currentReportId)
      .then(function() {
        console.log("Report editing successful.");
      })
      .catch(function(error) {
        console.log(error);
      });
    //Save report
    } else {
      api.saveReport(payload)
      .then(function() {
        console.log("Report saving successful.");
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }

  function loadReport() {
    XReportBuilder.initBuilder();
    currentReportId = $(this).attr("data-id");

    api.getReport(currentReportId).then(function(report) {
      if (report.exists) {
        console.log("Document data:", report.data());
        $.getJSON(report.data().contentUrl, function(json) {
          XReportBuilder.buildReportFromJSON(report.data().name, json);
          $("#btn-clinics-section")[0].click();
          $("#div-builder").removeClass("d-none");
          $("#div-schemes").addClass("d-none");
        });
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
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
  $("#btn-add-date").click(function() {
    XReportBuilder.addDateGroup();
  });
  $("#a-login").click(googleLogin);
  $("#a-logout").click(logOut);
  $("#btn-save-scheme").click(saveScheme);
  $("body").on('click', ".report-list-item", loadReport);
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
    $("#div-builder").removeClass("d-none");
    $("#div-schemes").addClass("d-none");
  });
  $("#a-schemes").click(function() {
    $("#div-schemes").removeClass("d-none");
    $("#div-builder").addClass("d-none");
    getReports();
  });
});
