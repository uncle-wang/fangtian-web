var gameInfo, userInfo;
var initGameInfo = function() {

	$('header .game-num').text(gameInfo.id + '期');
	var oddBox = $('.game-box.odd');
	var evenBox = $('.game-box.even');
	oddBox.find('.amount').text(gameInfo.odd_amount);
	evenBox.find('.amount').text(gameInfo.even_amount);
};
var updateUserInfo = function() {
	if (userInfo) {
		$('#login_btn').hide();
		$('#user_name').text(userInfo.nick).css('display', 'block');
	}
};
// 获取游戏信息
common.ajax({
	url: '/api/getOpenConfessedGame',
	success: function(data) {
		if (data.status === 1) {
			gameInfo = data.result;
			initGameInfo();
		}
	}
});
// 获取用户信息
common.ajax({
	url: '/api/getUserInfo',
	success: function(data) {
		if (data.status === 1000) {
			userInfo = data.userInfo;
			updateUserInfo();
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
