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
			this.topicsRef = null;
		};

		firebaseUtilObj.prototype.initialize = function(showSignIn, showDashboard) {
			firebase.initializeApp(config);
			this.database = firebase.database(); 
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

		firebaseUtilObj.prototype.signOutUser = function() {
			firebase.auth().signOut();
		};

		firebaseUtilObj.prototype.watchList = function(reference, handler) {
			this.database.ref(reference).on('child_added', handler)
		};

		firebaseUtilObj.prototype.stopWatchingList = function(reference) {
			this.database.ref(reference).off('child_added')
		};


		firebaseUtilObj.prototype.pushChild = function(reference, child) {
			this.database.ref(reference).push(child)
		};

		return firebaseUtilObj;
	})();
});


