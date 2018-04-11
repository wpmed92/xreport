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
  var provider = new fb.auth.GoogleAuthProvider();

  api.login = function() {
    return firebase.auth().signInWithPopup(provider);
  }
  
  api.saveReport = function(report) {
    return db.collection("reports").add({
      name: report.name,
      createdAt: SERVERTIME,
      creator: report.creator,
      contentUrl: ""
    }).then(function(initialDoc) {
        return storageRef.child("reports/" + initialDoc.id).put(report.file)
                .then(function(snapshot) {
                  return { doc: initialDoc, downloadUrl: snapshot.downloadURL };
                });
    }).then(function(uploadResp) {
        return uploadResp.doc.set({
          contentUrl: uploadResp.downloadUrl
        }, { merge: true });
    });
  }

  api.getReport = function(id) {
    return db.collection("reports").doc(id).get();
  }

  api.getReports = function() {
    return db.collection("reports").get();
  }

  return api;
})(firebase);
