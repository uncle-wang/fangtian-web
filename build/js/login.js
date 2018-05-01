// 错误信息
var errorText = $('.error-text');
var showError = function(text) {
	errorText.text(text).show();
};
var hideError = function(text) {
	errorText.text('').hide();
};
// 取参数
var getParam = function(name) {
	var search = window.location.search;
	if (search.length > 1) {
		search = search.substr(1);
		var arr = search.split('&');
		for (var i = 0; i < arr.length; i ++) {
			var pair = arr[i];
			if (pair.indexOf(name + '=') === 0) {
				var v = pair.substr(name.length + 1);
				if (v.length > 0) {
					return v;
				}
			}
		}
	}
	return;
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
					var redirectUrl = getParam('redirect');
					if (redirectUrl) {
						window.location.href = redirectUrl;
					}
					else {
						window.location.href = 'index.html';
					}
				}
				else if (data.status === 2002) {
					showError('用户名或密码错误');
				}
				else if (data.status === 2005) {
					var wrongTimes = data.wrongTimes;
					if (wrongTimes >= 5) {
						showError('密码错误，当前账号由于密码错误次数过多已经被锁定，请使用找回密码功能进行重置');
					}
					else if (wrongTimes > 2) {
						showError('密码错误，连续输错5次密码账号将被锁定，当前已错误' + wrongTimes + '次');
					}
					else {
						showError('用户名或密码错误');
					}
				}
				else if (data.status === 2009) {
					showError('您的账号已被锁定，请使用找回密码功能重置');
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

// 获取info信息
var textInfo = getParam('info');
if (textInfo) {
	showError(decodeURIComponent(textInfo));
}
