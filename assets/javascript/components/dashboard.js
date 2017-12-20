$(function () {
	app.dashboard = (function () {
		var dashboardObj = function (firebaseUtil) {
			this.initialize = this.initialize.bind(this);
			this.show = this.show.bind(this);
			this.hide = this.hide.bind(this);

			this.dashboardContainer = $('#dashboard-container');
			this.firebaseUtil = firebaseUtil;
		};

		dashboardObj.prototype.initialize = function (user) {
			this.show();
			this.dashboardContainer.text('Welcome ' + user.email + ' This page is under Construction');
		};

		dashboardObj.prototype.show = function (course) {
			this.dashboardContainer.removeClass('is-hidden');
		};

		dashboardObj.prototype.hide = function () {
			this.dashboardContainer.addClass('is-hidden');
		};

		return dashboardObj;
	})();
});