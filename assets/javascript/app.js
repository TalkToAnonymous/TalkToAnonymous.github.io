var config = {
	apiKey: "AIzaSyC5YSojC81RtawxiAC0CaO9m9h1JuDwBtI",
	authDomain: "talktoanonymous-d65df.firebaseapp.com",
	databaseURL: "https://talktoanonymous-d65df.firebaseio.com",
	projectId: "talktoanonymous-d65df",
	storageBucket: "",
	messagingSenderId: "709944500981"
};
firebase.initializeApp(config);



function callGiphyAPI(character) {
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
}
