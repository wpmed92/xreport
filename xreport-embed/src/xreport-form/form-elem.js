import $ from 'jquery';

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

XFormElem.prototype.show = function() {
  $("*[data-x-id='" + this.id + "']").closest(".col").show();
}

XFormElem.prototype.hide = function() {
  $("*[data-x-id='" + this.id + "']").closest(".col").hide();
}

export { XFormElem };
