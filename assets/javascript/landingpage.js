$(function () {
	app.landingPage = (function () {
		let landingPageObj = function() {
			this.goToDashboard = this.goToDashboard.bind(this);
			this.goToSignIn = this.goToSignIn.bind(this);
			this.goToSignUp = this.goToSignUp.bind(this);
			this.initialize = this.initialize.bind(this);	

			this.validator = new app.validator();
			this.firebaseUtil = new app.firebaseUtil();
			this.signUp = new app.signUp(this.validator, this.firebaseUtil, this.goToSignIn);
			this.signIn = new app.signIn(this.firebaseUtil, this.goToSignUp);
			this.dashboard = new app.dashboard(this.firebaseUtil);					
		}

		landingPageObj.prototype.goToDashboard = function(user) {
			this.dashboard.initialize(user);
			this.signIn.hide();
			this.signUp.hide();
			$('body').addClass('body--dashboard')
			.removeClass('body--sign-in');
		};

		landingPageObj.prototype.goToSignIn = function() {
			this.dashboard.hide();
			this.signIn.initialize();
			this.signUp.hide();
			$('body').removeClass('body--dashboard')
			.addClass('body--sign-in');
		}

		landingPageObj.prototype.goToSignUp = function() {
			this.dashboard.hide();
			this.signIn.hide();
			this.signUp.initialize();
			$('body').removeClass('body--dashboard')
			.addClass('body--sign-in');
		}

		landingPageObj.prototype.initialize = function() {
			this.firebaseUtil.initialize(this.goToSignIn, this.goToDashboard);
		}

		return landingPageObj;
	})();
});
