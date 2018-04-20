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
var zeroFixed = function(n) {

	if (Number(n) < 10) {
		return '0' + n;
	}
	return n;
};
var formatTime = function(stamp, timeonly) {
	var d = new Date(stamp);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	if (timeonly) {
		return zeroFixed(hour) + ':' + zeroFixed(minute);
	}
	else {
		return '' + year + '-' + zeroFixed(month) + '-' + zeroFixed(date) + ' ' + zeroFixed(hour) + ':' + zeroFixed(minute);
	}
};
var initGameInfo = function() {

	$('header .game-num').text(gameInfo.id + '期');
	var oddBox = $('.game-box.odd');
	var evenBox = $('.game-box.even');
	var status = gameInfo.status;
	var odd = gameInfo.odd_amount;
	var even = gameInfo.even_amount;
	var total = 0.9 * odd + 0.9 * even;
	var pOdd, pEven;
	if (odd === 0 || even === 0) {
		pOdd = 0;
		pEven = 0;
	}
	else {
		pOdd = (Math.floor(100 * total / odd) / 100).toFixed(2);
		pEven = (Math.floor(100 * total / even) / 100).toFixed(2);
	}
	// 接受下注
	if (status === '0') {
		$('.buy-btn-wrap').show();
		$('#disable_time').show().text('投注时间截止至' + formatTime(gameInfo.disable_time));
	}
	// 已封盘
	if (status === '2') {
		$('#close_time').show().text('投注已截止，开奖结果将在' + formatTime(gameInfo.close_time, true) + '前公布');
	}
	oddBox.find('.amount').text(odd);
	evenBox.find('.amount').text(even);
	oddBox.find('.probability').text('赔率: ' + pOdd);
	evenBox.find('.probability').text('赔率: ' + pEven);
};
// 获取游戏信息
common.ajax({
	url: '/api/getOpenConfessedGame',
	success: function(data) {
		if (data.status === 1000) {
			gameInfo = data.gameInfo;
			initGameInfo();
		}
		else if (data.status === 4001) {
			$('#next_time').show();
		}
	}
});

$('#recharge').click(function() {
	if (userInfo) {
		common.recharge.show(function(data) {
			console.log(data);
		});
	}
	else {
		window.location.href = 'login.html?redirect=index.html';
	}
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
