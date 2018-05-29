var percentPoint = 2;
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
// 跳转登录页
var toLoginPage = function(url) {
	var redirect = 'login.html?info=' + encodeURIComponent('请先登录') + '&redirect=' + (url ? url : 'personal.html');
	window.location.href = redirect;
};
// 加载登录信息
common.ajax({
	url: '/api/getUserInfo',
	success: function(data) {
		if (data.status === 1000) {
			userInfo = data.userInfo;
			$('.my-info-icon.signed').text(userInfo.tel.substr(7));
			$('.my-info-name.signed').text(userInfo.tel);
			$('#balance_text').text('余豆: ' + userInfo.balance);
			$('.unsigned').hide();
			$('.signed').show();
			var $alipayTitle = $('#alipay_link .func-item-title');
			if (userInfo.alipay) {
				$alipayTitle.addClass('set');
			}
			else {
				$alipayTitle.removeClass('set');
			}
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
	if (userInfo) {
		common.recharge.show();
	}
	else {
		toLoginPage();
	}
});
$('#pickup_btn').click(function() {
	if (userInfo) {
		if (userInfo.alipay) {
			$('#pickup_wrap').show();
			$('#pickup_amount').val('').focus();
		}
		else {
			alert('检测到您尚未绑定支付宝账号，请先完成支付宝绑定');
			window.location.href = 'alipay.html';
		}
	}
	else {
		toLoginPage();
	}
});
$('#login_btn, .my-info-icon.unsigned').click(function() {
	toLoginPage();
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
				var fees = Math.ceil(quota * percentPoint / 100);
				if (quota + fees > userInfo.balance) {
					alert('余额不足，若您的余额有变动，可刷新页面获取最新余额');
				}
				else {
					if (confirm('提现金额:' + quota + '，手续费:' + fees + '豆，收款支付宝账号:' + userInfo.alipay + '，确认提现？')) {
						common.ajax({
							url: '/api/pickup',
							data: {
								quota: quota
							},
							success: function(data) {
								if (data.status === 1000) {
									alert('提现成功，系统将在1个工作日内处理您的提现请求，您可以在提现记录中查看提现状态');
									window.location.href = window.location.href;
								}
								else if (data.status === 2003) {
									alert('余额不足，请刷新页面获取最新余额');
								}
								else if (data.status === 3004) {
									alert('对不起，您今日的提现次数已达上限，请明天8:00(北京时间)之后再次尝试');
								}
								else if (data.status === 6001) {
									alert('检测到您尚未绑定支付宝账号，请先完成支付宝绑定再提现，我们将打款到您绑定的支付宝账户');
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
$('a.func-item-link').click(function() {
	if (userInfo) {
		return true;
	}
	else {
		var redirect = $(this).attr('href');
		toLoginPage(redirect);
		return false;
	}
});
common.recharge.init();
common.payform.init();
