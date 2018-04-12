// 获取历史订单
var getOrderHistory = function() {

	common.ajax({

		url: '/api/getOrderHistory',
		success: function(data) {
			console.log(data);
		}
	});
};

getOrderHistory();
