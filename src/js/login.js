$(document).ready(function() {
	// 错误信息
	var errorText = $('.error-text');
	var showError = function(text) {
		errorText.text(text).show();
	};
	var hideError = function(text) {
		errorText.text('').hide();
	};
	// 登录
	$('#login_form').submit(function() {
		var username = $('input[name="username"]').val();
		var password = $('input[name="password"]').val();
		hideError();
		if (username && password) {
			$.ajax({
				url: '/api/sign',
				data: {
					username: username,
					password: password
				},
				success: function(data) {
					if (data.status === 1000) {
						window.location.href = 'index.html';
					}
					else if (data.status === 2005) {
						showError('用户名或密码错误');
					}
					else {
						showError('无法连接服务器，请稍后重试');
					}
				}
			});
		}
		else {
			showError('请输入用户名和密码');
		}
		return false;
	});
});
