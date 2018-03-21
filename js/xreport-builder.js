//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var editors = {
    "LABEL": '<div id="div-label-editor" class="form-group">\
                <label>Label name</label>\
                <input type="text" class="form-control">\
              </div>',
    "SELECT": '<div class="form-group">\
                <input type="text" class="form-control">\
                <button class="btn btn-primary" type="button">Add option</button>\
              </div>'
  }

  function getEditorForType(type, id) {
    var editor = $(editors[type]);

    if (type === "LABEL") {
      editor.find("input").first().change(function() {
        var labelController = $(this);
        var val = labelController.val();
        $("#" + id).text(val);
      });
    } else if (type === "SELECT") {
      var optionsInput = editor.find("input").first();
      editor.find(".btn").first().click(function() {
        $("#" + id).append($('<option>', {
                                          value: optionsInput.val(),
                                          text: optionsInput.val()
                                      }));
      });
    }

    return editor;
  }

  var uniqueIdToChildren = giveUniqueIdToChildren();

  function giveUniqueIdToChildren() {
    var counter = 0;

    return function(elem) {
      elem.children().each(function() {
        var child = $(this);
        child.attr("id", child.prop("nodeName") + "-" + counter++);
      });
    }
  }

  //Click on an element in the TEMPLATE SELECTOR
  function templateElemClick() {
    var target = $(this);
    var cloneElem = target.clone();
    uniqueIdToChildren(cloneElem);
    cloneElem.click(formElemClick);
    $("#x-form").append(cloneElem);
    return false;
  }

  //Click on an element in the FORM currently being built
  function formElemClick() {
    var target = $(this);
    var editorView = $("<div></div>");

    target.children().each(function () {
      var currentElement = $(this);
      var id = currentElement.attr("id");
      var type = currentElement.prop("nodeName");
      var editor = getEditorForType(type, id);
      editorView.append(editor);
    });

    $("#editor").html(editorView)
    $("#a-editor").tab("show");
  }

  //Handles tab navigation
  function navTabsClick() {
    $(this).tab('show');
  }

  $(".x-template").click(templateElemClick);
  $(".nav-tabs a").click(navTabsClick);
});
