import $ from 'jquery';

function BuilderCardComponent(evaluator, dom, title) {
    var that = this;
    var inBuilderState = true;
    var component = $('<div class="card">\
                        <div class="card-header">\
                          <div class="row">\
                            <div class="col-5">\
                                <input id="input-template-title" type="text" class="form-control" placeholder="Enter a title">\
                            </div>\
                            <div class="col-7 controls-container">\
                            </div>\
                          </div>\
                        </div>\
                        <div class="x-form card-body">\
                          <form></form>\
                          <div class="scripting-area collapse">\
                            <h5>Form script</h5>\
                            <hr>\
                            <textarea class="script-area form-control" rows="7"></textarea>\
                            <div class="mt-4 script-output"></div>\
                          </div>\
                        </div>\
                      </div>');
  
    var btnStateToggle = $('<button type="button" class="btn btn-secondary float-right"><i class="fas fa-code-branch"></i></button>');
    var btnCompile = component.find(".btn-compile").first();

    btnCompile.click(function() {
      let script = component.find(".script-area").val();
      evaluator.eval(script);
    });

    btnStateToggle.click(function() {
        if (inBuilderState) {
            that.enterScriptingState();
            inBuilderState = false;
        } else {
            that.enterEditorState();
            inBuilderState = true;
        }
    });

    component.find(".controls-container").append(btnStateToggle);

    that.addElem = function(elem) {
      component.find("form").append(elem);
    }
  
    that.getForm = function() {
      return component.find("form");
    }

    that.getTitle = function() {
      return component.find("#input-template-title").val();
    }
  
    that.enterEditorState = function() {
      component.find(".scripting-area").addClass("collapse");
      component.find("form").removeClass("collapse");
    }
  
    that.enterScriptingState = function() {
        component.find(".scripting-area").removeClass("collapse");
        component.find("form").addClass("collapse");
    }

    that.getScript = function() {
      return component.find(".script-area").val();
    }

    that.render = function() {
      component.find("#input-template-title").val(title);
      component.find(".script-area").val(dom.getScript());
      return component;
    }
  }

  export { BuilderCardComponent };