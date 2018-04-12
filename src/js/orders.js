// 获取历史订单
var getOrderHistory = function() {

	common.ajax({

		url: '/api/getOrderHistory',
		success: function(data) {
			if (data.status === 1000) {
				initOrderData(data.orderList);
			}
		}
	});
};

// 渲染数据
var getOrderWrap = function(column, text, textClass) {

	return '\
		<div class="order-wrap">\
			<div class="order-column">' + column + '</div>\
			<div class="order-text' + (textClass ? ' ' + textClass : '') + '">' + text + '</div>\
		</div>\
	';
};
var getTypeStr = function(type) {

	var arr = ['乙', '甲'];
	if (type === null) {
		return '等待结果';
	}
	return arr[type] || '异常';
};
var getStatusStr = function(status) {

	var arr = ['等待支付', '已结束', '等待结果'];
	return arr[parseInt(status)] || '异常';
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
		var $orderItem = $('<li class="order-item"></li>');
		var $wrapA = $(getOrderWrap('期号', orderInfo.game_id));
		var $wrapB = $(getOrderWrap('类型', getTypeStr(orderType)));
		var $wrapC = $(getOrderWrap('金额', orderInfo.amount));
		var $wrapD = $(getOrderWrap('状态', getStatusStr(orderStatus)));
		var $wrapE = $(getOrderWrap('创建时间', formatTime(orderInfo.create_time)));
		var resultStr, resultClass;
		if (orderStatus === '1') {
			var orderResult = orderInfo.result;
			resultStr = getTypeStr(orderResult);
			if (orderResult === orderType) {
				resultClass = 'won';
			}
			else {
				resultClass = 'fail';
			}
		}
		else {
			resultStr = '等待结果';
		}
		var $wrapF = $(getOrderWrap('结果', resultStr, resultClass));
		$orderItem.append($wrapA).append($wrapB).append($wrapC).append($wrapD).append($wrapE).append($wrapF);
		$orderList.append($orderItem);
	}
};

getOrderHistory();
