$(function () {
	app.firebaseUtil = (function () {
		// Firebase configuration details.
		const config = {
			apiKey: "AIzaSyC5YSojC81RtawxiAC0CaO9m9h1JuDwBtI",
			authDomain: "talktoanonymous-d65df.firebaseapp.com",
			databaseURL: "https://talktoanonymous-d65df.firebaseio.com",
			projectId: "talktoanonymous-d65df",
			storageBucket: "",
			messagingSenderId: "709944500981"
		};

		// Firebase util constructor
		var firebaseUtilObj = function () {
			this.topicsRef = null;
		};

		// Firebase util initialze
		// 1. Creats database instance
		// 2. Handles user authentication state change
		// @param {function} showSignIn callback function to route user to sign page
		// @param {function} showDashboard callback function to route user to dashboard page
		firebaseUtilObj.prototype.initialize = function(showSignIn, showDashboard) {
			firebase.initializeApp(config);
			this.database = firebase.database(); 
			firebase.auth().onAuthStateChanged(function(user) {
				// If user is authenticated route to dashboard
				// else route to sign in page
				if (user) {
					showDashboard(user);
				} else {
					showSignIn();
				}
			});
		};

		// Creates user
		// @param {string} email validated user email
		// @param {string} password validated user password
		// @param {function} erroCallBack callback function to call when create user fails
		firebaseUtilObj.prototype.createUser = function(email, password, erroCallBack) {
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(erroCallBack);
		};

		// Sign In user utility
		// @param {string} email validated user email
		// @param {string} password validated user password
		// @param {function} erroCallBack callback function to call when sign in user fails
		firebaseUtilObj.prototype.signInUser = function(email, password, erroCallBack) {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(erroCallBack);
		};

		// Sign out user utility
		firebaseUtilObj.prototype.signOutUser = function() {
			firebase.auth().signOut();
		};

		// Function to watch a list for child added event
		// @param {string} reference to the list in firebase database that has to be watched
		// @param {function} handler call back function to handle when a child is added to the list
		firebaseUtilObj.prototype.watchList = function(reference, handler) {
			this.database.ref(reference).on('child_added', handler);
		};

		// Function to stio watching a list
		// @param {string} reference to the list in firebase database that has to be watched
		firebaseUtilObj.prototype.stopWatchingList = function(reference) {
			this.database.ref(reference).off('child_added');
		};

		// Funtion to add a child to a list in firebase database
		// @param {string} reference to the list in firebase database to which child has to be added
		// @param {object} child child object that needs to be added
		firebaseUtilObj.prototype.pushChild = function(reference, child) {
			this.database.ref(reference).push(child);
		};

		return firebaseUtilObj;
	})();
});


