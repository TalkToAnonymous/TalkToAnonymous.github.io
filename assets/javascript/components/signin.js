$(function () {
	app.signIn = (function () {
		var signInObj = function (firebaseUtil, goToSignUp) {
			this.initialize = this.initialize.bind(this);
			this.show = this.show.bind(this);
			this.hide = this.hide.bind(this);
			this.showSignUpErrors = this.showSignUpErrors.bind(this);
			this.hideSignUpErrors = this.hideSignUpErrors.bind(this);
			this.signInUser = this.signInUser.bind(this);
			this.showSignUp = this.showSignUp.bind(this);
			

			this.signInContainer = $('#sign-in-container');
			this.errorContainer = $('#sign-in-error-message-container');
			this.password = $('#password');
			this.email = $('#email');
			this.errorMessage = $('#sign-in-error-message');
			this.firebaseUtil = firebaseUtil;
			this.goToSignUp = goToSignUp;
		};

		signInObj.prototype.initialize = function () {
			this.show();
			$('#sign-in-form').unbind('submit').on('submit', this.signInUser);
			$('#go-to-sign-up').on('click', this.showSignUp);
		};

		signInObj.prototype.showSignUp = function(event) {
			event.preventDefault();
			this.goToSignUp();
		}

		signInObj.prototype.show = function (course) {
			this.signInContainer.removeClass('is-hidden');
		};

		signInObj.prototype.hide = function () {
			this.signInContainer.addClass('is-hidden');
		};

		signInObj.prototype.showSignUpErrors = function(error) {
			this.errorContainer.removeClass('is-hidden');
			this.errorMessage.html(error.message);
		};

		signInObj.prototype.hideSignUpErrors = function() {
			this.errorContainer.addClass('is-hidden');
		};

		signInObj.prototype.signInUser = function(event) {
			event.preventDefault();
			this.hideSignUpErrors();
			this.errorMessage.text('');
			const email = this.email.val().trim();
			const password = this.password.val().trim();
			this.firebaseUtil.signInUser(email, password, this.showSignUpErrors);
		};

		return signInObj;
	})();
});