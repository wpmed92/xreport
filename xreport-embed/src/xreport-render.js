import $ from 'jquery';
import { BuilderCardComponent } from './components/form-builder/builder-component';
import { AddElemButtonComponent } from './components/form-builder/add-elem-button-component';

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

  this.render = function(dom, title, targetId, editorMode) {
    view = new BuilderCardComponent();
    view.addElem(dom.render());
    $("#" + targetId).html(view.render());

    if (editorMode) {
      dom.attachEditorControls();
      var addElemButtonComponent = new AddElemButtonComponent(dom);
      $("#" + targetId).append(addElemButtonComponent.render());
    }

    return view.getForm();
  }
}

export { XReportRenderer };
