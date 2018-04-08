var gameInfo;
var initGameInfo = function() {

	$('header').text(gameInfo.id);
	var oddBox = $('.game-box.odd');
	var evenBox = $('.game-box.even');
	oddBox.find('.amount').text(gameInfo.odd_amount);
	evenBox.find('.amount').text(gameInfo.even_amount);
};

common.ajax({
	url: '/api/getOpenConfessedGame',
	success: function(data) {
		if (data.status === 1) {
			gameInfo = data.result;
			initGameInfo();
		}
	}
});

$('#recharge').click(function() {
	common.recharge.show(function(data) {
		console.log(data);
	});
});
$('#buy_odd').click(function() {
	common.orderbox.show({
		type: 1,
		gameId: gameInfo.id
	});
});
$('#buy_even').click(function() {
	common.orderbox.show({
		type: 0,
		gameId: gameInfo.id
	});
});

common.recharge.init();
common.orderbox.init();
common.payform.init();
