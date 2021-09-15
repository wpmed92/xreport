import $ from 'jquery';

function RowEditorComponent(editor) {
    var editState = true;
    var component = $('<div class="dropdown x-row-editor-component ' + (!editState ? "collapse" : "") + '">\
        <button class="btn btn-sm btn-outline-secondary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
        <i class="fas fa-ellipsis-v"></i>\
        </button>\
        <div class="dropdown-menu">\
            <a href="#" class="dropdown-item" data-action="text-field"><i class="fas fa-font"></i> Text field</a>\
            <a href="#" class="dropdown-item" data-action="plain-text"><i class="fas fa-text-width"></i> Plain text</a>\
            <a href="#" class="dropdown-item" data-action="number-field"><i class="fas fa-hashtag"></i> Number field</a>\
            <a href="#" class="dropdown-item" data-action="calculated"><i class="fas fa-calculator"></i> Calculated</a>\
            <a href="#" class="dropdown-item" data-action="boolean-field"><i class="far fa-check-square"></i> Boolean field</a>\
            <a href="#" class="dropdown-item" data-action="single-choice"><i class="fas fa-bars"></i> Single choice</a>\
            <a href="#" class="dropdown-item" data-action="multiple-choice"><i class="fas fa-list"></i> Multiple choice</a>\
            <a href="#" class="dropdown-item" data-action="textarea"><i class="fas fa-text-width"></i> Textarea</a>\
            <a href="#" class="dropdown-item" data-action="date"><i class="fas fa-calendar-alt"></i> Date</a>\
            <div class="dropdown-divider"></div>\
            <a href="#" class="dropdown-item" data-action="delete"><i class="fas fa-trash"></i> Delete</a>\
            <a href="#" class="dropdown-item" data-action="duplicate"><i class="fas fa-copy"></i> Duplicate</a>\
        </div>\
    </div>'
    );

   this.render = function(row) {
      component.find('.dropdown-menu .dropdown-item').on("click", function(e) {
        e.preventDefault();
        let action = $(this).data("action");

        switch (action) {
            case "text-field":
                editor.addTextGroup(row);
                break;
            case "plain-text":
                editor.addPlainText(row);
                break;
            case "number-field":
                editor.addNumberGroup(row);
                break;
            case "calculated":
                editor.addCalcGroup(row);
                break;
            case "boolean-field":
                editor.addBoolGroup(row);
                break;
            case "single-choice":
                editor.addSelGroup(row);
                break;
            case "multiple-choice":
                editor.addMulSelGroup(row);
                break;
            case "textarea":
                editor.addTextAreaGroup(row);
                break;
            case "date":
                editor.addDateGroup(row);
                break;
            case "delete":
                editor.deleteRow(row);
                break;
            case "duplicate":
                editor.duplicateRow(row);
                break;
        }
      });

      return component;
    }
  }

  export { RowEditorComponent };