# XReport
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

XReport is a structured reporting platform for radiologists. It features both template creation and reporting. The created templates can be either static or dynamic. To make them dynamic (e.g. a field only shows up if another field's value is greater than 5) you have to attach FormScript snippets to them.

The project consists of two main parts: `xreport-embed` and `xreport-viewer`.

For a live demo click [here](https://app.radiosheets.com)!

## xreport-embed

`xreport-embed` is a library that contains the main features of the platform: template building, template rendering, report generation and script evaluation. It is basically a form builder with custom elements (e.g. scoring table and calculated field, which in combination can be used for a tumor grading system) made specifically for radiological reporting.

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

To learn about all the available form elements (what do they do, how to use them, etc.), read the [documentation](https://wpmed92.github.io/xreport/).

## xreport-viewer

`xreport-viewer` is an Angular SPA that incorporates the `xreport-dom` library and serves as an example application for how it can be integrated.

To be able to run the app you have to setup a [Firebase]("https://firebase.google.com/") project.

### Setting up the Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on *Add project*
3. Go through the 3 step project creation process
4. On the welcome screen click on the Web icon under "Get started by adding Firebase to your app"
5. In step 2. "Add Firebase SDK" click on "use npm" and copy the initialization code. When asked if Hosting should be setup, click on yes.
6. Install the firebase CLI
7. Click on *Firestore Database* and add two collections: *categories* and *reports* (this will store the metadata of templates)
8. Click on *Storage* and create a Storage Bucket named  
*templates* (this is where the template JSONs will be stored)
9. Optional: You can set up *Authentication*, but it is not needed for the app to run properly
10. In *src/environments/environment.ts* and *src/environments/environment.prod.ts* replace the *firebase* property with the values specific for your project you got in step 5.

### Installation

1. `npm install -g @angular/cli`
2. `npm install`
3. `ng serve`
4. Open the browser

### Usage

