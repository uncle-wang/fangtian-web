// 获取提现记录
var getPickupHistory = function() {

	common.ajax({

		url: '/api/getPickupHistory',
		success: function(data) {
			if (data.status === 1000) {
				var pickupList = data.pickupList;
				if (pickupList.length > 0) {
					$('.empty-info').hide();
					initPickupData(pickupList);
				}
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
// 取消提现订单
var cancelPickup = function(id) {

	if (confirm('确定取消本次提现操作？')) {
		common.ajax({
			url: '/api/cancelPickup',
			data: {id: id},
			success: function(data) {
				var status = data.status;
				if (status === 1000) {
					alert('取消成功，金额已经返还至您的账户');
					window.location.href = window.location.href;
				}
				else if (status === 3003) {
					alert('订单状态发生改变，请刷新页面后重试');
				}
				else {
					alert('数据异常，请刷新页面或稍后重试');
				}
			}
		});
		console.log(id);
	}
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
					<div class="pickup-row">\
						<span class="pickup-time">' + formatTime(pickupInfo.create_time) + '</span>\
						<span class="pickup-alipay">支付宝:' + pickupInfo.alipay + '</span>\
					</div>\
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
		else if (pickupStatus === '2') {
			$pickupRight.html('<div class="cancel">已取消</div>');
		}
		else {
			$pickupRight.html('<div class="pending">待处理<a class="cancel-btn" oid="' + pickupInfo.id + '">取消</a></div>');
		}
		$pickupList.append($pickupItem);
	}
	$('.cancel-btn').click(function() {
		var pickupId = $(this).attr('oid');
		cancelPickup(pickupId);
	});
};

getPickupHistory();
