# XReport
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

XReport is a structured reporting platform for radiologists. It features both template creation and reporting. The created templates can be either static or dynamic. To make them dynamic (e.g. a field only shows up if another field's value is greater than 5) you have to attach FormScript snippets to them.

The project consists of two main parts: `xreport-embed` and `xreport-viewer`.

## xreport-embed

`xreport-embed` is a library that contains the main feature of the platform: template building, template rendering, report generation and script evaluation. It is basically a form builder with custom elements (e.g. scoring table and calculated field, which in combination can be used for a tumor grading system) made specifically for radiological reporting.

### Installation

1. `npm install`
2. `npx webpack`
3. The library will be available in the `dist` folder

### Usage

````javascript
import * as xreportEmbed from 'xreport-embed';

xreportEmbed.makeWidget(
      null, //Template URL, null in case of an empty builder widget
      "",  //Template name
      "div-card-holder", //DOM element to inject widget to
      ).then(() => {
        //Builder initialized successfully
      }).catch(error => {
        //Error initializing
      });
`````

`xreportEmbed.makeWidget` will load the empty builder widget or the existing template to the DOM element specified by the document id.

To learn about all the available form elements (what do they do, how to use them etc.), read the [documentation](https://wpmed92.github.io/xreport/).

## xreport-viewer

`xreport-viewer` is an Angular SPA that incorporates the `xreport-dom` library and serves as an example application for how it can be integrated.

### Installation

1. `npm install`
2. `ng serve`
3. Open the browser