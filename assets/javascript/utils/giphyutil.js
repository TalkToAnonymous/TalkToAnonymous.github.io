//Add giphy API and AJAX method.
$(function () {
	app.giphyUtil = (function () {
		var giphyUtilObj = function () {
		};

		giphyUtilObj.prototype.callGiphyAPI = function(key) {
			var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=FaVXq0SP86FKh8FYOgjpP6OzIcY5wMyg&q=${key}`;
			return $.ajax({
				url: queryURL,
				method: "GET"
			});
		};

		return giphyUtilObj;
	})();
});

