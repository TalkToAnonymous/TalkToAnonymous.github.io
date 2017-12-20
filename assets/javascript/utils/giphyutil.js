$(function () {
	app.giphyUtil = (function () {
		var giphyUtilObj = function () {
		};

		giphyUtilObj.prototype.callGiphyAPI = function(email) {
			var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=FaVXq0SP86FKh8FYOgjpP6OzIcY5wMyg&limit=12&q=${character}`;
			$.ajax({
				url: queryURL,
				method: "GET"
			}).done(function(response) {
				// TODO - integrate with our requirements. Display function is not defined.
				displayGifs(response);
			}).fail(function(){
				// TODO - integrate with our requirements. Display function is not defined.
				displayErrors();
			});
		};

		return giphyUtilObj;
	})();
});

