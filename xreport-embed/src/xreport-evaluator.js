import { XSel } from './xreport-form/sel.js';
import { XMulSel } from './xreport-form/mulsel.js';
import * as math from 'mathjs';
import _ from 'lodash';
import $ from 'jquery';

function XReportEvaluator(_dom, _conditions) {
  let dom = _dom;
  let conditionPool = _conditions;

  var processVal = function(val) {
    var numericVal = parseInt(val);

    if (isNaN(numericVal)) {
      return val;
    } else {
      return numericVal;
    }
  }

  var doAction = function(action) {
    switch (action.doWhat) {
      case "hide":
        $("*[data-x-id='" + action.onWhat + "']").closest(".col").hide();
        break;

      case "show":
        $("*[data-x-id='" + action.onWhat + "']").closest(".col").show();
        break;

      case "select":
        var elem;

        if (!_.isString(action.onWhat.elem)) {
          if (action.onWhat.elem.type === "sel") {
            elem = Object.assign(new XSel, action.onWhat.elem);
          } else if (action.onWhat.elem.type === "mulsel") {
            elem = Object.assign(new XMulSel, action.onWhat.elem);
          }
        } else {
          elem = dom.getXElemById(action.onWhat.elem);
        }

        var option = action.onWhat.option;
        elem.checkOption(true, option);
        break;

      case "unselect":
        var elem;

        if (!_.isString(action.onWhat.elem)) {
          if (action.onWhat.elem.type === "sel") {
            elem = Object.assign(new XSel, action.onWhat.elem);
          } else if (action.onWhat.elem.type === "mulsel") {
            elem = Object.assign(new XMulSel, action.onWhat.elem);
          }
        } else {
          elem = dom.getXElemById(action.onWhat.elem);
        }

        var option = action.onWhat.option;
        elem.checkOption(false, option);
        break;

      case "showOption":
        var elem;

        if (!_.isString(action.onWhat.elem)) {
          if (action.onWhat.elem.type === "sel") {
            elem = Object.assign(new XSel, action.onWhat.elem);
          } else if (action.onWhat.elem.type === "mulsel") {
            elem = Object.assign(new XMulSel, action.onWhat.elem);
          }
        } else {
          elem = dom.getXElemById(action.onWhat.elem);
        }

        var option = action.onWhat.option;
        elem.showOption(option);
        break;

      case "hideOption":
        var elem;

        if (!_.isString(action.onWhat.elem)) {
          if (action.onWhat.elem.type === "sel") {
            elem = Object.assign(new XSel, action.onWhat.elem);
          } else if (action.onWhat.elem.type === "mulsel") {
            elem = Object.assign(new XMulSel, action.onWhat.elem);
          }
        } else {
          elem = dom.getXElemById(action.onWhat.elem);
        }

        var option = action.onWhat.option;
        elem.hideOption(option);
        break;
    }
  }

  var evalExpression = function(calc) {
    var node = math.parse(calc.expression);
    var unboundVariables = node.filter(function (node) {
      return node.isSymbolNode;
    });

    var scope = {};
    var target = $("*[data-x-id='" + calc.target + "']");

    unboundVariables.forEach(function(variable) {
      scope[variable.name] = $("*[data-x-id='" + variable + "']").val();
    });

    var code = node.compile();
    target.val(code.eval(scope));
  }

  var evalCondition = function(condition) {
    var leftVal = processVal(dom.getValueFromXElem(condition.left));
    var rightVal = processVal(condition.right);

    switch (condition.comp) {
      case "eq":
        return leftVal == rightVal;
      case "neq":
        return leftVal != rightVal;
      case "lt":
        return leftVal < rightVal;
      case "gt":
        return leftVal > rightVal;
      case "lteq":
        return leftVal <= rightVal;
      case "gteq":
        return leftVal >= rightVal;
    }
  }

  this.attachToForm = function(form) {
    form.on("change", function() {
      var conditionEvaluator = false;

      conditionPool.forEach(function(condition) {
        if (condition.type === "calc") {
          evalExpression(condition);
          return;
        }

        var orOutput = [];

        condition.orConnector.forEach(function(andGroup) {
          var andOutput = true;

          andGroup.forEach(function(andCondition) {
            if (!evalCondition(andCondition)) {
              andOutput = false;
              return;
            }
          });

          orOutput.push(andOutput);
        });

        if (orOutput.includes(true)) {
          condition.actions.forEach(function(action) {
            doAction(action.true);
          });
        } else {
          condition.actions.forEach(function(action) {
            doAction(action.false);
          });
        }
      });
    });

    //Initial trigger to go to "init state"
    form.trigger("change");
  }
}

export { XReportEvaluator };
