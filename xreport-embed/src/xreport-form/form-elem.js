import $ as jQ from 'jquery';

function XFormElem(type) {
  var that = this;
  that.type = type;
  that.id = that.genUniqueId();
}

XFormElem.prototype.genUniqueId = function() {
  return "xElem" + Math.random().toString(36).substr(2, 9);
}

XFormElem.prototype.bind = function(view) {
  view.attr("data-x-id", this.id);
}

XFormElem.prototype.buildEditor = function() {

}

export XFormElem;
