var initGameInfo = function(data) {

	$('header').text(data.id);
	var oddBox = $('.game-box.odd');
	var evenBox = $('.game-box.even');
	oddBox.find('.amount').text(data.odd_amount);
	evenBox.find('.amount').text(data.even_amount);
};

common.ajax({
	url: '/api/getOpenConfessedGame',
	success: function(data) {
		if (data.status === 1) {
			initGameInfo(data.result);
		}
	}
});
