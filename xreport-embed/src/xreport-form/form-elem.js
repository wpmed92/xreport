import $ from 'jquery';

/**
 * Instantiates a new XFormElem. This is the base class for all other XReportDOM classes.
 * @class
 */
function XFormElem(type) {
  var that = this;
  that.type = type;
  that.id = that.genUniqueId();
  that.scriptAlias = that.id;
  that.hideFromOutput = false;
  that.hidden = false;
}

/**
 * Generates a unique identifier
 * @method
 */
XFormElem.prototype.genUniqueId = function() {
  return "xElem" + Math.random().toString(36).substr(2, 9);
}

/**
 * Assigns the view's data-x-id property to the XFormElem's id
 * @method
 */
XFormElem.prototype.bind = function(view) {
  view.attr("data-x-id", this.id);
}

/**
 * Builds the editor view where the XFormElem's properties can be edited
 * @method
 */
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

/**
 * Shows the element
 * @method
 */
XFormElem.prototype.show = function() {
  this.hidden = false;
  $("*[data-x-id='" + this.id + "']").closest(".col").show();
}

/**
 * Hides the element
 * @method
 */
XFormElem.prototype.hide = function() {
  this.hidden = true;
  $("*[data-x-id='" + this.id + "']").closest(".col").hide();
}

/**
 * Renders the element
 * @method
 */
XFormElem.prototype.render = function() {
  
}

/**
 * Used by FormScript to set a value programatically
 * @method
 */
XFormElem.prototype.setValue = function(val) {
  
}

/**
 * Used by FormScript to read the value of the element
 * @method
 */
XFormElem.prototype.getValue = function() {
  
}

/**
 * Generates text report output from the current element
 * @method
 */
XFormElem.prototype.genText = function() {
  
}

/**
 * Used for nicely formatted HTML report output
 * @method
 */
XFormElem.prototype.prettyPrint = function() {
  
}


export { XFormElem };
