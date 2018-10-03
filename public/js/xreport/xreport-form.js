//XReport form components
var XReportForm = (function(jQ) {
  //Base XFormElem
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

  //label
  function XLabel(label) {
    XFormElem.call(this, "label");
    this.val = label;
  }

  XLabel.prototype = Object.create(XFormElem.prototype);

  XLabel.prototype.render = function(forId) {
    var _for = (forId) ? ("for='" + forId + "'") : "";
    var formattedVal = (forId) ? this.val : ("<b>" + this.val + "</b>");
    var view = jQ("<label " + _for + ">" + formattedVal + "</label>");
    this.bind(view);
    return view;
  }

  XLabel.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div class='form-group'></div>");
    editor.append("<label>Mező neve</label>");
    var inp = jQ("<input type='text' class='form-control'>");
    inp.val(model.val);

    inp.on("change", function() {
      var val = jQ(this).val();
      model.val = val;
      var view = jQ("*[data-x-id='" + model.id + "']");

      if (model.type === "header") {
        view.find(":header").text(val);
      } else {
        if (view.find("b").length > 0) {
          view.find("b").eq(0).text(val);
        } else {
          view.text(val);
        }
      }
    });

    editor.append(inp);
    return editor;
  }

  function XPlainText(text) {
    XLabel.call(this, text);
    this.type = "text";
    this.color = "primary";
  }

  XPlainText.prototype = Object.create(XLabel.prototype);

  XPlainText.prototype.render = function() {
    var view = jQ("<b class='text-" + this.color + "'>" + this.val + "</b>");
    this.bind(view);
    return view;
  }

  XPlainText.prototype.buildEditor = function() {
    var baseEditor = XLabel.prototype.buildEditor.call(this);
    var view = jQ("<select class='form-control'></select>");
    var model = this;

    view.append(jQ('<option>', {
      value: "primary",
      text : "Elsődleges"
    }));
    view.append(jQ('<option>', {
      value: "secondary",
      text : "Másodlagos"
    }));
    view.append(jQ('<option>', {
      value: "success",
      text : "Siker"
    }));
    view.append(jQ('<option>', {
      value: "danger",
      text : "Veszély"
    }));
    view.append(jQ('<option>', {
      value: "warning",
      text : "Figyelmeztetés"
    }));
    view.append(jQ('<option>', {
      value: "info",
      text : "Információ"
    }));

    view.on("change", function() {
      var val = $(this).val();
      model.color = val;
      var currentView = jQ("*[data-x-id='" + model.id + "']");
      currentView.replaceWith(model.render());
    });

    baseEditor.append(view);
    return baseEditor;
  }

  //Label -> Header
  function XHeader(text) {
    XLabel.call(this, text);
    this.type = "header";
  }

  XHeader.prototype = Object.create(XLabel.prototype);

  XHeader.prototype.render = function() {
    var view = jQ("<div><h5>" + this.val + "</h5><hr></div>");
    this.bind(view);
    return view;
  }

  XHeader.prototype.genText = function() {
    return ("\n" + this.val + "\n------------------------------------");
  }

  //Label -> Info
  function XInfo(text, type) {
    XLabel.call(this, text);
    this.type = type;
  }

  XInfo.prototype = Object.create(XLabel.prototype);

  XInfo.prototype.render = function() {
    var view = jQ("<div class='alert alert-" + this.type + "' role='alert'>" + this.val + "</div>");
    this.bind(view);
    return view;
  }

  XInfo.prototype.buildEditor = function() {
    var baseEditor = XLabel.prototype.buildEditor.call(this);
    var view = jQ("<select class='form-control'></select>");
    var model = this;

    view.append(jQ('<option>', {
      value: "info",
      text : "Magyarázó szöveg"
    }));
    view.append(jQ('<option>', {
      value: "danger",
      text : "Figyelmeztető szöveg"
    }));

    view.on("change", function() {
      var val = $(this).val();
      model.type = val;
      var currentView = jQ("*[data-x-id='" + model.id + "']");
      currentView.replaceWith(model.render());
    });

    baseEditor.append(view);
    return baseEditor;
  }

  //Numberbox
  function XInNum() {
    XFormElem.call(this, "innum");
    this.min = -Infinity;
    this.max = Infinity;
    this.unit = "";
  }

  XInNum.prototype = Object.create(XFormElem.prototype);

  XInNum.prototype.render = function() {
    var model = this;
    var view = jQ("<input type='number' class='form-control' min='" + model.min + "' max='" + model.max + "' >");
    this.bind(view);

    if (model.unit) {
      view.wrap("<div class='input-group mb-3'></div>");
      view.parent().append("<div class='input-group-append'>\
                              <span class='input-group-text'>" + model.unit + "</span>\
                            </div>");
      view = view.parent();
    }

    return view;
  }

  XInNum.prototype.getValue = function() {
    return jQ("*[data-x-id='" + this.id + "']").val();
  }

  XInNum.prototype.genText = function() {
    var val = jQ("*[data-x-id='" + this.id + "']").val();

    if (!val) {
      return null;
    }

    return jQ("*[data-x-id='" + this.id + "']").val() + " " + ((this.unit) ? this.unit : "");
  }

  XInNum.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div></div>");
    var view = jQ("*[data-x-id='" + model.id + "']");
    var minWrapper = jQ("<div class='form-group'><label>Minimum érték</label></div>");
    var minControl = jQ("<input type='number' class='form-control'>");
    var maxWrapper = jQ("<div class='form-group'><label>Maximum érték</label></div>");
    var maxControl = jQ("<input type='number' class='form-control'>");
    var unitWrapper = jQ("<div class='form-group' class='form-control'><label>Mértékegység</label></div>");
    var unitControl = jQ("<input type='text' class='form-control'>");

    unitControl.val(model.unit);
    minControl.val(model.min);
    maxControl.val(model.max);

    minControl.on("change", function() {
      var val = jQ(this).val();
      model.min = val;
      view.attr("min", val);
    });

    maxControl.on("change", function() {
      var val = jQ(this).val();
      model.max = val;
      view.attr("max", val);
    });

    unitControl.on("change", function() {
      var val = jQ(this).val();
      model.unit = val;

      if (!val) {
        view.parent().find(".input-group-append").remove();
        return;
      }

      if (!view.parent().hasClass("input-group")) {
        view.wrap("<div class='input-group mb-3'></div>");
        view.parent().append("<div class='input-group-append'>\
                                <span class='input-group-text'>" + model.unit + "</span>\
                              </div>");
      } else {
        view.parent().find(".input-group-text").first().html(model.unit);
      }
    });

    minWrapper.append(minControl);
    maxWrapper.append(maxControl);
    unitWrapper.append(unitControl);
    editor.append(minWrapper);
    editor.append(maxWrapper);
    editor.append(unitWrapper);
    return editor;
  }

  //Numberbox
  function XCalcOut() {
    XFormElem.call(this, "calcout");
    this.min = -Infinity;
    this.max = Infinity;
    this.unit = "";
  }

  XCalcOut.prototype = Object.create(XFormElem.prototype);

  XCalcOut.prototype.render = function() {
    var model = this;
    var view = jQ("<input type='number' class='form-control' min='" + model.min + "' max='" + model.max + "' disabled>");
    this.bind(view);

    if (model.unit) {
      view.wrap("<div class='input-group mb-3'></div>");
      view.parent().append("<div class='input-group-append'>\
                              <span class='input-group-text'>" + model.unit + "</span>\
                            </div>");
      view = view.parent();
    }

    return view;
  }

  XCalcOut.prototype.getValue = function() {
    return jQ("*[data-x-id='" + this.id + "']").val();
  }

  XCalcOut.prototype.genText = function() {
    var val = jQ("*[data-x-id='" + this.id + "']").val();

    if (!val) {
      return null;
    }

    return jQ("*[data-x-id='" + this.id + "']").val() + " " + ((this.unit) ? this.unit : "");
  }

  XCalcOut.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div></div>");
    var view = jQ("*[data-x-id='" + model.id + "']");
    var unitWrapper = jQ("<div class='form-group' class='form-control'><label>Mértékegység</label></div>");
    var unitControl = jQ("<input type='text' class='form-control'>");
    unitControl.val(model.unit);

    unitControl.on("change", function() {
      var val = jQ(this).val();
      var wasUnitEmpty = model.unit === "";
      model.unit = val;

      if (wasUnitEmpty) {
        view.replaceWith(model.render());
      } else {
        view.parent().replaceWith(model.render());
      }
    });

    unitWrapper.append(unitControl);
    editor.append(unitWrapper);
    return editor;
  }

  //Textbox
  function XInText() {
    XFormElem.call(this, "intext");
  }

  XInText.prototype = Object.create(XFormElem.prototype);

  XInText.prototype.render = function() {
    var view = jQ("<input type='text' class='form-control'>")
    this.bind(view);

    return view;
  }

  XInText.prototype.getValue = function() {
    return jQ("*[data-x-id='" + this.id + "']").val();
  }

  XInText.prototype.genText = function() {
    return jQ("*[data-x-id='" + this.id + "']").val();
  }

  //Checkbox
  function XInBool(style) {
    XFormElem.call(this, "inbool");
    this.style = style || "checkbox";
  }

  XInBool.prototype = Object.create(XFormElem.prototype);

  XInBool.prototype.render = function(checked) {
    var view = jQ("<div class='form-check'>\
                <input id='" + this.id + "' class='form-check-input' type='" + this.style + "'" + (checked ? "checked" : "") + ">\
              </div>");
    this.bind(view);
    return view;
  }

  //textArea
  function XTextArea(rows) {
    XFormElem.call(this, "tarea");
    this.rows = 3;
  }

  XTextArea.prototype = Object.create(XFormElem.prototype);

  XTextArea.prototype.render = function() {
    var view = jQ("<textarea class='form-control' rows='" + this.rows + "'></textarea>");
    this.bind(view);
    return view;
  }

  XTextArea.prototype.getValue = function() {
    return jQ("*[data-x-id='" + this.id + "']").val();
  }

  XTextArea.prototype.genText = function() {
    return jQ("*[data-x-id='" + this.id + "']").val();
  }

  //Select
  function XSel(style) {
    XFormElem.call(this, "sel");
    this.style = style || "default";
    this.options = ["Opció 1", "Opció 2"];
  }

  XSel.prototype = Object.create(XFormElem.prototype);

  XSel.prototype.render = function() {
    var view = "";
    var model = this;
    model.style = "radio";

    if (this.style === "radio") {
      view = jQ("<div></div>");

      for (var i = 0; i < model.options.length; i++) {
        view.append(jQ('<div class="form-check">\
                          <input class="form-check-input" type="radio" name="' + model.id + '" id="' + model.id +  "-" + i + '" value="option1">\
                          <label class="form-check-label" for="' + model.id + "-" + i + '">'
                            + model.options[i] +
                          '</label>\
                        </div>')
                      );
      }
    } else {
      view = jQ("<select class='form-control'></select>");

      model.options.forEach(function(option) {
        view.append(jQ('<option>', {
          value: option,
          text : option
        }));
      });
    }

    this.bind(view);
    return view;
  }

  XSel.prototype.getValue = function() {
    var view = jQ("*[data-x-id='" + this.id + "']");
    var selectedLabel = view.find("input:checked").first().next();

    return selectedLabel.text();
  }

  XSel.prototype.checkOption = function(check, option) {
    var model = this;
    var view = jQ("*[data-x-id='" + model.id + "']");
    var indexOfOption = model.options.indexOf(option);
    view.find("input").eq(indexOfOption).prop("checked", check);
  }

  XSel.prototype.showOption = function(option) {
    var model = this;
    var view = jQ("*[data-x-id='" + model.id + "']");
    var indexOfOption = model.options.indexOf(option);
    view.find("input").eq(indexOfOption).parent().removeClass("collapse");
  }

  XSel.prototype.hideOption = function(option) {
    var model = this;
    var view = jQ("*[data-x-id='" + model.id + "']");
    var indexOfOption = model.options.indexOf(option);
    view.find("input").eq(indexOfOption).parent().addClass("collapse");
  }

  XSel.prototype.genText = function() {
    var view = jQ("*[data-x-id='" + this.id + "']");
    var selectedLabel = view.find("input:checked").first().next();

    return selectedLabel.text();
  }

  XSel.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var textArea = jQ("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var updateOptionsBtn = jQ("<br><button type='button' class='btn btn-secondary'>Mentés</button>");
    var view = jQ("*[data-x-id='" + model.id + "']");

    updateOptionsBtn.click(function() {
      var text = textArea.val();
      var splitted = text.split(';');
      model.options = [];
      view.html("");

      splitted.forEach(function(option) {
        if (!option || option === "") {
          return;
        }

        model.options.push(option);

        /*if (model.style === "radio") {
            var inbool = new XInBool("radio");
            var inboolView = inbool.render();
            inboolView.find("input").first().attr("name", model.id);
            var radio = inboolView.append(new XLabel(option).render());
            view.append(radio);
        } else {
          view.append(jQ('<option>', {
            value: option,
            text : option
          }));
        }*/
      });

      view.replaceWith(model.render());
    });

    var optionsStringified = "";

    model.options.forEach(function(option) {
      optionsStringified += option + ";";
    });

    textArea.val(optionsStringified);
    editor.append(textArea);
    editor.append(updateOptionsBtn);
    return editor;
  }

  //Multiple select
  function XMulSel(style) {
    XFormElem.call(this, "mulsel");
    this.style = style || "default";
    this.options = ["Opció 1", "Opció 2"];
  }

  XMulSel.prototype = Object.create(XFormElem.prototype);

  XMulSel.prototype.render = function() {
    var view = "";
    var model = this;

    if (this.style === "checkbox") {
      view = jQ("<div></div>");

      model.options.forEach(function(option) {
        var inbool = new XInBool();
        var isOptionChecked = option.startsWith("*");

        if (isOptionChecked) {
          option = option.slice(1, option.length);
        }

        var inboolView = inbool.render(isOptionChecked);
        var check = inboolView.append(new XLabel(option).render(inbool.id));
        view.append(check);
      });
    } else {
      view = jQ("<select class='form-control' multiple></select>");
    }

    this.bind(view);
    return view;
  }

  XMulSel.prototype.checkOption = function(check, option) {
    var model = this;
    var view = jQ("*[data-x-id='" + model.id + "']");
    var indexOfOption = model.options.indexOf(option);
    view.find("input").eq(indexOfOption).prop("checked", check);
  }

  XMulSel.prototype.showOption = function(option) {
    var model = this;
    var view = jQ("*[data-x-id='" + model.id + "']");
    var indexOfOption = model.options.indexOf(option);
    view.find("input").eq(indexOfOption).parent().removeClass("collapse");
  }

  XMulSel.prototype.hideOption = function(option) {
    var model = this;
    var view = jQ("*[data-x-id='" + model.id + "']");
    var indexOfOption = model.options.indexOf(option);
    view.find("input").eq(indexOfOption).parent().addClass("collapse");
  }

  XMulSel.prototype.genText = function() {
    var out = "";
    var view = jQ("*[data-x-id='" + this.id + "']");

    view.find("input:checked").each(function() {
      var label = $(this).next();
      out += label.text() + ", ";
    });

    out = out.slice(0, out.length - 2);

    return out;
  }

  XMulSel.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div class='form-group'></div>");
    editor.append("<label>Opciók</label>");
    var textArea = jQ("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var updateOptionsBtn = jQ("<br><button type='button' class='btn btn-secondary'>Mentés</button>");
    var view = jQ("*[data-x-id='" + model.id + "']");

    updateOptionsBtn.click(function() {
      var text = textArea.val();
      var splitted = text.split(';');
      view.empty();
      model.options = [];

      splitted.forEach(function(option) {
        if (!option || option === "") {
          return;
        }

        model.options.push(option);

        /*if (model.style === "checkbox") {
            var inbool = new XInBool();
            var inboolView = inbool.render(true);
            var check = inboolView.append(new XLabel(option).render(inbool.id));
            view.append(check);
        } else {
          view.append(jQ('<option>', {
            value: option,
            text : option
          }));
        }*/
      });

      view.replaceWith(model.render());
    });

    var optionsStringified = "";

    model.options.forEach(function(option) {
      optionsStringified += option + ";";
    });

    textArea.val(optionsStringified);
    editor.append(textArea);
    editor.append(updateOptionsBtn);
    return editor;
  }

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

  //Rating table
  function XRating() {
    XFormElem.call(this, "rating");
    this.parameters = ["Paraméter 1", "Paraméter 2"];
    this.ratings = ["❌", "✔", "Érték 3"];
    this.title = "Cím";
  }

  XRating.prototype = Object.create(XFormElem.prototype);

  XRating.prototype.render = function() {
    var view = jQ("<table class='table table-bordered'></table>");
    var model = this;
    this.bind(view);

    //Build header
    var header = jQ("<thead></thead>");
    var ratingsRow = jQ("<tr></tr>");
    ratingsRow.append(jQ("<th class='text-secondary' scope='col'>" + model.title + "</th>"));

    model.ratings.forEach(function(rating) {
      var headerCell = jQ("<th scope='col' class='text-center'><a href='javascript:void(0)'>" + rating + "</a></th>");

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
    var body = jQ("<tbody></tbody>");
    var newRow = "";

    for (var i = 0; i < model.parameters.length; i++) {
      newRow = jQ("<tr></tr>");
      newRow.append(jQ("<td>" + model.parameters[i] + "</td>"));

      for (var j = 0; j < model.ratings.length; j++) {
        newRow.append(jQ("<td class='text-center'>\
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
    var editor = jQ("<div class='form-group'></div>");
    var textAreaParameters = jQ("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var textAreaRatings = jQ("<textarea class='form-control' rows='5' id='comment'></textarea>");
    var updateOptionsBtn = jQ("<br><button type='button' class='btn btn-secondary'>Mentés</button>");

    updateOptionsBtn.click(function() {
      var parameters = textAreaParameters.val().split(';');
      var ratings = textAreaRatings.val().split(';');
      var view = jQ("*[data-x-id='" + model.id + "']");
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

    var titleEditor = jQ("<div class='form-group'><label>Táblázat címe</label></div>");
    var inp = jQ("<input type='text' class='form-control'>");
    inp.val(model.val);

    inp.on("change", function() {
      var val = jQ(this).val();
      var view = jQ("*[data-x-id='" + model.id + "']");
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
    var view = jQ("*[data-x-id='" + model.id + "']").find("tbody");
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

  //Image
  function XImage() {
    XFormElem.call(this, "image");
    this.src = "https://uploads-ssl.webflow.com/57e5747bd0ac813956df4e96/5aebae14c6d254621d81f826_placeholder.png";
    this.author = "Kép forrása";
  }

  XImage.prototype = Object.create(XFormElem.prototype);

  XImage.prototype.render = function() {
    var view = jQ("<div></div>")
    view.append("<img src='" + this.src + "'></img>");
    view.append("<p class='text-info'>" + this.author + "</p>");
    this.bind(view);

    return view;
  }

  XImage.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div class='form-group'></div>");
    var srcInp = jQ("<input type='text' class='form-control'>");
    var authorInp = jQ("<input type='text' class='form-control'>");
    srcInp.val(model.src);
    authorInp.val(model.author);

    //Source editor
    srcInp.on("change", function() {
      var val = jQ(this).val();
      model.src = val;
      var view = jQ("*[data-x-id='" + model.id + "']");
      view.find("img").attr("src", model.src);
    });

    //Author editor
    authorInp.on("change", function() {
      var val = jQ(this).val();
      model.author = val;
      var view = jQ("*[data-x-id='" + model.id + "']");
      view.find("p").text(model.author);
    });

    editor.append("<label>Kép URL</label>");
    editor.append(srcInp);
    editor.append("<label>Kép forrása</label>");
    editor.append(authorInp);

    return editor;
  }

  //Form group
  //orientation can be "horizontal" or "vertical"
  function XFormGroup(orientation, label) {
    XFormElem.call(this, "group");
    this.child = "";
    this.label = new XLabel(label);
  }

  XFormGroup.prototype = Object.create(XFormElem.prototype);

  XFormGroup.prototype.addChild = function(child) {
    this.child = child;
  }

  XFormGroup.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div></div>");
    editor.append(this.label.buildEditor());
    editor.append(this.child.buildEditor());
    return editor;
  }

  XFormGroup.prototype.render = function() {
    var view = jQ("<div class='form-group'></div>");
    this.bind(view);

    if (this.child.type === "inbool") {
      var checkLabel = this.child.render();
      view.append(checkLabel.append(this.label.render(this.child.id)));
    } else {
      view.append(this.label.render());
      view.append(this.child.render());
    }

    return view;
  }

  XFormGroup.prototype.genText = function() {
    if (this.child.type === "inbool") {
      var view = jQ("*[data-x-id='" + this.id + "']");
      var checked = view.find("input:checked").first();

      if (checked.length > 0) {
        return checked.next().text();
      }
    } else if (isFunction(this.child.genText) && !!this.child.genText()) {
      return this.label.val + ": " + this.child.genText();
    }

    return "";
  }

  //Form row (for custom elems)
  function XFormRow() {
    XFormElem.call(this, "row");
    this.children = [];
  }

  XFormRow.prototype = Object.create(XFormElem.prototype);

  XFormRow.prototype.addChild = function(child) {
    this.children.push(child);
  }

  XFormRow.prototype.render = function() {
    var view = jQ("<div class='form-row'></div>");
    var model = this;
    this.bind(view);

    this.children.forEach(function(child) {
      var col = jQ("<div class='col my-auto x-form-wrapper'></div>");
      col.append(child.render());
      view.append(col);
    });

    return view;
  }

  XFormRow.prototype.buildEditor = function() {
    var model = this;
    var editor = jQ("<div></div>");

    model.children.forEach(function(child) {
      editor.append(child.buildEditor());
    });

    return editor;
  }

  isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  XFormRow.prototype.genText = function() {
    var out = "";

    this.children.forEach(function(child) {
      if (isFunction(child.genText) && child.genText() !== "") {
        out += child.genText();

        if (child.type !== "header") {
          out += ", ";
        }
      }
    });

    if (out !== "") {
      out = out.slice(0, out.length - 2);
      out += "\n";
    }

    return out;
  }

  return {
    Label: XLabel,
    Text: XInText,
    PlainText: XPlainText,
    Header: XHeader,
    Info: XInfo,
    Num: XInNum,
    CalcOut: XCalcOut,
    Bool: XInBool,
    Sel: XSel,
    MulSel: XMulSel,
    Group: XFormGroup,
    Datepicker: XDate,
    Row: XFormRow,
    TextArea: XTextArea,
    Rating: XRating,
    Image: XImage
  }
})($);
