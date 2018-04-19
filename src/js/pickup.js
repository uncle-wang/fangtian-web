// 获取充值记录
var getPickupHistory = function() {

	common.ajax({

		url: '/api/getPickupHistory',
		success: function(data) {
			if (data.status === 1000) {
				initPickupData(data.pickupList);
			}
			else if (data.status === 1001) {
				window.location.href = 'login.html?redirect=pickup.html';
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
var initPickupData = function(pickupList) {

	var $pickupList = $('.pickup-list');
	for (var i = 0; i < pickupList.length; i ++) {
		var pickupInfo = pickupList[i];
		var pickupStatus = pickupInfo.status;
		var $pickupItem = $('\
			<li class="pickup-item">\
				<div class="pickup-left">\
					<div class="pickup-time">' + formatTime(pickupInfo.create_time) + '</div>\
					<div class="pickup-row">\
						<span class="pickup-amount">金额:' + pickupInfo.quota + '豆</span>\
						<span class="pickup-fees">手续费:' + pickupInfo.fees + '豆</span>\
					</div>\
				</div>\
				<div class="pickup-right"></div>\
			</li>\
		');
		var $pickupRight = $pickupItem.find('.pickup-right');
		if (pickupStatus === '1') {
			$pickupRight.html('<div class="complete">已完成</div>');
		}
		else {
			$pickupRight.html('<div class="pending">待处理</div>');
		}
		$pickupList.append($pickupItem);
	}
};

getPickupHistory();
