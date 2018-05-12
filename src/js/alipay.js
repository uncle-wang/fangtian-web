var _getValue = function(name) {

	return $('input[name="' + name + '"]').val();
};
var setAlipay = function(alipay, code) {

	common.ajax({

		url: '/api/setAlipay',
		data: {
			alipay: alipay,
			code: code
		},
		success: function(data) {

			var status = data.status;
			if (status === 1000) {
				alert('支付宝绑定成功');
				window.location.href = 'personal.html';
			}
			else if (status === 8001) {
				alert('验证码无效');
			}
			else {
				alert('对不起，数据异常，请稍后重试');
			}
		}
	});
};

// 倒计时
var codeCount = function() {

	var s = 60;
	var t = setInterval(function() {
		s --;
		if (s <= 0) {
			clearInterval(t);
			$('.code-counter').hide();
			$('.code-btn').show();
		}
		else {
			$('.code-counter').text(s + '秒');
		}
	}, 1000);
};

// 发送验证码
var sendCode = function() {
	common.ajax({
		url: '/api/sendAlipayCode',
		success: function(data) {
			if (data.status === 1000) {
				$('.code-btn').hide();
				$('.code-counter').text('60秒').show();
				codeCount();
			}
			else if (data.status === 1001) {
				alert('请先登录');
				window.location.href = 'login.html?redirect=alipay.html&info=' + encodeURIComponent('请先登录');
			}
			else if (data.status === 8002) {
				alert('请求过于频繁，请1分钟后重试');
			}
			else {
				alert('服务异常，请稍后重试');
			}
		}
	});
};

// 验证码
$('#code_btn').click(function() {
	sendCode();
});

$('#alipay_form').submit(function() {

	var alipay = _getValue('alipay');
	var code = _getValue('code');
	if (alipay && code) {
		setAlipay(alipay, code);
	}
	else {
		alert('选项不能为空');
	}
	return false;
});
