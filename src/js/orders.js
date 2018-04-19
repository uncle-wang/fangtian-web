// 获取历史订单
var getOrderHistory = function() {

	common.ajax({

		url: '/api/getOrderHistory',
		success: function(data) {
			if (data.status === 1000) {
				initOrderData(data.orderList);
			}
			else if (data.status === 1001) {
				window.location.href = 'login.html?redirect=orders.html';
			}
			else {
				alert('数据异常，请稍后重试');
			}
		}
	});
};

var getTypeStr = function(type) {

	var arr = ['乙', '甲'];
	if (type === null) {
		return '等待结果';
	}
	return arr[type] || '异常';
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
var initOrderData = function(orderList) {

	var $orderList = $('.order-list');
	for (var i = 0; i < orderList.length; i ++) {
		var orderInfo = orderList[i];
		var orderStatus = orderInfo.status;
		var orderType = orderInfo.type;
		var $orderItem = $('\
			<li class="order-item">\
				<div class="order-left">\
					<div class="row">\
						<span class="order-id">' + orderInfo.game_id + '期</span>\
						<span class="order-time">' + formatTime(orderInfo.create_time) + '</span>\
					</div>\
					<div class="row">\
						<span class="order-type">' + getTypeStr(orderType) + '</span>\
						<span class="order-quota">' + orderInfo.amount + '豆</span>\
					</div>\
				</div>\
				<div class="order-right"></div>\
			</li>\
		');
		var $orderRight = $orderItem.find('.order-right');
		if (orderStatus === '1') {
			var orderResult = orderInfo.result;
			if (orderResult === orderType) {
				$orderRight.html('<div class="won">胜利</div>');
			}
			else {
				$orderRight.html('<div class="fail">失败</div>');
			}
		}
		else {
			$orderRight.html('<div class="pending">等待开奖</div>');
		}
		$orderList.append($orderItem);
	}
};

common.payform.init();
getOrderHistory();
