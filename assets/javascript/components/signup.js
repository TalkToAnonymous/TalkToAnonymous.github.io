//Create sign up object, add functions to object.
$(function () {
	app.signUp = (function () {
		var signUpObj = function (validatorUtil, firebaseUtil, goToSignIn) {
			this.initialize = this.initialize.bind(this);
			this.show = this.show.bind(this);
			this.hide = this.hide.bind(this);
			this.showSignUpErrors = this.showSignUpErrors.bind(this);
			this.hideSignUpErrors = this.hideSignUpErrors.bind(this);
			this.createUser = this.createUser.bind(this);
			this.showSignIn = this.showSignIn.bind(this);

			this.signUpContainer = $('#sign-up-container');
			this.errorContainer = $('#sign-up-error-message-container');
			this.password = $('#sign-up-password');
			this.confirmPassword = $('#confirm-password');
			this.email = $('#sign-up-email');
			this.errorMessage = $('#sign-up-error-message');
			this.validatorUtil = validatorUtil;
			this.firebaseUtil = firebaseUtil;
			this.goToSignIn = goToSignIn;
		};

		//Show sign up page when sign up button is clicked.
		//Hide sign up page when cancel button is clicked.
		signUpObj.prototype.initialize = function (dashboardViewModel) {
			this.show();
			$('#sign-up-form').unbind('submit').on('submit', this.createUser);
			$('#cancel').on('click', this.showSignIn);
		};

		//Show sign in page
		signUpObj.prototype.showSignIn = function(event) {
			event.preventDefault();
			this.goToSignIn();
		}

		//Remove is hidden class from sign up container to show container.
		signUpObj.prototype.show = function (course) {
			this.signUpContainer.removeClass('is-hidden');
		};

		//Add is hidden clas to sign up container to hide container.
		signUpObj.prototype.hide = function () {
			this.signUpContainer.addClass('is-hidden');
		};

		//Remove is hidden class from error container to display sign up errors.
		signUpObj.prototype.showSignUpErrors = function(error) {
			this.errorContainer.removeClass('is-hidden');
			this.errorMessage.html(error.message);
		};

		//Add is hidden class from error container to hide sign up errors.
		signUpObj.prototype.hideSignUpErrors = function() {
			this.errorContainer.addClass('is-hidden');
		};

		//Create create user function.
		//Hide sign up errors and popover.
		signUpObj.prototype.createUser = function(event) {
			event.preventDefault();
			this.hideSignUpErrors();
			$('[data-toggle="popover"]').addClass('is-hidden');
			this.errorMessage.text('');
			const email = this.email.val().trim();
			const password = this.password.val().trim();
			const confirmPassword = this.confirmPassword.val().trim();
			let message = '';
			$(event.target).find('.form-control').removeClass('form-control--invalid');

			let valid = true;

			//Call validator.js to validate email input.
			//If email addreess is invalid add form control invalid class and display error message
			if(!this.validatorUtil.validateEmail(email)) {
				valid = false;
				this.email.addClass('form-control--invalid');
				message = 'Invalid email format !!';
			}

			//If password is invalid add form control invalid class and display error message
			if(valid && !this.validatorUtil.validatePassword(password)) {
				valid = false;
				this.password.addClass('form-control--invalid');
				message = 'Invalid password format !!';
				$('[data-toggle="popover"]').removeClass('is-hidden').popover();
			}

			//If passwords do not match add form control invalid class and display error message
			if(valid && !this.validatorUtil.validateAreEqual(password, confirmPassword)) {
				valid = false;
				this.password.addClass('form-control--invalid');
				this.confirmPassword.addClass('form-control--invalid');
				message = 'Passwords did not match';
			}

			//If anything is invalid display messages.
			if(!valid) {
				this.showSignUpErrors({ message: message });
				return false;
			}

			this.firebaseUtil.createUser(email, password, this.showSignUpErrors);
		};

		return signUpObj;
	})();
});
