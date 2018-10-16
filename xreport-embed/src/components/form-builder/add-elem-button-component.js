import $ from 'jquery';
import '../../css/editor-styles.css';

function AddElemButtonComponent(editor) {
    var component = $('<div id="btn-add-new-elem" class="x-add-new-elem-placeholder w-100 d-flex justify-content-center mb-4">\
                        <div class="dropdown">\
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                            <i class="fas fa-plus"></i>\
                        </button>\
                        <div id="tool-menu" class="dropdown-menu">\
                            <a href="#" data-action="text-field" class="dropdown-item"><i class="fas fa-font"></i> Text field</a>\
                            <a href="#" data-action="plain-text" class="dropdown-item"><i class="fas fa-text-width"></i> Plain text</a>\
                            <a href="#" data-action="number-field" class="dropdown-item"><i class="fas fa-hashtag"></i> Number field</a>\
                            <a href="#" data-action="calculated" class="dropdown-item"><i class="fas fa-calculator"></i> Calculated</a>\
                            <a href="#" data-action="boolean-field" class="dropdown-item"><i class="far fa-check-square"></i> Boolean field</a>\
                            <a href="#" data-action="single-choice" class="dropdown-item"><i class="fas fa-bars"></i> Single choice</a>\
                            <a href="#" data-action="multiple-choice" class="dropdown-item"><i class="fas fa-list"></i> Multiple choice</a>\
                            <a href="#" data-action="textarea" class="dropdown-item"><i class="fas fa-text-width"></i> Textarea</a>\
                            <a href="#" data-action="date" class="dropdown-item"><i class="fas fa-calendar-alt"></i> Date</a>\
                            <a href="#" data-action="header" class="dropdown-item"><i class="fas fa-heading"></i> Header</a>\
                            <a href="#" data-action="information" class="dropdown-item"><i class="fas fa-info"></i> Information</a>\
                            <a href="#" data-action="rating" class="dropdown-item"><i class="fas fa-table"></i> Rating scale</a>\
                            <a href="#" data-action="image" class="dropdown-item"><i class="far fa-image"></i> Image</a>\
                        </div>\
                        </div>\
                    </div>');
    
    this.render = function() {
      component.find('.dropdown-menu .dropdown-item').on("click", function(e) {
        e.preventDefault();
        let action = $(this).data("action");

        switch (action) {
            case "text-field":
                editor.addTextGroup();
                break;
            case "plain-text":
                editor.addPlainText();
                break;
            case "number-field":
                editor.addNumberGroup();
                break;
            case "calculated":
                editor.addCalcGroup();
                break;
            case "boolean-field":
                editor.addBoolGroup();
                break;
            case "single-choice":
                editor.addSelGroup();
                break;
            case "multiple-choice":
                editor.addMulSelGroup();
                break;
            case "textarea":
                editor.addTextAreaGroup();
                break;
            case "date":
                editor.addDateGroup();
                break;
            case "header":
                editor.addHeader();
                break;
            case "information":
                editor.addInfo();
                break;
            case "rating":
                editor.addRating();
                break;
            case "image":
                editor.addImage();
                break;
        }
      });

      return component;
    }
}

export { AddElemButtonComponent };