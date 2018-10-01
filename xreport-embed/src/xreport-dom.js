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
import _ from 'lodash';

function XReportDOM() {
  var dom = [];

  var addToDOM = function(elem) {
    var row;

    if (elem.type === "row") {
      row = elem;
    } else {
      row = new XReportForm.Row();
      row.addChild(elem);
    }

    dom.push(row);
  }

  var createFormElemFromJSON = function(formElem) {
    var type = formElem.type;

    if (type === "group") {
      var group = Object.assign(new XFormGroup, formElem);
      group.label = Object.assign(new XLabel, formElem.label);
      group.child = createFormElemFromJSON(formElem.child);
      return group;
    } else if (type === "text") {
      return Object.assign(new XPlainText, formElem);
    } else if (type === "intext") {
      return Object.assign(new XInText, formElem);
    } else if (type === "innum") {
      return Object.assign(new XInNum, formElem);
    } else if (type === "calcout") {
      return Object.assign(new XCalcOut, formElem);
    } else if (type === "inbool") {
      return Object.assign(new XInBool, formElem);
    } else if (type === "tarea") {
      return Object.assign(new XTextArea, formElem);
    } else if (type === "sel") {
      return Object.assign(new XSel, formElem);
    } else if (type === "mulsel") {
      return Object.assign(new XMulSel, formElem);
    } else if (type === "date") {
      return Object.assign(new XDate, formElem);
    } else if (type === "header") {
      return Object.assign(new XHeader, formElem);
    } else if (type === "info") {
      return Object.assign(new XInfo, formElem);
    } else if (type === "danger") {
      return Object.assign(new XInfo, formElem);
    } else if (type === "rating") {
      return Object.assign(new XRating, formElem);
    } else if (type === "image") {
      return Object.assign(new XImage, formElem);
    } else if (type === "row") {
      var row = Object.assign(new XFormRow, formElem);

      for (var i = 0; i < row.children.length; i++) {
        row.children[i] = createFormElemFromJSON(row.children[i]);
      }

      return row;
    }
  }

  this.load = function(url, cb) {
    $.get(url, function(template) {
      template["report"].forEach(function(reportElem) {
        var relem = createFormElemFromJSON(reportElem);
        addToDOM(relem);
      });

      cb(dom, template["conditions"]);
    });
  }

  this.getContent = function() {
    return dom;
  }

  this.getXElemById = function(id) {
    return _.find(dom, { id: id });
  }

  this.getValueFromXElem = function(id) {
    var val;

    dom.forEach(function(row) {
      row.children.forEach(function(child) {
        if (child.type === "group") {
          var inId = child.child.id;

          if (inId == id) {
            val = child.child.getValue();
          }
        }
      });
    });

    return val;
  }
}

export { XReportDOM };
