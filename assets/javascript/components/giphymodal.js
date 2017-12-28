$(function () {
	app.giphyModal = (function () {
		var giphyModalObj = function () {
			this.callGiphyAPI = this.callGiphyAPI.bind(this);
			this.giphyUtil = new app.giphyUtil();
			this.displayGifs = this.displayGifs.bind(this);
			this.displayErrors = this.displayErrors.bind(this);
			this.handleUserMessageTemplate = this.handleUserMessageTemplate.bind(this);
			this.handlePopoverShow = this.handlePopoverShow.bind(this);
			this.isSearching = false;
			this.clearUserMessagae = false;
		};

		giphyModalObj.prototype.initialize = function(callBack) {
			$('#add-giphy').popover();
			$('#usermsg').unbind('keyup').on('keyup', this.handleUserMessageTemplate);
			$('#add-giphy').on('shown.bs.popover', this.handlePopoverShow);
			const self = this;
			$(document).unbind('click').on('click', '.js-giphy-item', function(event) {
				event.preventDefault();
				const target = $(event.currentTarget);
				callBack(target.attr('data-image-url'));
				$('#add-giphy').popover('hide');
				if (self.clearUserMessagae) {
					$('#usermsg').val('');
					self.clearUserMessagae = false;
				}
			});
		}

		giphyModalObj.prototype.handlePopoverShow = function() {
			$('#giphy-key')
			.val('')
			.unbind('keyup').on('keyup', this.callGiphyAPI);
			if (!this.clearUserMessagae) {
				this.updateMessage('You do not have GIFs to send !!');
			}
		}

		giphyModalObj.prototype.handleUserMessageTemplate = function(event) {
			const target = $(event.currentTarget);
			const searchKey = target.val().trim();
			if(searchKey.indexOf('giphy/') === 0) {
				this.clearUserMessagae = true;
				if(!$('.popover:visible').length) {
					$('#add-giphy').popover('show');
				}
				this.callGiphyAPIInternal(searchKey.substr(6).trim());
			}
		}

		giphyModalObj.prototype.updateMessage = function(message) {
			let listElement = $(`<li class="list-group-item giphy-item"><span class="label label-info">${message}</span></li>`);
			$('#giphy-list').empty().append(listElement);
		}

		giphyModalObj.prototype.callGiphyAPI = function(event) {
			const target = $(event.currentTarget);
			this.clearUserMessagae = false;
			const searchKey = target.val().trim();
			this.callGiphyAPIInternal(searchKey);
		}

		giphyModalObj.prototype.callGiphyAPIInternal = function(searchKey) {
			if(searchKey.length > 2) {
				if(!this.isSearching) {
					this.isSearching = true;
					this.giphyUtil.callGiphyAPI(searchKey)
					.done(this.displayGifs)
					.fail(this.displayErrors);
				}
			} else {
				$('.carousel-indicators').empty();
				$('.carousel-inner').empty();
				$('#giphy-carousel').addClass('is-hidden');
				this.updateMessage('Keep typing !!');
			}
		}

		giphyModalObj.prototype.displayGifs = function(response) {
			const giphyCarousel = $('.carousel-indicators').empty();
			giphyCarouselInner = $('.carousel-inner').empty();
			$('#giphy-list').empty();
			if(response && response.data && response.data.length) {
				$('#giphy-carousel').removeClass('is-hidden');
				response.data.forEach(function(result, index){
					const imageUrl = result.images.fixed_width.url,
					giphyCarouselIndicator = $(`<li data-target="#giphy-carousel" data-slide-to="${index}"></li>`);
					giphyCarousel.append(giphyCarouselIndicator);

					const imageCont = $('<div class="item">'),
					imgElement = $(`<img class="gif-image js-giphy-item" src="${imageUrl}" alt="Image ${index}" data-image-url=${imageUrl} />`);
					if(index === 0) {
						giphyCarouselIndicator.addClass('active');
						imageCont.addClass('active');
					}
					imageCont.append(imgElement);
					giphyCarouselInner.append(imageCont);
				});

				$('.carousel').carousel();
				this.isSearching = false;
				return;
			}

			this.isSearching = false;
			$('#giphy-carousel').addClass('is-hidden');
			this.updateMessage('There are no GIFs for your Search !!');
		}

		giphyModalObj.prototype.displayErrors = function() {
			this.updateMessage('You broke the Giphy API with your search !!');
		}

		return giphyModalObj;
	})();
});
