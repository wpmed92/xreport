import { XFormElem } from './form-elem.js';
import $ from 'jquery';

function XRating() {
  XFormElem.call(this, "rating");
  this.parameters = ["Paraméter 1", "Paraméter 2"];
  this.ratings = ["❌", "✔", "Érték 3"];
  this.title = "Cím";
}

XRating.prototype = Object.create(XFormElem.prototype);

XRating.prototype.render = function() {
  var view = $("<table class='table table-bordered'></table>");
  var model = this;
  this.bind(view);

  //Build header
  var header = $("<thead></thead>");
  var ratingsRow = $("<tr></tr>");
  ratingsRow.append($("<th class='text-secondary' scope='col'>" + model.title + "</th>"));

  model.ratings.forEach(function(rating) {
    var headerCell = $("<th scope='col' class='text-center'><a href='javascript:void(0)'>" + rating + "</a></th>");

    headerCell.click(function() {
      var elemIndex = $(this).index() - 1;

      for (var i = 0; i < model.parameters.length; i++) {
        $("#" + model.id + i + elemIndex).prop("checked", true);
      }
    });

    ratingsRow.append(headerCell);
  });

  header.append(ratingsRow);
  view.append(header);

  //Build body
  var body = $("<tbody></tbody>");
  var newRow = "";

  for (var i = 0; i < model.parameters.length; i++) {
    newRow = $("<tr></tr>");
    newRow.append($("<td>" + model.parameters[i] + "</td>"));

    for (var j = 0; j < model.ratings.length; j++) {
      newRow.append($("<td class='text-center'>\
                          <input id='" + (model.id + i + j) + "'type='radio' name='" + (model.id + "-" + i) + "' value='option1'>\
                        </td>"));
    }

    body.append(newRow);
  }

  view.append(body);
  return view;
}

XRating.prototype.buildEditor = function() {
  var model = this;
  var editor = $("<div class='form-group'></div>");
  var textAreaParameters = $("<textarea class='form-control' rows='5' id='comment'></textarea>");
  var textAreaRatings = $("<textarea class='form-control' rows='5' id='comment'></textarea>");
  var updateOptionsBtn = $("<br><button type='button' class='btn btn-secondary'>Mentés</button>");

  updateOptionsBtn.click(function() {
    var parameters = textAreaParameters.val().split(';');
    var ratings = textAreaRatings.val().split(';');
    var view = $("*[data-x-id='" + model.id + "']");
    var newView = "";
    view.html("");
    model.parameters = [];
    model.ratings = [];

    //Parameters
    parameters.forEach(function(parameter) {
      if (!parameter || parameter === "") {
        return;
      }

      model.parameters.push(parameter);
    });

    //Ratings
    ratings.forEach(function(rating) {
      if (!rating || rating === "") {
        return;
      }

      model.ratings.push(rating);
    });

    newView = model.render();
    newView.addClass(view.hasClass("d-none") ? "d-none" : "");
    view.replaceWith(newView);
  });

  var titleEditor = $("<div class='form-group'><label>Táblázat címe</label></div>");
  var inp = $("<input type='text' class='form-control'>");
  inp.val(model.val);

  inp.on("change", function() {
    var val = $(this).val();
    var view = $("*[data-x-id='" + model.id + "']");
    var newView = "";
    model.title = val;
    newView = model.render();
    newView.addClass(view.hasClass("d-none") ? "d-none" : "");
    view.replaceWith(newView);
  });

  //Fill in model data to editor
  var parametersString = "";
  var ratingsString = "";

  model.parameters.forEach(function(parameter) {
    parametersString += parameter + ";";
  });

  model.ratings.forEach(function(rating) {
     ratingsString += rating + ";";
  });

  inp.val(model.title);

  textAreaParameters.val(parametersString);
  textAreaRatings.val(ratingsString);
  titleEditor.append(inp);
  editor.append(titleEditor);
  editor.append("<label>Értékek</label>");
  editor.append(textAreaRatings);
  editor.append("<label>Paraméterek</label>");
  editor.append(textAreaParameters);
  editor.append(updateOptionsBtn);

  return editor;
}

XRating.prototype.genText = function() {
  var model = this;
  var view = $("*[data-x-id='" + model.id + "']").find("tbody");
  var parameterIndex = 0;
  var out = "";

  view.find("tr").each(function() {
    var row = $(this);
    var ratingIndex = row.find("input:checked").first().parent().index() - 1;

    if (ratingIndex >= 0) {
      if (model.ratings[ratingIndex] === "Van") {
        out += "->" + model.parameters[parameterIndex] + ": " + model.ratings[ratingIndex] + "\n";
      } else {
        out += model.parameters[parameterIndex] + ": " + model.ratings[ratingIndex] + "\n";
      }
    }

    parameterIndex++;
  });

  if (out !== "") {
    if (model.title !== "") {
      out = "\n|" + model.title + "|\n" + out;
    } else {
      out = "\n" + out;
    }
  }

  return out;
}

export { XRating };
