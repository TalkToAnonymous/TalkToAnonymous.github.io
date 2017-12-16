(function(){
	const config = {
		apiKey: "AIzaSyC5YSojC81RtawxiAC0CaO9m9h1JuDwBtI",
		authDomain: "talktoanonymous-d65df.firebaseapp.com",
		databaseURL: "https://talktoanonymous-d65df.firebaseio.com",
		projectId: "talktoanonymous-d65df",
		storageBucket: "",
		messagingSenderId: "709944500981"
	};
	firebase.initializeApp(config);

	const validate = new validator();

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
		event.preventDefault();

		const email = $('#sign-up-email').val().trim();
		const password = $('#sign-up-password').val().trim();
		const confirmPassword = $('#confirm-password').val().trim();
		$(this).find('.form-control').removeClass('form-control--invalid');

		let valid = true;

		if(!validate.validateEmail(email)) {
			valid = false;
			$('#sign-up-email').addClass('form-control--invalid');
		}

		if(!validate.validatePassword(password)) {
			valid = false;
			$('#sign-up-password').addClass('form-control--invalid');
		}

		if(!validate.validateAreEqual(password, confirmPassword)) {
			valid = false;
			$('#sign-up-password').addClass('form-control--invalid');
			$('#confirm-password').addClass('form-control--invalid');
		}

		if(!valid) {
			return false;
		}

		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// TODO handle erros
			debugger;
		});
	});
})();
