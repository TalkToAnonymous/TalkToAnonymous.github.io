// Declare a class for all Firebase related API calls
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
			this.onlineUserRef = null;
			this.handleAuthChange = this.handleAuthChange.bind(this);
			this.removeOnlineUser = this.removeOnlineUser.bind(this);
			this.signOutUser = this.signOutUser.bind(this);
		};

		// Firebase util initialze
		// 1. Creats database instance
		// 2. Handles user authentication state change
		// @param {function} showSignIn callback function to route user to sign page
		// @param {function} showDashboard callback function to route user to dashboard page
		firebaseUtilObj.prototype.initialize = function(showSignIn, showDashboard) {
			firebase.initializeApp(config);
			this.database = firebase.database();
			this.showSignIn = showSignIn;
			this.showDashboard = showDashboard;
			const self = this;
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
			firebase.auth().onAuthStateChanged(this.handleAuthChange);
		};

		// Handles authentication change
		firebaseUtilObj.prototype.handleAuthChange = function(user) {
			// If user is authenticated route to dashboard
			// else route to sign in page
			if (user) {
				this.showDashboard(user);
				this.onlineUserRef = this.pushChild('onlineUsers', user.uid);
				$(window).unbind("beforeunload").bind("beforeunload", this.removeOnlineUser);
			} else {
				this.showSignIn();
			}
		}

		// Removes user from onlineUsers
		firebaseUtilObj.prototype.removeOnlineUser = function() {
			if(this.onlineUserRef) {
				this.removeChild('onlineUsers/' + this.onlineUserRef.key);
			}
		}

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

		// Sends password reset email
		firebaseUtilObj.prototype.resetPassword = function(email, successCallback, erroCallBack) {
			firebase.auth().sendPasswordResetEmail(email).then(successCallback).catch(erroCallBack);
		};

		// Sign out user utility
		firebaseUtilObj.prototype.signOutUser = function() {
			this.removeOnlineUser();
			firebase.auth().signOut();
		};

		// Function to watch a list for child added event
		// @param {string} reference to the list in firebase database that has to be watched
		// @param {function} handler call back function to handle when a child is added to the list
		firebaseUtilObj.prototype.watchList = function(reference, handler) {
			this.database.ref(reference).on('child_added', handler);
		};

		// Function to stop watching a list
		// @param {string} reference to the list in firebase database that has to be watched
		firebaseUtilObj.prototype.stopWatchingList = function(reference) {
			this.database.ref(reference).off('child_added');
		};

		// Function to add a child to a list in firebase database
		// @param {string} reference to the list in firebase database to which child has to be added
		// @param {object} child child object that needs to be added
		firebaseUtilObj.prototype.pushChild = function(reference, child) {
			return this.database.ref(reference).push(child);
		};

		// Removes a child from list of elements in Firebase
		firebaseUtilObj.prototype.removeChild = function(reference) {
			return this.database.ref(reference).remove();
		};

		// Gets Firebase object for one time
		firebaseUtilObj.prototype.getFirebaseObject = function(reference, callback) {
			this.database.ref(reference).once('value', callback);
		};

		// Gets a random online user
		firebaseUtilObj.prototype.getRandomOnlineUser = function(currentUser, callback) {
			this.database.ref('onlineUsers').once('value', function(usersSnap) {
				let allUsers = [];
				let userKeys = [];
				let filterdUsers = [];

				// Collect all user IDs in online users
				usersSnap.forEach(function(snapshot){
					if(currentUser !== snapshot.val()) {
						allUsers.push(snapshot);
					}
				});

				// Filters duplicate user IDs
				allUsers.forEach(function(snapshot){
					if(userKeys.indexOf(snapshot.val() === -1)) {
						userKeys.push(snapshot.val());
						filterdUsers.push(snapshot);
					}
				});

				// Get a random index less than the number of online users
				const randomIndex = Math.round(Math.random() * (filterdUsers.length - 1));
				callback(filterdUsers[randomIndex]);
			});
		};

		return firebaseUtilObj;
	})();
});


