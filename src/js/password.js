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
							var wrongTimes = data.wrongTimes;
							if (wrongTimes >= 5) {
								showError('原密码错误，当前账号由于密码错误次数过多已经被锁定，请使用找回密码功能进行重置');
							}
							else if (wrongTimes > 2) {
								showError('原密码错误，连续输错5次密码账号将被锁定，当前已错误' + wrongTimes + '次');
							}
							else {
								showError('原密码错误');
							}
						}
						else if (data.status === 2009) {
							showError('您的账号已被锁定，请使用找回密码功能重置');
						}
						else if (data.status === 1001) {
							window.location.href = 'login.html?redirect=password.html&info=' + encodeURIComponent('请先登录');
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
