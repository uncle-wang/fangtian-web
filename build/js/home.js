var gameInfo, userInfo;
var updateUserInfo = function() {
	if (userInfo) {
		$('#login_btn').hide();
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
var toLoginPage = function() {
	window.location.href = 'login.html?info=' + encodeURIComponent('请先登录');
};
var zeroFixed = function(n) {

	if (Number(n) < 10) {
		return '0' + n;
	}
	return n;
};
var formatTime = function(stamp) {
	var d = new Date(stamp);
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	return '' + zeroFixed(month) + '-' + zeroFixed(date) + ' ' + zeroFixed(hour) + ':' + zeroFixed(minute);
};
var initGameInfo = function() {

	$('header .game-num').text(gameInfo.id + '期');
	var buyBtn = $('.buy-btn');
	var oddBox = $('.game-box.odd');
	var evenBox = $('.game-box.even');
	var status = gameInfo.status;
	var odd = gameInfo.odd_amount;
	var even = gameInfo.even_amount;
	var result = gameInfo.result;
	var total = 0.9 * odd + 0.9 * even;
	var pOdd, pEven;
	if (odd === 0 && even === 0) {
		pOdd = 0;
		pEven = 0;
	}
	else if (odd === 0) {
		pOdd = 0;
		pEven = '1.00';
	}
	else if (even === 0) {
		pOdd = '1.00';
		pEven = 0;
	}
	else {
		pOdd = (Math.floor(100 * total / odd) / 100).toFixed(2);
		pEven = (Math.floor(100 * total / even) / 100).toFixed(2);
	}
	// 已开奖
	if (status === '1') {
		var resultInfo;
		if (result === 2) {
			resultInfo = '当期游戏结束，因为存在单项投注总额为0的情况，所有玩家的投注金额将全部返回';
		}
		else {
			resultInfo = '当期游戏结束，开奖结果为' + gameInfo.result_no + '，投注' + (result === 0 ? '双' : '单') + '号的玩家获胜，当期赔率:' + gameInfo.times.toFixed(2);
		}
		$('#result').show().text(resultInfo);
		$('#next_time').show();
	}
	// 已封盘
	else if (status === '2' || Date.now() >= gameInfo.disable_time) {
		$('#close_time').show().text('投注已截止，开奖结果将在' + formatTime(gameInfo.close_time) + '前公布');
	}
	// 接受下注
	else if (status === '0') {
		bindBuyEvent();
		buyBtn.text('点击投注').addClass('high');
		$('.buy-btn-wrap').show();
		$('#disable_time').show().text('投注时间截止至' + formatTime(gameInfo.disable_time));
	}
	oddBox.find('.amount').text(odd + '豆');
	evenBox.find('.amount').text(even + '豆');
	oddBox.find('.probability').text('当前赔率: ' + pOdd);
	evenBox.find('.probability').text('当前赔率: ' + pEven);
};
var orderSuccess = function(data) {

	var status = data.status;
	common.orderbox.hide();
	if (status === 1000) {
		alert('投注成功，您可到个人中心-历史订单中查看订单状态');
		window.location.href = window.location.href;
	}
	else if (status === 1001) {
		alert('对不起，请先登录后再投注');
	}
	else if (status === 2003) {
		alert('对不起，您的余额不足，请充值后重新下单');
	}
	else if (status === 4002) {
		alert('对不起，您来晚了，该局游戏已经不再接受投注');
	}
	else {
		alert('对不起，数据异常，请您稍后重试');
	}
};
var bindBuyEvent = function() {

	$('#amount_odd').click(function() {
		if (userInfo) {
			common.orderbox.show({
				type: 1,
				gameId: gameInfo.id,
				callback: orderSuccess
			});
		}
		else {
			toLoginPage();
		}
	});
	$('#amount_even').click(function() {
		if (userInfo) {
			common.orderbox.show({
				type: 0,
				gameId: gameInfo.id,
				callback: orderSuccess
			});
		}
		else {
			toLoginPage();
		}
	});
};
// 获取游戏信息
common.ajax({
	url: '/api/getLatestConfessedGame',
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
		common.recharge.show();
	}
	else {
		toLoginPage();
	}
});

common.recharge.init();
common.orderbox.init();
common.payform.init();
