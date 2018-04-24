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

  api.onAuthStateChanged = function(cbSignedIn, cbSignedOut) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        cbSignedIn(user);
      } else {
        cbSignedOut();
      }
    });
  }

  api.logIn = function() {
    return firebase.auth().signInWithPopup(provider);
  }

  api.logOut = function() {
    return firebase.auth().signOut();
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

  api.editReport = function(report, id) {
    return db.collection("reports").doc(id).set({
      name: report.name,
      createdAt: SERVERTIME,
      creator: report.creator,
      category: report.category
    }, { merge: true })
    .then(function(initialDoc) {
        return storageRef.child("reports/" + id).put(report.file);
    });
  }

  api.getReport = function(id) {
    return db.collection("reports").doc(id).get();
  }

  api.getReports = function() {
    return db.collection("reports").get();
  }

  api.getCategories = function() {
    return db.collection("categories").get();
  }

  return api;
})(firebase);
