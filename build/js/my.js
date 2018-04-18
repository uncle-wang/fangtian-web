var percentPoint = 6;
var userInfo;
// 计算提现最大值
var getMaxPickupValue = function() {
	var balance = userInfo.balance;
	if (balance > 0) {
		var baseValue = Math.floor(balance * (100 - percentPoint) / 100);
		var lastV = baseValue;
		for (var i = baseValue; i <= balance; i ++) {
			if (i + Math.ceil(i * percentPoint / 100) <= balance) {
				lastV = i;
			}
			else {
				$('#pickup_amount').val(lastV);
				return;
			}
		}
	}
	else {
		$('#pickup_amount').val(0);
		return;
	}
};
// 加载登录信息
common.ajax({
	url: '/api/getUserInfo',
	success: function(data) {
		if (data.status === 1000) {
			userInfo = data.userInfo;
			$('.my-info-icon.signed').text(userInfo.nick);
			$('.my-info-name.signed').text(userInfo.name);
			$('#balance_text').text('余豆: ' + userInfo.balance);
			$('.unsigned').hide();
			$('.signed').show();
		}
	}
});
// 事件绑定
$('#logout_btn').click(function() {
	common.ajax({
		url: '/api/logout',
		success: function(data) {
			if (data.status === 1000) {
				window.location.href = 'index.html';
			}
		}
	});
});
$('#recharge_btn').click(function() {
	common.recharge.show();
});
$('#pickup_btn').click(function() {
	if (userInfo) {
		$('#pickup_wrap').show();
		$('#pickup_amount').val('').focus();
	}
	else {
		window.location.href = 'login.html';
	}
});
$('#login_btn, .my-info-icon.unsigned').click(function() {
	window.location.href = 'login.html?returnurl=' + encodeURIComponent('my.html');
});
$('#pickup_all').click(function() {
	getMaxPickupValue();
});
$('#pickup_submit').click(function() {
	var val = $('#pickup_amount').val();
	if (val === '0') {
		alert('提现数额不能小于100');
	}
	else {
		var reg = /^[1-9]\d*$/;
		if (reg.test(val)) {
			var quota = parseInt(val);
			if (quota < 100) {
				alert('提现数额不能小于100');
			}
			else {
				if (quota + Math.ceil(quota * percentPoint / 100) > userInfo.balance) {
					alert('余额不足，若您的余额有变动，可刷新页面获取最新余额');
				}
				else {
					common.ajax({
						url: '/api/pickup',
						data: {
							quota: quota
						},
						success: function(data) {
							if (data.status === 1000) {
								window.location.href = 'pickup.html';
							}
							else if (data.status === 2003) {
								alert('余额不足，请刷新页面获取最新余额');
							}
							else {
								alert('服务异常，请尝试刷新页面或重新登录');
							}
						},
						error: function() {
							alert('请求失败，请检查您的网络');
						},
						complete: function() {
							$('#pickup_wrap').hide();
						}
					});
				}
			}
		}
		else {
			alert('请输入合法的数字');
		}
	}
});
$('#pickup_wrap').click(function() {
	$('#pickup_wrap').hide();
});
$('.pickup-box').click(function(e) {
	e.stopPropagation();
});
common.recharge.init();
common.payform.init();
