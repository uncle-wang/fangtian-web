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

	// 修改密码
	$('#password_form').submit(function() {
		var oldpassword = $('input[name="oldpassword"]').val();
		var newpassword = $('input[name="newpassword"]').val();
		var password2 = $('input[name="password2"]').val();
		hideError();
		if (oldpassword && newpassword && password2) {
			if (newpassword !== password2) {
				showError('两次密码不一致');
			}
			else {
				common.ajax({
					url: '/api/updatePassword',
					data: {
						oldpassword: oldpassword,
						newpassword: newpassword,
					},
					success: function(data) {
						if (data.status === 1000) {
							showInfo('修改密码成功，即将自动跳转...');
							turnToPage('login.html');
						}
						else if (data.status === 2005) {
							showError('密码不正确');
						}
						else {
							showError('数据异常，请稍后重试');
						}
					},
					error: function() {
						showError('无法连接服务器，请检查您的网络或稍后重试');
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
