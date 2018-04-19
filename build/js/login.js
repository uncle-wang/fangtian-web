// 错误信息
var errorText = $('.error-text');
var showError = function(text) {
	errorText.text(text).show();
};
var hideError = function(text) {
	errorText.text('').hide();
};
// 取redirect参数
var getRedirect = function() {
	var search = window.location.search;
	if (search.length > 1) {
		search = search.substr(1);
		var arr = search.split('&');
		for (var i = 0; i < arr.length; i ++) {
			var pair = arr[i];
			if (pair.indexOf('redirect=') === 0) {
				var v = pair.substr(9);
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
					var redirectUrl = getRedirect();
					if (redirectUrl) {
						window.location.href = redirectUrl;
					}
					else {
						window.location.href = 'index.html';
					}
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
