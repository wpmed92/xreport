//Structured reporting scheme builder for XReport
$(function() {
  "use strict";
  var readOnlyMode = false;
  //enterReadOnlyMode();

  //#region INIT
  var myReport = {
    name: "",
    creator: "",
    category: "",
    file: ""
  }
  var currentUser = null;
  var currentReportId = null;
  moment.locale("hu");
  getCategories();
  loadSchemesPage();

  //NOTE: only for demo
  //#endregion
  $("#div-card-holder").append(addNewElemToFormEditor());
  //#region COMPONENTS
  function schemeButton() {
    return $('<div class="col-12 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4">\
                <h4 class="text-muted">Add new template</h4>\
                <div class="card card-shadowed report-list-item report-list-item-new" data-id="new">\
                  <div class="card-body text-center">\
                    <img src="image/add.png" style="height: 64px; width: 64px"></i>\
                  </div>\
                </div>\
              <div>');
  }

  function schemeListElem(scheme) {
    return $('<div class="col-12 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4">\
                <div class="card card-shadowed report-list-item h-100" data-id="' + scheme.id + '">\
                  <div class="card-body">\
                    <h4 class="card-title">' + scheme.name + '</h4>\
                    <h6 class="card-subtitle mb-2 text-muted">' + scheme.category + '</h6>\
                    <p class="card-text"><small class="text-muted">Készítette <strong>' + scheme.creator + "</strong>, " + moment(scheme.createdAt).fromNow()  + '</small></p>\
                  </div>\
                </div>\
              <div>');
  }

  function addNewElemToConditionEditor() {
    return $('<div id="btn-add-new-condition" class="x-add-new-elem-placeholder w-100 d-flex justify-content-center mb-4">\
                <div class="dropdown">\
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                    <i class="fas fa-plus"></i>\
                  </button>\
                  <div id="condition-tool-menu" class="dropdown-menu">\
                    <a href="#" id="btn-add-condition" class="dropdown-item"><i class="fas fa-code-branch"></i> Feltétel</a>\
                    <a href="#" id="btn-add-calculation" class="dropdown-item"><i class="fas fa-calculator"></i> Számítás</a>\
                  </div>\
                </div>\
              </div>');
  }

  function addNewElemToFormEditor() {
    return $('<div id="btn-add-new-elem" class="x-add-new-elem-placeholder w-100 d-flex justify-content-center mb-4">\
                <div class="dropdown">\
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                    <i class="fas fa-plus"></i>\
                  </button>\
                  <div id="tool-menu" class="dropdown-menu">\
                    <a href="#" id="btn-add-textbox" class="dropdown-item"><i class="fas fa-font"></i> Szöveges mező</a>\
                    <a href="#" id="btn-add-text" class="dropdown-item"><i class="fas fa-text-width"></i> Egyszerű szöveg</a>\
                    <a href="#" id="btn-add-numberbox" class="dropdown-item"><i class="fas fa-hashtag"></i> Szám mező</a>\
                    <a href="#" id="btn-add-calculated" class="dropdown-item"><i class="fas fa-calculator"></i> Calculated</a>\
                    <a href="#" id="btn-add-checkbox" class="dropdown-item"><i class="far fa-check-square"></i> Eldöntendő mező</a>\
                    <a href="#" id="btn-add-select" class="dropdown-item"><i class="fas fa-bars"></i> Egyszeres választás</a>\
                    <a href="#" id="btn-add-select-multiple" class="dropdown-item"><i class="fas fa-list"></i> Többszörös választás</a>\
                    <a href="#" id="btn-add-textarea" class="dropdown-item"><i class="fas fa-text-width"></i> Szabadszöveges mező</a>\
                    <a href="#" id="btn-add-date" class="dropdown-item"><i class="fas fa-calendar-alt"></i> Dátum</a>\
                    <a href="#" id="btn-add-header" class="dropdown-item"><i class="fas fa-heading"></i> Szekció cím</a>\
                    <a href="#" id="btn-add-info" class="dropdown-item"><i class="fas fa-info"></i> Magyarázó szöveg</a>\
                    <a href="#" id="btn-add-rating" class="dropdown-item"><i class="fas fa-table"></i> Értékelőskála</a>\
                    <a href="#" id="btn-add-image" class="dropdown-item"><i class="far fa-image"></i> Kép</a>\
                  </div>\
                </div>\
              </div>');
  }
  //#endregion

  //#region UI
  function showNewSchemeModal() {
    $("#modal-scheme-name").val("");
    $("#modal-new-scheme").modal('show');
  }

  function hideNewSchemeModal() {
    $("#modal-new-scheme").modal('hide');
  }

  function showMessage(msg) {
    $("#div-msg-box .modal-title").text(msg.title);
    $("#div-msg-box .modal-body").text(msg.text);
    $("#div-msg-box").modal('show');
  }

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

  function loadSchemesPage() {
    $("#div-schemes").removeClass("d-none");
    $("#div-builder").addClass("d-none");
    getReports();
  }

  function loadEditorPage(json) {
    $("#div-builder").removeClass("d-none");
    $("#div-schemes").addClass("d-none");
    $("#input-scheme-title").val(myReport.name);
    XReportBuilder.initBuilder();
    XReportBuilder.useReportSection(/*clear*/ true);

    if (json) {
      XReportBuilder.buildReportFromJSON(json);
    }
  }

  function enterReadOnlyMode() {
    readOnlyMode = true;
    $("#btn-save-scheme").addClass("d-none");
    $("#btn-drop-scheme").addClass("d-none");
    $("#btn-toggle-edit").addClass("d-none");
    $("#btn-show-conditions").addClass("d-none");
    $("#btn-add-new-elem").hide();
    $("#btn-show-text-output").removeClass("d-none");
    XReportBuilder.readOnlyMode();
  }
  //#endregion

  //#region NETWORKING
  api.onAuthStateChanged(function(user) {
    currentUser = user;
    loggedInState();
  }, function() {
    loggedOutState();
  });

  function getCategories() {
    api.getCategories().then(function(categories) {
      categories.forEach(function(category) {
        $("#modal-scheme-category").append($('<option>', {
          value: category.id,
          text : category.data().name
        }));
        $("#navbarCategoryDropdown .dropdown-menu").append('<a class="dropdown-item" href="#" data-id="' + category.id + '">' + category.data().name + '</a>');
      });
    });
  }

  function getReports() {
    $("#li-schemes").html("");

    if (!readOnlyMode) {
      $("#li-schemes").append(schemeButton());
    }

    startLoading();

    api.getReports().then(function(reports) {
      reports.forEach(function(report) {
        api.getCategory(report.data().category).then(function(category) {
          $("#li-schemes").append(schemeListElem({ id: report.id,
                                                   name: report.data().name,
                                                   creator: report.data().creator,
                                                   createdAt: report.data().createdAt,
                                                   category: category.data().name }));
        });
      });

      stopLoading();
    }).catch(function(error) {
      stopLoading();
      console.log(error);
    });
  }

  function googleLogin() {
    api.logIn().then(function(result) {
      console.log("Google login succeeded.");
    }).catch(function(error) {
      console.log(error);
    });
  }

  function logOut() {
    api.logOut();
  }

  function saveScheme() {
    if (!currentUser) {
      googleLogin();
      return;
    }

    if (!myReport.name) {
      showMessage({ title: "Hiba", text: "Adja meg a sablon nevét! " });
      return;
    }

    waitingDialog.show("Sablon mentése...");

    myReport.file = XReportBuilder.getReportInJSONFile();
    myReport.creator = currentUser.displayName;

    //Edit report
    if (currentReportId) {
      api.editReport(myReport, currentReportId)
      .then(function() {
        console.log("Report editing successful.");
        waitingDialog.hide();
      })
      .catch(function(error) {
        console.log(error);
        waitingDialog.hide();
      });
    //Save report
    } else {
      api.saveReport(myReport)
      .then(function() {
        console.log("Report saving successful.");
        waitingDialog.hide();
      })
      .catch(function(error) {
        waitingDialog.hide();
        console.log(error);
      });
    }
  }

  function loadReport() {
    if ($(this).attr("data-id") === "new") {
      currentReportId = "";
      showNewSchemeModal();
      return;
    }

    waitingDialog.show("Sablon betöltése...");
    XReportBuilder.initBuilder("x-form-report");
    currentReportId = $(this).attr("data-id");

    api.getReport(currentReportId).then(function(report) {
      if (report.exists) {
        console.log("Document data:", report.data());
        $.getJSON(report.data().contentUrl, function(json) {
          myReport.name = report.data().name;
          myReport.category = report.data().category;
          loadEditorPage(json);
          waitingDialog.hide();
        });
      } else {
        waitingDialog.hide();
        console.log("No such document!");
      }
    }).catch(function(error) {
        waitingDialog.hide();
        showMessage({ title: "Hiba", text: "A sablon betöltése sikertelen. " });
        console.log(error);
    });
  }
  //#endregion

  //#region EVENT HANDLERS
  $(".nav-tabs a").click(navTabsClick);
  $("body").on("click", "#tool-menu .dropdown-item", function(e) {
    e.preventDefault();
    var id = $(this).attr("id");

    switch (id) {
      case "btn-add-text":
        XReportBuilder.addPlainText();
        break;
      case "btn-add-textbox":
        XReportBuilder.addTextGroup();
        break;
      case "btn-add-numberbox":
        XReportBuilder.addNumberGroup();
        break;
      case "btn-add-calculated":
        XReportBuilder.addCalcGroup();
        break;
      case "btn-add-checkbox":
        XReportBuilder.addBoolGroup();
        break;
      case "btn-add-select":
        XReportBuilder.addSelGroup();
        break;
      case "btn-add-select-multiple":
        XReportBuilder.addMulSelGroup();
        break;
      case "btn-add-textarea":
        XReportBuilder.addTextAreaGroup();
        break;
      case "btn-add-date":
        XReportBuilder.addDateGroup();
        break;
      case "btn-add-header":
        XReportBuilder.addHeader();
        break;
      case "btn-add-info":
        XReportBuilder.addInfo();
        break;
      case "btn-add-rating":
        XReportBuilder.addRating();
        break;
      case "btn-add-image":
        XReportBuilder.addImage();
        break;
    }
  });

  $("#a-login").click(googleLogin);
  $("#a-logout").click(logOut);
  $("body").on('click', ".report-list-item", loadReport);
  $("#btn-save-scheme").click(saveScheme);
  $("#btn-drop-scheme").click(function() {
    loadSchemesPage();
  });
  $("#btn-toggle-edit").click(function(e) {
    e.preventDefault();
    XReportBuilder.toggleEditState();
    console.log(XReportBuilder.genText());
  });

  $("#btn-run-script").click(function() {
    var scriptText = $("#script-area").val();
  });

  $("#input-scheme-title").on("change", function(e) {
    e.preventDefault();
    myReport.name = $(this).val();
  });

  $('.navbar li').click(function(){
    $('.navbar li').removeClass('active');
    $(this).addClass('active');
  });

  $("#btn-show-conditions").click(function() {
    var isInConditionEditorMode = XReportBuilder.toggleConditionEditor();

    if (isInConditionEditorMode) {
      $("#btn-add-new-elem").remove();
      $("#div-card-holder").append(addNewElemToConditionEditor());
    } else {
      $("#btn-add-new-condition").remove();
      $("#div-card-holder").append(addNewElemToFormEditor());
    }

    $("#x-form-report").toggleClass("collapse");
    $("#x-form-conditions").toggleClass("collapse");
  });

  $("#btn-new-reporting").click(function() {
    XReportBuilder.reload();
  });

  $("#btn-show-text-output").click(function() {
    var out = "<pre>" + XReportBuilder.genText() + "</pre>";
    $("#x-form-report").toggleClass("collapse");
    $("#x-form-output").toggleClass("collapse");
    $("#btn-copy-to-clipboard").toggleClass("collapse");
    $("#x-form-output").html(out);
  });

  $("body").on("click", "#condition-tool-menu .dropdown-item", function(e) {
    e.preventDefault();
    var id = $(this).attr("id");

    switch (id) {
      case "btn-add-condition":
        XReportBuilder.addNewCondition();
        break;

      case "btn-add-calculation":
        XReportBuilder.addNewCalculation();
        break;
    }
  });

  //Navbar
  $("#btn-new-scheme").click(function() {
    myReport.name = $("#modal-scheme-name").val();
    myReport.category = $("#modal-scheme-category").val();
    loadEditorPage();
    hideNewSchemeModal();
  });
  $("#a-schemes").click(function() {
    loadSchemesPage();
  });
  //#endregion
}(new ClipboardJS('#btn-copy-to-clipboard')));
