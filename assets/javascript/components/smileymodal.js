$(function () {
	app.smileyModal = (function () {
		var smileyModalObj = function () {
		};

		smileyModalObj.prototype.initialize = function() {
			$('[data-toggle="popover"]').popover();
		}
		
		return smileyModalObj;
	})();
});
