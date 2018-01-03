// Create landing page class
$(function () {
	app.landingPage = (function () {
		// Landing page constructor
		let landingPageObj = function() {
			// Binding methods of class to the landing page object
			this.goToDashboard = this.goToDashboard.bind(this);
			this.goToSignIn = this.goToSignIn.bind(this);
			this.goToSignUp = this.goToSignUp.bind(this);
			this.initialize = this.initialize.bind(this);	

			// Creating and initializing different components
			this.validator = new app.validator();
			this.firebaseUtil = new app.firebaseUtil();
			this.signUp = new app.signUp(this.validator, this.firebaseUtil, this.goToSignIn);
			this.signIn = new app.signIn(this.firebaseUtil, this.goToSignUp);
			this.dashboard = new app.dashboard(this.firebaseUtil);					
		}

		// Show user's dashboard, hide signin and signup once user has signed up, and signed in. Hide messages, show comic strip.
		landingPageObj.prototype.goToDashboard = function(user) {
			this.dashboard.initialize(user);
			this.signIn.hide();
			this.signUp.hide();
			$('body').addClass('body--dashboard')
			.removeClass('body--sign-in');
			this.dashboard.hideMessages();
			$('#toggle-columns').removeClass('is-hidden');
		};

		// Hide dashboard, show sign in, hide sign up.
		landingPageObj.prototype.goToSignIn = function() {
			this.dashboard.hide();
			this.signIn.initialize();
			this.signUp.hide();
			$('body').removeClass('body--dashboard')
			.addClass('body--sign-in');
			$('#toggle-columns').addClass('is-hidden');
		}

		// Show signup, hide dashboard and signin.
		landingPageObj.prototype.goToSignUp = function() {
			this.dashboard.hide();
			this.signIn.hide();
			this.signUp.initialize();
			$('body').removeClass('body--dashboard')
			.addClass('body--sign-in');
		}

		// If user is signed in, show topics and initial message container with comic strip.
		// Else, hide topics and initial message container.
		landingPageObj.prototype.initialize = function() {
			this.firebaseUtil.initialize(this.goToSignIn, this.goToDashboard);
			$(document).unbind('click', '#toggle-columns').on('click', '#toggle-columns', function(event) {
				const target = $(event.currentTarget);
				if(target.attr('data-toggle') === 'message') {
					// Toggle button when user is in mobile mode
					$('#topics-container')
					.removeClass('hidden-sm')
					.removeClass('hidden-xs');
					$('#message-container')
					.addClass('hidden-sm')
					.addClass('hidden-xs');
					$('#message-container-initial')
					.addClass('hidden-sm')
					.addClass('hidden-xs');
					target.find('.glyphicon-share-alt').addClass('flip');
					target.find('.button-text').text('Check Messages!!');
					target.attr('data-toggle', 'topic');
				} else {
					$('#topics-container')
					.addClass('hidden-sm')
					.addClass('hidden-xs');
					$('#message-container')
					.removeClass('hidden-sm')
					.removeClass('hidden-xs');
					$('#message-container-initial')
					.removeClass('hidden-sm')
					.removeClass('hidden-xs');
					target.find('.glyphicon-share-alt').removeClass('flip');
					target.find('.button-text').text('Check Topics!!');
					target.attr('data-toggle', 'message');
					$('#usermsg').focus();
				}
			});
			// Close giphy and smiley popover when user clicks on any part of the document
			$('body').on('click', function (e) {
				$('[data-toggle="popover"]').each(function () {
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			});
		}

		return landingPageObj;
	})();
});
