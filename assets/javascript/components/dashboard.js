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
			this.users = [];
			this.colors = {};
		};

		dashboardObj.prototype.showMessages = function () {
			$('#message-container').removeClass('is-hidden');
			$('#message-container-initial').addClass('is-hidden');
			$('#usermsg').focus();
		};


		dashboardObj.prototype.getRandomColor = function() {
			let r = 0, g = 0, b = 0;
			r = Math.floor(Math.random() * 180);
			g = Math.floor(Math.random() * 180);
			b = Math.floor(Math.random() * 180);

			return `rgba(${r}, ${g}, ${b}, 0.6)`;
		};

		dashboardObj.prototype.hideMessages = function() {
			$('#message-container').addClass('is-hidden');
			$('#message-container-initial').removeClass('is-hidden');
		};

		dashboardObj.prototype.initialize = function (user) {
			this.show();
			$('#topics').empty();
			$('#messages-list').empty();
			this.currentUser = user;
			this.currentUser.messageColor = this.getRandomColor();
			$('#sign-out').removeClass('is-hidden').unbind('click').click('click', this.firebaseUtil.signOutUser);
			this.firebaseUtil.stopWatchingList('topics');
			this.firebaseUtil.watchList('topics', this.handleTopicAdd)
			$('#add-topic').unbind('click').on('click', this.showSaveTopic);
			$('#start-private').unbind('click').on('click', this.showSaveTopic);
			this.hideMessages();
			$(document).unbind('click', '.topic-list-item').on('click', '.topic-list-item', this.handleTopicClick);
			$('#message-form').unbind('submit').on('submit', this.addMessageToTheConversation);
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
			const target = $(event.currentTarget);
			$('.list-group-item').removeClass('active');
			target.addClass('active');
			const key = target.attr('data-key');
			this.firebaseUtil.getFirebaseObject('topics/' + key, this.initializeTopic);
			$('#topics-container')
			.addClass('hidden-sm')
			.addClass('hidden-xs');
			$('#message-container')
			.removeClass('hidden-sm')
			.removeClass('hidden-xs');
			$('#message-container-initial')
			.removeClass('hidden-sm')
			.removeClass('hidden-xs');
			$('#toggle-columns').find('.glyphicon-share-alt').removeClass('flip');
			$('#toggle-columns').attr('data-toggle', 'message');
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

				const badge = $('a[data-key="'+ this.currentTopic.key +'"] .badge');
				badge.text(0);

				$("#conversation-name").text(this.currentTopic.value.title);
				const messagesRef = 'topics/' + this.currentTopic.key + '/messages';
				this.firebaseUtil.stopWatchingList(messagesRef);
				this.firebaseUtil.watchList(messagesRef, this.handleMessageAdd);
				setTimeout(function() {
					$('.panel-body').scrollTop($('#messages-list').height());
				}, 1000);
			}
		}

		dashboardObj.prototype.show = function () {
			this.dashboardContainer.removeClass('is-hidden');
		};

		dashboardObj.prototype.showSaveTopic = function (event) {
			const target = $(event.currentTarget);
			const topicForm = $('#add-topic-form');
			const modalTitle = $('#add-topic-modal .modal-title');
			if(target.attr('data-privacy') === 'true') {
				topicForm.attr('data-privacy', 'true');
				modalTitle.text('Add Topic to start a Private Conversation');
			} else {
				topicForm.attr('data-privacy', 'false');
				modalTitle.text('Add Topic to start a Public Conversation');
			}

			$('#add-topic-modal').modal('show');
			setTimeout(function() {
				$('#topic-title').focus();
			}, 500);
			topicForm.unbind('submit').on('submit', this.saveTopic);
		};

		dashboardObj.prototype.saveTopic = function (event) {
			event.preventDefault();
			const title = $('#topic-title').val().trim();
			if(!title) {
				return false;
			}
			const isPrivate = $(event.target).attr('data-privacy') === 'true' ? true : false;

			if(isPrivate) {
				this.pushRandomUserToTopic(title, isPrivate);
			} else {
				this.pushTopic(title, isPrivate, [this.currentUser.uid]);
			}
		};

		dashboardObj.prototype.pushRandomUserToTopic = function(title, isPrivate) {
			this.firebaseUtil.getRandomOnlineUser(this.currentUser.uid, function(anonymousUser) {
				let users = [this.currentUser.uid]
				if(anonymousUser) {
					users.push(anonymousUser.val());
				}

				this.pushTopic(title, isPrivate, users);
			}.bind(this));
		};

		dashboardObj.prototype.pushTopic = function(title, isPrivate, users) {
			const topic = {
				title: title,
				isPrivate: isPrivate,
				users: users
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
				let canShowTopic = true;

				if(topicSnapShotVal.isPrivate && topicSnapShotVal.users.indexOf(this.currentUser.uid) === -1) {
					canShowTopic = false;
				}

				if(canShowTopic) {
					const topic = $('<a href="#" class="list-group-item topic-list-item">');
					topic.attr({ 'data-key': topicSnapShot.key });
					let icon;

					if(topicSnapShotVal.isPrivate) {
						icon = $('<i class="fa fa-user-secret margin-right-5" aria-hidden="true"></i>');
					} else {
						icon = $('<i class="fa fa-globe margin-right-5" aria-hidden="true"></i>');
					}

					const badge = $('<span class="badge">');
					const topicTitle = $(' <span>');

					topic.append(icon);
					topicTitle.text(topicSnapShotVal.title);
					if(topicSnapShotVal.messages) {
						badge.text(Object.keys(topicSnapShotVal.messages).length);
					} else {
						badge.text(0);
					}

					topic.append(topicTitle);
					topic.append(badge);


					$('#topics').append(topic);
				}
			}
		};

		dashboardObj.prototype.handleMessageAdd = function (messageSnapShot) {
			if(messageSnapShot) {
				const messageSnapShotVal = messageSnapShot.val();
				const messageAddTime = messageSnapShotVal.moment;
				const messageContainer = $('<li class="clearfix">');
				const message = $('<div>');
				if(messageSnapShotVal.sender === this.currentUser.uid) {
					message.addClass('right-message');
					message.addClass('right-message').css({'background-color': this.currentUser.messageColor});
				} else {
					if(this.users.indexOf(messageSnapShotVal.sender) === -1) {
						this.users.push(messageSnapShotVal.sender);
						this.colors[messageSnapShotVal.sender] = this.getRandomColor();;
					}

					message.addClass('left-message').css({'background-color': this.colors[messageSnapShotVal.sender]});
				}
				messageContainer.attr({ 'data-key': messageSnapShot.key });

				const badge = $('a[data-key="'+ this.currentTopic.key +'"] .badge');
				let numMessages = parseInt(badge.text());
				numMessages++;
				badge.text(numMessages);

				if(messageSnapShotVal.isImage) {
					const imgElement = $(`<img class="gif-image" src="${messageSnapShotVal.value}" />`);
					message.append(imgElement);
				} else {
					const messageText = $('<div>');
					messageText.text(messageSnapShotVal.value);
					message.append(messageText);
				}

				const timeStamp = $('<div class="timestamp">');
				timeStamp.text(moment(messageSnapShotVal.moment).fromNow());
				
				if(messageSnapShotVal.sender === this.currentUser.uid) {
					timeStamp.append('<span class="glyphicon glyphicon-time"></span>');
				} else {
					timeStamp.prepend('<span class="glyphicon glyphicon-time"></span>');
				}

				message.append(timeStamp);
				messageContainer.append(message);

				$('#messages-list').append(messageContainer);	
				$('.panel-body').scrollTop($('#messages-list').height());			
			}
		};

		return dashboardObj;
	})();
});
