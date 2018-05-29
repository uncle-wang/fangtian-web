$(document).ready(function() {

	// 手机号正则验证
	var telReg = /^1\d{10}$/;

	// 错误信息
	var errorText = $('.error-text');
	var showError = function(text) {
		errorText.text(text).show();
	};
	var hideError = function(text) {
		errorText.text('').hide();
	};
	// 提示信息
	var infoText = $('.info-text');
	var showInfo = function(text) {
		infoText.text(text).show();
	};
	// 页面跳转
	var turnToPage = function(url) {
		setTimeout(function() {
			window.location.href = url;
		}, 1000);
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
		hideError();
		var tel = $('input[name="tel"]').val();
		if (!telReg.test(tel)) {
			showError('请填写正确的手机号码');
			return;
		}
		common.ajax({
			url: '/api/sendRegisterCode',
			data: {tel: tel},
			success: function(data) {
				if (data.status === 1000) {
					$('.code-btn').hide();
					$('.code-counter').text('60秒').show();
					codeCount();
				}
				else if (data.status === 2001) {
					showError('该手机号已被注册');
				}
				else if (data.status === 8002) {
					showError('请求过于频繁，请1分钟后重试');
				}
				else {
					showError('服务异常，请稍后重试');
				}
			}
		});
	};

	// 验证码
	$('#code_btn').click(function() {
		sendCode();
	});
	// 注册
	$('#register_form').submit(function() {
		var tel = $('input[name="tel"]').val();
		var code = $('input[name="code"]').val();
		var password = $('input[name="password"]').val();
		var password2 = $('input[name="password2"]').val();
		hideError();
		if (tel && code && password && password2) {
			if (!telReg.test(tel)) {
				showError('手机号码无效');
			}
			else {
				if (password !== password2) {
					showError('两次密码不一致');
				}
				else {
					common.ajax({
						url: '/api/register',
						data: {
							tel: tel,
							code: code,
							password: password
						},
						success: function(data) {
							if (data.status === 1000) {
								var newUserInfo = '为了保证您的账号安全，请您登录后尽快到 个人中心-密码保护 中设置密码保护';
								showInfo('注册成功，即将自动跳转...');
								turnToPage('login.html?info=' + encodeURIComponent(newUserInfo));
							}
							else if (data.status === 2001) {
								showError('该手机号已被注册');
							}
							else if (data.status === 8001) {
								showError('验证码无效');
							}
							else {
								showError('无法连接服务器，请稍后重试');
							}
						}
					});
				}
			}
		}
		else {
			showError('请填写空白项');
		}
		return false;
	});
});
