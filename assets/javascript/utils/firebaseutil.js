$(function () {
	app.firebaseUtil = (function () {
		const config = {
			apiKey: "AIzaSyC5YSojC81RtawxiAC0CaO9m9h1JuDwBtI",
			authDomain: "talktoanonymous-d65df.firebaseapp.com",
			databaseURL: "https://talktoanonymous-d65df.firebaseio.com",
			projectId: "talktoanonymous-d65df",
			storageBucket: "",
			messagingSenderId: "709944500981"
		};

		var firebaseUtilObj = function () {
		};

		firebaseUtilObj.prototype.initialize = function(showSignIn, showDashboard) {
			firebase.initializeApp(config);
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			  	showDashboard(user);
			  } else {
			  	showSignIn();
			  }
			});
		};

		firebaseUtilObj.prototype.createUser = function(email, password, erroCallBack) {
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(erroCallBack);
		};

		firebaseUtilObj.prototype.signInUser = function(email, password, erroCallBack) {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(erroCallBack);
		};

		firebaseUtilObj.prototype.signOutUser = function(successCallBack, erroCallBack) {
			firebase.auth().signOut().then(successCallBack).catch(erroCallBack);
		};

		return firebaseUtilObj;
	})();
});

