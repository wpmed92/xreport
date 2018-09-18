import XFormElem from './form-elem.js';
import $ as jQ from 'jquery';

function XDate() {
  XFormElem.call(this, "date");
}

XDate.prototype = Object.create(XFormElem.prototype);

XDate.prototype.render = function() {
  var xDate = jQ('<div class="input-group">\
                    <div class="input-group-prepend">\
                      <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>\
                    </div>\
                    <input type="text" class="form-control" data-provide="datepicker" type="text" />\
                  </div>');

  this.bind(xDate);
  return xDate;
}

XDate.prototype.genText = function() {
  var view = jQ("*[data-x-id='" + this.id + "']");

  return view.find("input").first().val();
}

export XDate;
