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
                        <div class="text-output collapse">\
                        </div>\
                      </div>\
                    </div>');

  var btnGenText = $('<button type="button" class="btn btn-primary float-right"><i class="far fa-file-alt"></i></button>');

  component.addElem = function(elem) {
    component.find("form").append(elem);
  }

  component.getForm = function() {
    return component.find("form");
  }

  component.showOutput = function(output) {
    var textOutput = component.find(".text-output");
    textOutput.toggleClass("collapse");
    component.find("form").toggleClass("collapse");
    textOutput.html("<pre>" + output + "</pre>");
  }

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

function XReportRenderer(dom) {
  var view;

  //TODO: test for pdf output
  var prettyPrint = function() {
    var out = $("<div></div>");

    xForm.forEach(function(elem) {
      out.append(elem.prettyPrint());
    });

    return out;
  }

  this.genText = function() {
    var out = "";

    dom.getContent().forEach(function(elem) {
      out += elem.genText();
    });

    view.showOutput(out);
  }

  this.render = function(dom, title, targetId) {
    view = formCardComponent(title);

    dom.forEach(function(domElem) {
      view.addElem(domElem.render());
    });

    $("#" + targetId).html(view);
    return view.getForm();
  }
}

export { XReportRenderer };
