$(function () {
	app.validator = (function () {
		var validatorObj = function () {
			this.emailRegEx = /[A-Za-z0-9!#$%&*+-/=?^_{|}~]+@[A-Za-z0-9-]+(.[A-Za-z0-9-]+)*/;
			this.passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
		};

		validatorObj.prototype.validateEmail = function(email) {
			return this.emailRegEx.test(email);
		};

		validatorObj.prototype.validatePassword = function(password) {
			return this.passwordRegEx.test(password);
		};

		validatorObj.prototype.validateAreEqual = function(leftSide, rightSide) {
			return leftSide === rightSide;
		};

		return validatorObj;
	})();
});
