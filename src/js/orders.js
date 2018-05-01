// 获取历史订单
var getOrderHistory = function() {

	common.ajax({

		url: '/api/getOrderHistory',
		success: function(data) {
			if (data.status === 1000) {
				var orderList = data.orderList;
				if (orderList.length > 0) {
					$('.empty-info').hide();
					initOrderData(orderList);
				}
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

	var arr = ['双', '单'];
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
		var orderAmount = orderInfo.amount;
		var orderStatus = orderInfo.status;
		var orderTimes = orderInfo.times.toFixed(2);
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
						<span class="order-quota">' + orderAmount + '豆</span>\
						<span class="order-won"></span>\
					</div>\
				</div>\
				<div class="order-right"></div>\
			</li>\
		');
		var $orderRight = $orderItem.find('.order-right');
		var $orderWon = $orderItem.find('.order-won');
		if (orderStatus === '1') {
			var orderResult = orderInfo.result;
			if (orderResult === 2) {
				$orderRight.html('<div class="draw">无效局</div>');
			}
			else if (orderResult === orderType) {
				$orderRight.html('<div class="won">胜利</div>');
				$orderWon.html('x' + orderTimes + '&nbsp;&nbsp;赢取' + orderTimes * orderAmount + '豆').show();
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
