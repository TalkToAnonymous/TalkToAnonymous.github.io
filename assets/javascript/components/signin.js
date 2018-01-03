// Create sign in object, add functions to object.
$(function () {
	app.signIn = (function () {
		var signInObj = function (firebaseUtil, goToSignUp) {
			this.initialize = this.initialize.bind(this);
			this.show = this.show.bind(this);
			this.hide = this.hide.bind(this);
			this.showSignUpErrors = this.showSignUpErrors.bind(this);
			this.hideSignUpErrors = this.hideSignUpErrors.bind(this);
			this.forgotPassword = this.forgotPassword.bind(this);
			this.signInUser = this.signInUser.bind(this);
			this.showSignUp = this.showSignUp.bind(this);
			this.successResetPassword = this.successResetPassword.bind(this);
			

			this.signInContainer = $('#sign-in-container');
			this.errorContainer = $('#sign-in-error-message-container');
			this.password = $('#password');
			this.email = $('#email');
			this.errorMessage = $('#sign-in-error-message');
			this.firebaseUtil = firebaseUtil;
			this.goToSignUp = goToSignUp;
		};

		// Initialize sign in page.
		// Hide sign out button.
		// Go to sign up page when sign up button is clicked.
		signInObj.prototype.initialize = function () {
			this.show();
			$('#sign-out').addClass('is-hidden');
			$('#sign-in-form').unbind('submit').on('submit', this.signInUser);
			$('#forgot-password').unbind('click').on('click', this.forgotPassword);
			$('#go-to-sign-up').on('click', this.showSignUp);
		};

		// Show signup page when #go-to-sign-up is clicked.
		signInObj.prototype.showSignUp = function(event) {
			event.preventDefault();
			this.goToSignUp();
		}

		// Show sign in container
		signInObj.prototype.show = function (course) {
			this.signInContainer.removeClass('is-hidden');
		};

		// Hide sign in container
		signInObj.prototype.hide = function () {
			this.signInContainer.addClass('is-hidden');
		};

		// Show error message for sign up errors
		signInObj.prototype.showSignUpErrors = function(error) {
			if(error) {
				this.errorMessage.text(error.message);
				this.errorContainer.removeClass('is-hidden').addClass('alert-danger').removeClass('alert-info');
			}
		};

		// Update message when reset password is successful
		signInObj.prototype.successResetPassword = function(error) {
			this.errorMessage.text('Password reset email has been sent !!');
			this.errorContainer.removeClass('is-hidden').removeClass('alert-danger').addClass('alert-info');
		};

		// Hide sign up errors
		signInObj.prototype.hideSignUpErrors = function() {
			this.errorContainer.addClass('is-hidden');
		};

		// Send login info to firebase. If info is invalid show error message.
		signInObj.prototype.signInUser = function(event) {
			event.preventDefault();
			this.hideSignUpErrors();
			this.errorMessage.text('');
			const email = this.email.val().trim();
			const password = this.password.val().trim();
			this.firebaseUtil.signInUser(email, password, this.showSignUpErrors);
		};

		// Call Firebase reset password API
		signInObj.prototype.forgotPassword = function(event) {
			event.preventDefault();
			this.hideSignUpErrors();
			this.errorMessage.text('');
			const email = this.email.val().trim();
			this.firebaseUtil.resetPassword(email, this.successResetPassword, this.showSignUpErrors);
		};

		return signInObj;
	})();
});
