import $ from 'jquery';

function formCardComponent(title) {
  var component = $('<div class="card">\
                      <div class="card-header">\
                        <h5>' + title + '</h5>\
                      </div>\
                      <div class="x-form card-body">\
                        <form></form>\
                        <div class="text-output collapse">\
                        </div>\
                      </div>\
                    </div>');

  var btnGenText = $('<button type="button" class="btn btn-primary float-right"><i class="far fa-file-alt"></i></button>');

  component.addElem = function(elem) {
    component.find("form").append(elem);
  }

  component.getForm = function() {
    return component.find("form");
  }

  component.editorState = function() {
    component.find(".text-output").addClass("collapse");
    component.find("form").removeClass("collapse");
  }

  component.previewState = function(output) {
    component.find(".text-output").removeClass("collapse");
    component.find("form").addClass("collapse");
    component.find(".text-output").html("<pre>" + output + "</pre>");
  }

  btnGenText.click(function() {
    component.find("form").first().toggleClass("collapse");
    let textOutput = component.find(".text-output").first();
    textOutput.toggleClass("collapse");
    //textOutput.html(prettyPrint());
    textOutput.html("<pre>" + genText() + "</pre>");
  });

  //component.find(".controls-container").append(btnGenText);

  return component;
}

function XReportRenderer(dom) {
  var view;
  var inPreviewMode = false;

  //TODO: test for pdf output
  var prettyPrint = function() {
    var out = $("<div></div>");

    xForm.forEach(function(elem) {
      out.append(elem.prettyPrint());
    });

    return out;
  }

  this.getReportAsText = function() {
    var out = "";

    dom.getContent().forEach(function(elem) {
      out += elem.genText();
    });

    return out;
  }

  this.togglePreviewMode = function() {
    if (inPreviewMode) {
      view.editorState();
    } else {
      view.previewState(this.getReportAsText());
    }

    inPreviewMode = !inPreviewMode;
  }

  this.render = function(dom, title, targetId) {
    view = formCardComponent(title);

    dom.forEach(function(domElem) {
      view.addElem(domElem.render());
    });

    $("#" + targetId).html(view);
    return view.getForm();
  }
}

export { XReportRenderer };
