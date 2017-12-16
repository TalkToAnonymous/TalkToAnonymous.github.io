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

$('#go-to-sign-up').on('click', function(event) {
	event.preventDefault();
	$('#sign-in-container').addClass('is-hidden');
	$('#sign-up-container').removeClass('is-hidden');
});

$('#cancel').on('click', function(event){
	event.preventDefault();
	$('#sign-in-container').removeClass('is-hidden');
	$('#sign-up-container').addClass('is-hidden');
});

$('#sign-up-form').on('submit', function(event) {
	const email = $('#sign-up-email').val().trim();
	const password = $('#sign-up-password').val().trim();
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// TODO handle erros
		debugger;
	});
	event.preventDefault();
});
