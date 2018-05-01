// 获取历史游戏
var getGamesHistory = function() {

	common.ajax({

		url: '/api/getConfessedHistory',
		success: function(data) {
			if (data.status === 1000) {
				var gameList = data.gameList;
				if (gameList.length > 0) {
					$('.empty-info').hide();
					initGamesData(gameList);
				}
			}
			else {
				alert('数据异常，请稍后重试');
			}
		}
	});
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
		var times = gameInfo.times.toFixed(2);
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
				<div class="game-right"></div>\
			</li>\
		');
		var $gameRight = $gameItem.find('.game-right');
		var $gameEven = $gameItem.find('.even-info');
		var $gameOdd = $gameItem.find('.odd-info');
		if (result === 2) {
			$gameRight.append($('<div class="game-result">无效局</div>'));
			$gameEven.append($('<span class="game-times">赔率:' + times + '</span>'));
			$gameOdd.append($('<span class="game-times">赔率:' + times + '</span>'));
		}
		else {
			var $gameWin = $('<span class="game-win">胜</span>');
			var $gameTimes = $('<span class="game-times">赔率:' + times + '</span>');
			$gameRight.append($('<div class="game-result-number">' + resultNumber + '</div>'));
			if (result === 0) {
				$gameEven.append($gameTimes);
				$gameEven.append($gameWin);
			}
			if (result === 1) {
				$gameOdd.append($gameTimes);
				$gameOdd.append($gameWin);
			}
		}
		$gameList.append($gameItem);
	}
};

getGamesHistory();
