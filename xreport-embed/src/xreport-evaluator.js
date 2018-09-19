import { $ as jQ } from 'jquery';

form.on("change", function() {
  var conditionEvaluator = false;

  conditionPool.forEach(function(condition) {
    //TEST: in case of calculation
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

function evalCondition(condition) {
  var leftVal = processVal(getValueFromXElem(condition.left));
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

function evalExpression(calc) {
  var node = math.parse(calc.expression);
  var unboundVariables = node.filter(function (node) {
    return node.isSymbolNode;
  });

  var scope = {};
  var target = jQ("*[data-x-id='" + calc.target + "']");

  unboundVariables.forEach(function(variable) {
    scope[variable.name] = jQ("*[data-x-id='" + variable + "']").val();
  });

  var code = node.compile();
  target.val(code.eval(scope));
}

function doAction(action) {
  switch (action.doWhat) {
    case "hide":
      jQ("*[data-x-id='" + action.onWhat + "']").closest(".col").hide();
      break;

    case "show":
      jQ("*[data-x-id='" + action.onWhat + "']").closest(".col").show();
      break;

    case "select":
      var elem = getXElemById(action.onWhat.elem);
      var option = action.onWhat.option;
      elem.checkOption(true, option);
      break;

    case "unselect":
      var elem = getXElemById(action.onWhat.elem);
      var option = action.onWhat.option;
      elem.checkOption(false, option);
      break;

    case "showOption":
      var elem = getXElemById(action.onWhat.elem);
      var option = action.onWhat.option;
      elem.showOption(option);
      break;

    case "hideOption":
      var elem = getXElemById(action.onWhat.elem);
      var option = action.onWhat.option;
      elem.hideOption(option);
      break;
  }
}
