var api = (function(fb) {
  var config = {
    apiKey: "AIzaSyBFDP6EaA26bsOX-wRbtxgCaJyKBOOifvw",
    authDomain: "xreport-f792c.firebaseapp.com",
    databaseURL: "https://xreport-f792c.firebaseio.com",
    projectId: "xreport-f792c",
    storageBucket: "xreport-f792c.appspot.com",
    messagingSenderId: "507317663509"
  };

  fb.initializeApp(config);

  var api = {};
  var SERVERTIME = fb.firestore.FieldValue.serverTimestamp();
  var db = fb.firestore();
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var reportsRef = storageRef.child("reports");

  api.saveReport = function(report) {
    return reportsRef.put(report.file).then(function(snapshot) {
      return db.collection("reports").add({
        name: report.name,
        createdAt: SERVERTIME,
        creator: report.creator
      });
    });
  }

  api.getReports = function() {
    return db.collection("reports").get();
  }

  return api;
})(firebase);
