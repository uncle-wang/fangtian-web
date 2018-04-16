// 获取充值记录
var getRechargeHistory = function() {

	common.ajax({

		url: '/api/getRechargeHistory',
		success: function(data) {
			if (data.status === 1000) {
				initRechargeData(data.rechargeList);
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
var initRechargeData = function(rechargeList) {

	var $rechargeList = $('.recharge-list');
	for (var i = 0; i < rechargeList.length; i ++) {
		var rechargeInfo = rechargeList[i];
		var rechargeStatus = rechargeInfo.status;
		var $rechargeItem = $('\
			<li class="recharge-item">\
				<div class="recharge-left">\
					<div class="recharge-time">' + formatTime(rechargeInfo.create_time) + '</div>\
					<div class="recharge-amount">' + rechargeInfo.quota + '豆</div>\
				</div>\
				<div class="recharge-right"></div>\
			</li>\
		');
		var $rechargeRight = $rechargeItem.find('.recharge-right');
		if (rechargeStatus === '1') {
			$rechargeRight.html('<div class="complete">已完成</div>');
		}
		else {
			var $rechargeBtn = $('<a class="recharge-btn">待支付</a>');
			$rechargeRight.append($rechargeBtn);
			$rechargeBtn[0].rechargeInfo = {
				id: rechargeInfo.id,
				quota: rechargeInfo.quota
			};
			$rechargeBtn.click(function() {
				var rechargeId = this.rechargeInfo.id;
				var rechargeAmount = this.rechargeInfo.quota;
				common.ajax({
					url: '/api/payRecharge',
					data: {
						rechargeId: rechargeId,
						redirect: window.location.href
					},
					success: function(data) {
						if (data.status === 1000) {
							var rechargeInfo = data.rechargeInfo;
							common.payform
							.set('redirect', window.location.href)
							.set('price', rechargeAmount.toFixed(2))
							.set('order_id', rechargeInfo.order_info + '_' + rechargeId)
							.set('order_info', rechargeInfo.order_info)
							.set('signature', rechargeInfo.signature);
							common.payform.show(true);
						}
					}
				});
			});
		}
		$rechargeList.append($rechargeItem);
	}
};

common.payform.init();
getRechargeHistory();
