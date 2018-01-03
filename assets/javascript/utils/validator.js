// Declare class to validate form.
$(function () {
	app.validator = (function () {
		var validatorObj = function () {
			// Regular expression for email
			this.emailRegEx = /[A-Za-z0-9!#$%&*+-/=?^_{|}~]+@[A-Za-z0-9-]+(\.[A-Za-z0-9]{2,})/;
			// Regular expression for password
			this.passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
		};

		// To validate email format
		validatorObj.prototype.validateEmail = function(email) {
			return this.emailRegEx.test(email);
		};

		// To validate password format
		validatorObj.prototype.validatePassword = function(password) {
			return this.passwordRegEx.test(password);
		};

		// To validate whether password and confirm password are equal
		validatorObj.prototype.validateAreEqual = function(leftSide, rightSide) {
			return leftSide === rightSide;
		};

		return validatorObj;
	})();
});

