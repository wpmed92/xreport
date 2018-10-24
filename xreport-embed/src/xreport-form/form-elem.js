import $ from 'jquery';

function XFormElem(type) {
  var that = this;
  that.type = type;
  that.id = that.genUniqueId();
  that.scriptAlias = that.id;
  that.hideFromOutput = false;
}

XFormElem.prototype.genUniqueId = function() {
  return "xElem" + Math.random().toString(36).substr(2, 9);
}

XFormElem.prototype.bind = function(view) {
  view.attr("data-x-id", this.id);
}

XFormElem.prototype.buildEditor = function() {
  var model = this;
  var editor = $("<div></div>");
  var scriptAliasWrapper = $("<div class='form-group'><label>Script alias</label></div>");
  var scriptAliasInput = $("<input type='text' class='form-control'>");
  scriptAliasInput.val(model.scriptAlias);

  scriptAliasInput.on("change", function() {
    var val = $(this).val();
    model.scriptAlias = val;
  });

  scriptAliasWrapper.append(scriptAliasInput);
  editor.append(scriptAliasWrapper);

  return editor;
}

XFormElem.prototype.show = function() {
  $("*[data-x-id='" + this.id + "']").closest(".col").show();
}

XFormElem.prototype.hide = function() {
  $("*[data-x-id='" + this.id + "']").closest(".col").hide();
}

export { XFormElem };
