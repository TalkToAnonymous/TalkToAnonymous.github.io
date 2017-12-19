(function() {
	validator = function() {
		this.emailRegEx = /[A-Za-z0-9!#$%&'*+-/=?^_`{|}~]+@[A-Za-z0-9-]+(\.[A-Za-z0-9]{2,})/;
		this.passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
	}

	validator.prototype.validateEmail = function(email) {
		return this.emailRegEx.test(email);
	}

	validator.prototype.validatePassword = function(password) {
		return this.passwordRegEx.test(password);
	}

	validator.prototype.validateAreEqual = function(leftSide, rightSide) {
		return leftSide === rightSide;
	};
})();
