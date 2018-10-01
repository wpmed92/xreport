//static controls
import { XLabel } from './xreport-form/label.js';
import { XHeader } from './xreport-form/header.js';
import { XPlainText } from './xreport-form/plain-text.js';
import { XInfo } from './xreport-form/info.js';
import { XImage } from './xreport-form/image.js';
import { XTextArea } from './xreport-form/text-area.js';
//input controls
import { XInNum } from './xreport-form/in-num.js';
import { XInText } from './xreport-form/in-text.js';
import { XInBool } from './xreport-form/in-bool.js';
import { XSel } from './xreport-form/sel.js';
import { XMulSel } from './xreport-form/mulsel.js';
import { XRating } from './xreport-form/rating.js';
import { XCalcOut }from './xreport-form/calc-out.js';
import { XDate} from './xreport-form/date.js';
//parents
import { XFormGroup } from './xreport-form/group.js';
import { XFormRow } from './xreport-form/row.js';

import $ from 'jquery';

function formCardComponent(title) {
  var component = $('<div class="card">\
                      <div class="card-header">\
                        <h5>' + title + '</h5>\
                      </div>\
                      <div class="x-form card-body">\
                        <form></form>\
                        <div class="text-output collapse"></div>\
                      </div>\
                    </div>');

  component.addElem = function(elem) {
    component.find("form").append(elem);
  }

  component.getForm = function() {
    return component.find("form");
  }

  var btnGenText = $('<button type="button" class="btn btn-primary float-right"><i class="far fa-file-alt"></i></button>');

  btnGenText.click(function() {
    component.find("form").first().toggleClass("collapse");
    let textOutput = component.find(".text-output").first();
    textOutput.toggleClass("collapse");
    //textOutput.html(prettyPrint());
    textOutput.html("<pre>" + genText() + "</pre>");
  });

  //component.find(".controls-container").append(btnGenText);

  return component;
}

function prettyPrint() {
  var out = $("<div></div>");

  xForm.forEach(function(elem) {
    out.append(elem.prettyPrint());
  });

  return out;
}

function genText() {
  var out = "";

  xForm.forEach(function(elem) {
    out += elem.genText();
  });

  return out;
}

export function render(dom, title, targetId) {
  let view = formCardComponent(title);

  dom.forEach(function(domElem) {
    view.addElem(domElem.render());
  });

  $("#" + targetId).html(view);
  return view.getForm();
}
