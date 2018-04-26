// 获取历史游戏
var getGamesHistory = function() {

	common.ajax({

		url: '/api/getConfessedHistory',
		success: function(data) {
			if (data.status === 1000) {
				initGamesData(data.gameList);
			}
			else {
				alert('数据异常，请稍后重试');
			}
		}
	});
};

var getResult = function(result) {

	var arr = ['双', '单', '和'];
	return arr[result];
};
var zeroFixed = function(n) {

	if (Number(n) < 10) {
		return '0' + n;
	}
	return n;
};
var formatTime = function(stamp) {

	var d = new Date(stamp);
	var year = d.getFullYear().toString().substr(2);
	var month = zeroFixed(d.getMonth() + 1);
	var date = zeroFixed(d.getDate());
	var hour = zeroFixed(d.getHours());
	var minute = zeroFixed(d.getMinutes());
	return '' + year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
};
var initGamesData = function(gameList) {

	var $gameList = $('.game-list');
	for (var i = 0; i < gameList.length; i ++) {
		var gameInfo = gameList[i];
		var gameId = gameInfo.id;
		var oddAmount = gameInfo.odd_amount;
		var evenAmount = gameInfo.even_amount;
		var closeTime = gameInfo.close_time;
		var times = gameInfo.times;
		var result = gameInfo.result;
		var resultNumber = gameInfo.result_no;
		var $gameItem = $('\
			<li class="game-item">\
				<div class="game-left">\
					<div class="row">\
						<span class="game-id">' + gameId + '期</span>\
						<span class="game-time">开奖时间:' + formatTime(closeTime) + '</span>\
					</div>\
					<div class="row odd-info">\
						<span class="game-type">单</span>\
						<span class="game-quota">总额:' + oddAmount + '豆</span>\
					</div>\
					<div class="row even-info">\
						<span class="game-type">双</span>\
						<span class="game-quota">总额:' + evenAmount + '豆</span>\
					</div>\
				</div>\
				<div class="game-right">\
					<div class="game-result-number">' + resultNumber + '</div>\
					<div class="game-result">' + getResult(result) + '</div>\
				</div>\
			</li>\
		');
		var $gameTimes = $('<span class="game-times">赔率:' + times + '</span>');
		if (result === 0 || result === 2) {
			$gameItem.find('.even-info').append($gameTimes);
		}
		if (result === 1 || result === 2) {
			$gameItem.find('.odd-info').append($gameTimes);
		}
		$gameList.append($gameItem);
	}
};

getGamesHistory();
