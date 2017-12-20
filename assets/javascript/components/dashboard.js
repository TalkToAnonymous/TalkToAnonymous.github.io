$(function () {
	app.dashboard = (function () {
		var dashboardObj = function (firebaseUtil) {
			this.initialize = this.initialize.bind(this);
			this.show = this.show.bind(this);
			this.hide = this.hide.bind(this);
			this.handleTopicAdd = this.handleTopicAdd.bind(this);
			this.showSaveTopic = this.showSaveTopic.bind(this);
			this.saveTopic = this.saveTopic.bind(this);


			this.dashboardContainer = $('#dashboard-container');
			this.firebaseUtil = firebaseUtil;
		};

		dashboardObj.prototype.initialize = function (user) {
			this.show();
			$('#sign-out').removeClass('is-hidden').unbind('click').click('click', this.firebaseUtil.signOutUser);
			this.firebaseUtil.watchList('topics', this.handleTopicAdd);
			$('#add-topic').unbind('click').on('click', this.showSaveTopic);
		};


		dashboardObj.prototype.show = function (course) {
			this.dashboardContainer.removeClass('is-hidden');
		};

		dashboardObj.prototype.showSaveTopic = function (course) {
			$('#add-topic-modal').modal('show');
			$('#add-topic-form').unbind('submit').on('submit', this.saveTopic);
		};

		dashboardObj.prototype.saveTopic = function (event) {
			event.preventDefault();
			const title = $('#topic-title').val().trim();
			if(!title) {
				return false;
			}

			const topic = {
				title: title
			};

			this.firebaseUtil.pushChild('topics', topic);
			$('#add-topic-modal').modal('hide');
		};

		dashboardObj.prototype.hide = function () {
			this.dashboardContainer.addClass('is-hidden');
		};

		dashboardObj.prototype.handleTopicAdd = function (topicSnapShot) {
			if(topicSnapShot) {
				const topicSnapShotVal = topicSnapShot.val();
				const topic = $('<li>');
				topic.attr({ 'data-key': topicSnapShot.key });
				topic.text(topicSnapShotVal.title);
				$('#topics').append(topic);
				this.firebaseUtil.watchList('topics/' + topicSnapShot.key + '/messages', this.handleMessageAdd);
			}
		};

		dashboardObj.prototype.handleMessageAdd = function (topicSnapShot) {
			if(messageSnapShot) {
				const messageSnapShotVal = messageSnapShot.val();
				const message = $('<li>');
				message.attr({ 'data-key': messageSnapShot.key });
				message.text(messageSnapShot.value);
				$('#messagaes').append(message);
			}
		};

		return dashboardObj;
	})();
});
