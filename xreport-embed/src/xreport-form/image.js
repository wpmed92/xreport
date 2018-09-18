import XFormElem from './form-elem.js';
import $ as jQ from 'jquery';

function XImage() {
  XFormElem.call(this, "image");
  this.src = "https://uploads-ssl.webflow.com/57e5747bd0ac813956df4e96/5aebae14c6d254621d81f826_placeholder.png";
  this.author = "Kép forrása";
}

XImage.prototype = Object.create(XFormElem.prototype);

XImage.prototype.render = function() {
  var view = jQ("<div></div>")
  view.append("<img src='" + this.src + "'></img>");
  view.append("<p class='text-info'>" + this.author + "</p>");
  this.bind(view);

  return view;
}

XImage.prototype.buildEditor = function() {
  var model = this;
  var editor = jQ("<div class='form-group'></div>");
  var srcInp = jQ("<input type='text' class='form-control'>");
  var authorInp = jQ("<input type='text' class='form-control'>");
  srcInp.val(model.src);
  authorInp.val(model.author);

  //Source editor
  srcInp.on("change", function() {
    var val = jQ(this).val();
    model.src = val;
    var view = jQ("*[data-x-id='" + model.id + "']");
    view.find("img").attr("src", model.src);
  });

  //Author editor
  authorInp.on("change", function() {
    var val = jQ(this).val();
    model.author = val;
    var view = jQ("*[data-x-id='" + model.id + "']");
    view.find("p").text(model.author);
  });

  editor.append("<label>Kép URL</label>");
  editor.append(srcInp);
  editor.append("<label>Kép forrása</label>");
  editor.append(authorInp);

  return editor;
}

export XImage;
