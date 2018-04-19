var gameInfo, userInfo;
var updateUserInfo = function() {
	if (userInfo) {
		$('#login_btn').hide();
		$('#user_name').text(userInfo.nick).css('display', 'block');
	}
};
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
var initGameInfo = function() {

	$('header .game-num').text(gameInfo.id + '期');
	var oddBox = $('.game-box.odd');
	var evenBox = $('.game-box.even');
	var odd = gameInfo.odd_amount;
	var even = gameInfo.even_amount;
	var total = 0.9 * odd + 0.9 * even;
	var pOdd = (Math.floor(100 * total / odd) / 100).toFixed(2);
	var pEven = (Math.floor(100 * total / even) / 100).toFixed(2);
	oddBox.find('.amount').text(odd);
	evenBox.find('.amount').text(even);
	oddBox.find('.probability').text('概率: ' + pOdd);
	evenBox.find('.probability').text('概率: ' + pEven);
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
