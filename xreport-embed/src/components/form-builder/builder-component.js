import $ from 'jquery';

function BuilderCardComponent() {
    var that = this;
    var inBuilderState = true;
    var component = $('<div class="card">\
                        <div class="card-header">\
                          <div class="row">\
                            <div class="col-5">\
                                <input id="input-scheme-title" type="text" class="form-control" placeholder="Enter a title">\
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
                            <textarea class="form-control" rows="7"></textarea>\
                            <button type="button" class="btn btn-primary float-right"><i class="fas fa-code"></i> Compile</button>\
                            <div class="script-output"></div>\
                          </div>\
                        </div>\
                      </div>');
  
    var btnStateToggle = $('<button type="button" class="btn btn-secondary float-right"><i class="fas fa-code-branch"></i></button>');
  
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
  
    that.enterEditorState = function() {
      component.find(".scripting-area").addClass("collapse");
      component.find("form").removeClass("collapse");
    }
  
    that.enterScriptingState = function() {
        component.find(".scripting-area").removeClass("collapse");
        component.find("form").addClass("collapse");
    }

    that.render = function() {
        return component;
    }
  }

  export { BuilderCardComponent };