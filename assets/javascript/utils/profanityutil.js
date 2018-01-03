//Add profanity API and AJAX method.
$(function () {
	app.profanityUtil = (function () {
		var profanityUtilObj = function () {
		};

		profanityUtilObj.prototype.callProfanityAPI = function(message, callback) {
			var queryURL = 'http://www.purgomalum.com/service/json?text=' + message;
			return $.ajax({
				url: queryURL,
				crossDomain: true,
   				dataType: 'jsonp',
   				type: 'GET',
   				success: callback
			});
		};

		return profanityUtilObj;
	})();
});

