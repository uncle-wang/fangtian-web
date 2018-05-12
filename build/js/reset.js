// 手机号正则验证
var telReg = /^1\d{10}$/;

var _getValue = function(name) {

	return $('input[name="' + name + '"]').val();
};
var resetPassword = function(tel, code, password) {

	common.ajax({

		url: '/api/resetPassword',
		data: {
			tel: tel,
			code: code,
			password: password
		},
		success: function(data) {

			var status = data.status;
			if (status === 1000) {
				alert('密码重置成功');
				window.location.href = 'login.html';
			}
			else if (status === 2002) {
				alert('账号不存在，请检查您的手机号');
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
	var tel = _getValue('tel');
	if (!telReg.test(tel)) {
		alert('请填写正确的手机号码');
		return;
	}
	common.ajax({
		url: '/api/sendResetCode',
		data: {tel: tel},
		success: function(data) {
			if (data.status === 1000) {
				$('.code-btn').hide();
				$('.code-counter').text('60秒').show();
				codeCount();
			}
			else if (data.status === 2002) {
				alert('账号不存在，请检查您的手机号');
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

$('#reset_form').submit(function() {

	var tel = _getValue('tel');
	var code = _getValue('code');
	var password = _getValue('password');
	var password2 = _getValue('password2');
	if (tel && code && password && password2) {
		if (password !== password2) {
			alert('两次密码不一致');
		}
		else {
			if (!telReg.test(tel)) {
				alert('手机号码无效');
			}
			else {
				resetPassword(tel, code, password);
			}
		}
	}
	else {
		alert('选项不能为空');
	}
	return false;
});
