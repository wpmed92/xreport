import $ from 'jquery';

function formCardComponent(title) {
    var component = $('<div class="card">\
                        <div class="card-header">\
                          <div class="row">\
                            <div class="col-5">\
                                <input id="input-scheme-title" type="text" class="form-control" placeholder="Írja be a sablon nevét">\
                            </div>\
                            <div class="col-7 controls-container">\
                            </div>\
                          </div>\
                        </div>\
                        <div class="x-form card-body">\
                          <form></form>\
                          <div class="text-output collapse">\
                          <h5>Form script</h5>\
                          <hr>\
                          <textarea class="form-control" rows="7"></textarea>\
                          </div>\
                        </div>\
                      </div>');
  
    var btnGenText = $('<button type="button" class="btn btn-secondary float-right"><i class="fas fa-code-branch"></i></button>');
  
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
    });
  
    component.find(".controls-container").append(btnGenText);
  
    return component;
  }