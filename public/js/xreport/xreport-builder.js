var XReportBuilder = (function(jQ, XForm) {
  function addToForm() {
    if (!isInlineMode()) {
      formRow = new xReportForm.row();
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
  }
})($, XReportForm);
