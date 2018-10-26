import $ from 'jquery';
import "../../css/report-output.css";

function ViewerComponent(title) {
    var component = $('<h3 class="text-secondary">' + title + '</h3>\
                        <div class="card">\
                        <div class="x-form card-body">\
                          <form></form>\
                          <div class="text-output collapse">\
                          </div>\
                        </div>\
                      </div>');
  
    var btnGenText = $('<button type="button" class="btn btn-secondary float-right"><i class="fas fa-code-branch"></i></button>');
  
    this.addElem = function(elem) {
      component.find("form").append(elem);
    }
  
    this.getForm = function() {
      return component.find("form");
    }
  
    this.editorState = function() {
      component.find(".text-output").addClass("collapse");
      component.find("form").removeClass("collapse");
    }
  
    this.previewState = function(output) {
      component.find(".text-output").removeClass("collapse");
      component.find("form").addClass("collapse");
      component.find(".text-output").html(output);
    }
  
    btnGenText.click(function() {
      component.find("form").first().toggleClass("collapse");
      let textOutput = component.find(".text-output").first();
      textOutput.toggleClass("collapse");
    });
  
    component.find(".controls-container").append(btnGenText);
  
    this.render = function() {
      return component;
    }
  }

  export { ViewerComponent };

