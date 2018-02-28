$(document).ready(function() {
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

	// 注册
	$('#register_form').submit(function() {
		var username = $('input[name="username"]').val();
		var password = $('input[name="password"]').val();
		var nickname = $('input[name="nickname"]').val();
		var password2 = $('input[name="password2"]').val();
		hideError();
		if (username && password && password2 && nickname) {
			if (password !== password2) {
				showError('两次密码不一致');
			}
			else {
				$.ajax({
					url: '/api/register',
					data: {
						username: username,
						password: password,
						nickname: nickname
					},
					success: function(data) {
						if (data.status === 1000) {
							showInfo('注册成功，即将自动跳转...');
							turnToPage('index.html');
						}
						else if (data.status === 2001) {
							showError('用户名已存在');
						}
						else {
							showError('无法连接服务器，请稍后重试');
						}
					}
				});
			}
		}
		else {
			showError('请填写空白项');
		}
		return false;
	});
});
