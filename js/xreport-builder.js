//Structured reporting scheme builder for XReport
$(function() {
  "use strict";

  var editors = {
    "label": '<div class="form-group">\
                <label>Label name</label>\
                <input type="text" class="form-control">\
              </div>',
    "select": '<div class="form-group">\
                <input type="text" class="form-control">\
                <button class="btn btn-primary" type="button">Add option</button>\
              </div>',
    "input": '<div class="form-group">\
                <label>Placeholder text</label>\
                <input type="text" class="form-control">\
              </div>',
    "multiple-select": '<div class="form-group">\
                          <label>Options</label>\
                          <input type="text" class="form-control" placeholder="Option 1">\
                          <input type="text" class="form-control" placeholder="Option 2">\
                          <button class="btn btn-primary" type="button">Add option</button>\
                        </div>'
  }

  function getEditorForType(type, id) {
    var editor = $(editors[type]);

    if (type === "label" || type === "input") {
      editor.find("input").first().change(function() {
        var inp = $(this);
        var val = inp.val();

        if (type === "label") {
          $("#" + id).text(val);
        } else {
          $("#" + id).attr("placeholder", val);
        }
      });
    } else if (type === "select") {
      var optionsInput = editor.find("input").first();
      editor.find(".btn").first().click(function() {
        $("#" + id).append($('<option>', { value: optionsInput.val(), text: optionsInput.val() }));
      });
    } else if (type === "multiple-select") {
      var inputOption1 = editor.find("input").first();
      var inputOption2 = editor.find("input").last();
      var label1 = $("#" + id).find("label").first();
      var label2 = $("#" + id).find("label").last();
      inputOption1.change(function() {
        label1.val($(this).val())
      });
      inputOption2.change(function() {
        label2.val($(this).val())
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

        //If it's a div we're in a form-check
        if (child.is("div")) {
          child.children().each(function() {
            var grandChild = $(this);
            grandChild.attr("id", grandChild.prop("nodeName")  + "-" + counter++);
          });
        } else {
          child.attr("id", child.prop("nodeName") + "-" + counter++);
        }
      });
    }
  }

  //Click on an element in the TEMPLATE SELECTOR
  function templateElemClick() {
    var target = $(this);
    var cloneElem = target.parent().find(".x-template").clone();
    uniqueIdToChildren(cloneElem);
    var formElemWrapper = $("<div class='x-form-wrapper'></div>");
    formElemWrapper.append(cloneElem);
    var buttonGroup = $("<div class='btn-group x-form-edit-button' role='group'></div>");
    var editButton = $("<button type='button' class='btn btn-sm btn-primary'><i class='fas fa-pencil-alt'></i></button>");
    var removeButton = $("<button type='button' class='btn btn-sm btn-danger'><i class='fas fa-minus-circle'></i></button>");
    buttonGroup.append(editButton);
    buttonGroup.append(removeButton);
    editButton.click(formElemClick);
    removeButton.click(function() {
      formElemWrapper.remove();
    });
    formElemWrapper.append(buttonGroup);
    $("#x-form").append(formElemWrapper);
    return false;
  }

  //Click on an element in the FORM currently being built
  function formElemClick() {
    var target = $(this).parent().find(".x-template");
    var editorView = $("<div></div>");

    target.children().each(function() {
      var currentElement = $(this);
      var id = currentElement.attr("id");
      var type = currentElement.prop("nodeName").toLowerCase();

      //If we find a div in children, that is required to be a form-check
      if (type === "div") {
        type = "multiple-select";
      }

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

  $(".x-template-add-button").click(templateElemClick);
  $(".nav-tabs a").click(navTabsClick);
});
