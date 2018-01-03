// Declare a class to show smileys and handle user actions
$(function () {
	app.smileyModal = (function () {
		var smileyModalObj = function () {
			this.handleUserMessageTemplate = this.handleUserMessageTemplate.bind(this);
			this.filterSmiley = this.filterSmiley.bind(this);
			this.handlePopoverShow = this.handlePopoverShow.bind(this);
			this.updateMessage = this.updateMessage.bind(this);
			this.initializeInternal = this.initializeInternal.bind(this);
			this.handleSearch = this.handleSearch.bind(this);
			this.displaySmiley = this.displaySmiley.bind(this);
			this.smilies = {};
			this.isSearching = false;
			self.clearInput = false;
		};

		// Get list of smileys from Firebase storage
		// Add event listeners to the smileys
		smileyModalObj.prototype.initialize = function(callBack) {
			$.getJSON("https://firebasestorage.googleapis.com/v0/b/talktoanonymous-d65df.appspot.com/o/smiley.json?alt=media&token=017da454-7313-4944-bb7f-696c3ef697a0")
			.done(this.initializeInternal)
			.fail(this.updateMessage);
			const self = this;
			$(document).off('click', '.js-smiley-item');
			$(document).on('click', '.js-smiley-item', function(event) {
				event.preventDefault();
				const target = $(event.currentTarget);
				if(self.clearInput) {
					$('#usermsg').val('');
				}
				// Call function to add smiley to message
				callBack(target.attr('data-unicode'));
			});
		}

		// Initialize popover to add smiley button
		smileyModalObj.prototype.initializeInternal = function(smilies) {
			$('#add-smiley').popover();
			$('#usermsg').on('keyup', this.handleUserMessageTemplate);
			$('#add-smiley').on('shown.bs.popover', this.handlePopoverShow);
			delete smilies.WHITE_SMILING_FACE;
			this.smilies = smilies;
		}

		// Update message if smiley is not able to be located in Firebase storage
		smileyModalObj.prototype.updateMessage = function(message) {
			if(typeof message !== 'string') {
				message = 'Our smilies are broken !!';
			}

			let listElement = $(`<li class="list-group-item smiley-item"><span class="label label-info">${message}</span></li>`);
			$('#smiley-list').empty().append(listElement);
		}

		// When user types smile/ open smiley modal
		// Start searching through smileys
		smileyModalObj.prototype.handleUserMessageTemplate = function(event) {
			const target = $(event.currentTarget);
			const searchKey = target.val().trim();
			if(searchKey.toLowerCase().indexOf('smile/') === 0) {
				this.clearInput = true;
				if(!$('.popover:visible').length) {
					$('#add-smiley').popover('show');
				}

				this.filterSmiley(searchKey.substr(6).trim());
			}
		}

		// Filter smileys based on user input
		smileyModalObj.prototype.filterSmiley = function(searchKey) {
			if(searchKey && searchKey.length > 2) {
				if (!this.isSearching) {
					this.isSearching = true;
					const filteredSmiley = {};

					let self = this;

					let keys = Object.keys(this.smilies).map(function(smileKey) {
						return { search: smileKey.toLowerCase().replace(/_/ig, ' '), key: smileKey }
					});

					keys = keys.filter(function(term) {
						return term.search.indexOf(searchKey.toLowerCase()) !== -1;
					});

					keys.forEach(function(term) {
						filteredSmiley[term.key] = self.smilies[term.key];
					});

					this.displaySmiley(filteredSmiley);
					return;
				}
			} else {
				this.displaySmiley(this.smilies);
			}
		}

		// Handle smiley search
		smileyModalObj.prototype.handleSearch = function(event) {
			const target = $(event.currentTarget);
			this.clearInput = false;
			this.filterSmiley(target.val().trim());
		}

		// Show smileys popover
		smileyModalObj.prototype.handlePopoverShow = function() {
			$('#smiley-key')
			.val('')
			.unbind('keyup').on('keyup', this.handleSearch);
			this.isSearching = false;
			this.displaySmiley(this.smilies);
		}

		// Builds list of smileys in smiley modal
		smileyModalObj.prototype.displaySmiley = function(smilies) {
			const keys = Object.keys(smilies);
			const smileyList = $('#smiley-list').empty();
			keys.forEach(function(smile, index){
				const unicode = smilies[smile];
				const listElement = $(`<li class="list-group-item smiley-item js-smiley-item" data-unicode="${unicode}">${unicode}</li>`)
				smileyList.append(listElement)
			});
			this.isSearching = false;
		}
		
		return smileyModalObj;
	})();
});
