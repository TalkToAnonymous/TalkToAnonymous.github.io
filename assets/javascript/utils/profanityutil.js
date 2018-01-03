//Add profanity API and AJAX method.
$(function () {
	app.profanityUtil = (function () {
		var profanityUtilObj = function () {
		};

		profanityUtilObj.prototype.callProfanityAPI = function(message, method) {
			var queryURL = 'https://apis.paralleldots.com/v2/' + method + '?text='+ message +'&api_key=EZfFBEfCXjAxeqYooddQ5yGjkh1IzOrBc5XvQJ6Hfuw';
			return $.ajax({
				url: queryURL,
   				type: 'POST'
			});
		};

		return profanityUtilObj;
	})();
});

