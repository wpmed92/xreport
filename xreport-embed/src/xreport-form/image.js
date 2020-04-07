import { XFormElem } from './form-elem';
import $ from 'jquery';

function XImage() {
  XFormElem.call(this, "image");
  this.src = "https://uploads-ssl.webflow.com/57e5747bd0ac813956df4e96/5aebae14c6d254621d81f826_placeholder.png";
}

XImage.prototype = Object.create(XFormElem.prototype);

XImage.prototype.render = function() {
  var view = $("<div></div>")
  var questionMark = $("<i class='fas fa-question-circle text-info'></i>");

  questionMark.click(function() {
    $(this).next().toggleClass("collapse");
  });

  view.append(questionMark);
  view.append("<img class='collapse' style='width: 100%; height: auto;' src='" + this.src + "'></img>");
  this.bind(view);
  
  return view;
}

XImage.prototype.buildEditor = function() {
  var baseEditor = XFormElem.prototype.buildEditor.call(this);
  var model = this;
  var editor = $("<div class='form-group'></div>");
  var srcInp = $("<input type='text' class='form-control'>");
  srcInp.val(model.src);

  //Source editor
  srcInp.on("change", function() {
    var val = $(this).val();
    model.src = val;
    var view = $("*[data-x-id='" + model.id + "']");
    view.find("img").attr("src", model.src);
  });

  editor.append("<label>Image URL</label>");
  editor.append(srcInp);
  baseEditor.append(editor);

  return baseEditor;
}

export { XImage };
