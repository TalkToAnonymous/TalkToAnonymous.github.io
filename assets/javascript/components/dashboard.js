$(function () {
	app.dashboard = (function () {
		var dashboardObj = function (firebaseUtil) {
			this.initialize = this.initialize.bind(this);
			this.show = this.show.bind(this);
			this.hide = this.hide.bind(this);
			this.handleTopicAdd = this.handleTopicAdd.bind(this);
			this.showSaveTopic = this.showSaveTopic.bind(this);
			this.saveTopic = this.saveTopic.bind(this);
			this.showMessages = this.showMessages.bind(this);
			this.hideMessages = this.hideMessages.bind(this);
			this.handleTopicClick = this.handleTopicClick.bind(this);
			this.initializeTopic = this.initializeTopic.bind(this);
			this.addMessageToTheConversation = this.addMessageToTheConversation.bind(this);
			this.handleMessageAdd = this.handleMessageAdd.bind(this);
			this.initializeMessageControls = this.initializeMessageControls.bind(this);
			this.addGiphyAsMessage = this.addGiphyAsMessage.bind(this);
			this.addSmileyToMessage = this.addSmileyToMessage.bind(this);

			this.dashboardContainer = $('#dashboard-container');
			this.firebaseUtil = firebaseUtil;
			this.currentTopic = null;
			this.currentUser = null;
			this.giphyModal = new app.giphyModal();
			this.smileyModal = new app.smileyModal();
		};

		dashboardObj.prototype.showMessages = function () {
			$('#message-container').removeClass('is-hidden');
		};

		dashboardObj.prototype.hideMessages = function() {
			$('#message-container').addClass('is-hidden');
		};

		dashboardObj.prototype.initialize = function (user) {
			this.show();
			$('#topics').empty();
			$('#sign-out').removeClass('is-hidden').unbind('click').click('click', this.firebaseUtil.signOutUser);
			this.firebaseUtil.watchList('topics', this.handleTopicAdd);
			$('#add-topic').unbind('click').on('click', this.showSaveTopic);
			this.hideMessages();
			$(document).on('click', '.topic-list-item', this.handleTopicClick);
		};

		dashboardObj.prototype.initializeMessageControls = function() {
			this.showMessages();
			this.giphyModal.initialize(this.addGiphyAsMessage);
			this.smileyModal.initialize(this.addSmileyToMessage);
		};

		dashboardObj.prototype.addGiphyAsMessage = function(imageUrl) {
			if(!imageUrl) {
				return false;
			}

			const messageObj = {
				value: imageUrl,
				sender:  this.currentUser.uid,
				moment: moment.now(),
				isImage: true
			};

			this.firebaseUtil.pushChild('topics/' + this.currentTopic.key + '/messages', messageObj);
		};

		dashboardObj.prototype.addSmileyToMessage = function(smiley) {
			const message = $('#usermsg'),
			messageVal = $('#usermsg').val(),
			caretPos = message[0].selectionStart;
			message.val(messageVal.substring(0, caretPos) + smiley + messageVal.substring(caretPos));
		};

		dashboardObj.prototype.handleTopicClick = function(event) {
				var target = $(event.currentTarget);
				//take this out
				alert(target.attr('data-key'));
				console.log(this);
				//$('#meesage-topic-name').
				var key = target.attr('data-key');
				var topicTitle = target.title;
				console.log(topicTitle);
		};
		
		dashboardObj.prototype.addMessageToTheConversation = function(event){
			event.preventDefault();
			const message = $('#usermsg').val().trim();
			if(!message) {
				return false;
			}

			const messageObj = {
				value: message,
				sender:  this.currentUser.uid,
				moment: moment.now(),
				isImage: false
			};

			this.firebaseUtil.pushChild('topics/' + this.currentTopic.key + '/messages', messageObj);
			$('#usermsg').val('');
		}

		dashboardObj.prototype.initializeTopic = function(topicSnap) {
			if(this.currentTopic) {
				if(this.currentTopic.key === topicSnap.key) {
					return false;
				}

				const messagesRef = 'topics/' + this.currentTopic.key + '/messages';
				this.firebaseUtil.stopWatchingList(messagesRef);
			}

			if(topicSnap) {
				this.initializeMessageControls();
				$('#messages-list').empty();
				this.currentTopic = {
					key: topicSnap.key,
					value: topicSnap.val()
				};
				$("#conversation-name").text(this.currentTopic.value.title);
				const messagesRef = 'topics/' + this.currentTopic.key + '/messages';
				this.firebaseUtil.stopWatchingList(messagesRef);
				this.firebaseUtil.watchList(messagesRef, this.handleMessageAdd);
			}
		}

		dashboardObj.prototype.show = function () {
			this.dashboardContainer.removeClass('is-hidden');
		};

		dashboardObj.prototype.showSaveTopic = function () {
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

			const topicSnapShot = this.firebaseUtil.pushChild('topics', topic);
			this.firebaseUtil.getFirebaseObject('topics/' + topicSnapShot.key, this.initializeTopic);
			$('#topic-title').val('');
			$('#add-topic-modal').modal('hide');
		};

		dashboardObj.prototype.hide = function () {
			this.dashboardContainer.addClass('is-hidden');
		};

		dashboardObj.prototype.handleTopicAdd = function (topicSnapShot) {
			if(topicSnapShot) {
				const topicSnapShotVal = topicSnapShot.val();
				const topic = $('<a href="#" class="list-group-item topic-list-item">');
				topic.attr({ 'data-key': topicSnapShot.key });
				topic.text(topicSnapShotVal.title);
				$('#topics').append(topic);
				this.firebaseUtil.watchList('topics/' + topicSnapShot.key + '/messages', this.handleMessageAdd);
			}
		};

		dashboardObj.prototype.handleMessageAdd = function (topicSnapShot) {
			if(messageSnapShot) {
				const messageSnapShotVal = messageSnapShot.val();
				const messageContainer = $('<li class="clearfix">');
				const message = $('<div>');
				if(messageSnapShotVal.sender === this.currentUser.uid) {
					message.addClass('right-message');
				} else {
					message.addClass('left-message');
				}
				messageContainer.attr({ 'data-key': messageSnapShot.key });

				if(messageSnapShotVal.isImage) {
					const imgElement = $(`<img class="gif-image" src="${messageSnapShotVal.value}" />`);
					message.append(imgElement);
				} else {
					message.text(messageSnapShotVal.value);
				}

				messageContainer.append(message);

				$('#messages-list').append(messageContainer);
			}
		};

		return dashboardObj;
	})();
});
