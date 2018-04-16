// 加载登录信息
common.ajax({
	url: '/api/getUserInfo',
	success: function(data) {
		if (data.status === 1000) {
			var userInfo = data.userInfo;
			$('.my-info-icon.signed').text(userInfo.nick);
			$('.my-info-name.signed').text(userInfo.name);
			$('.unsigned').hide();
			$('.signed').show();
		}
	}
});
// 事件绑定
$('#logout_btn').click(function() {
	common.ajax({
		url: '/api/logout',
		success: function(data) {
			if (data.status === 1000) {
				console.log(data);
			}
		}
	});
});
$('#login_btn, .my-info-icon.unsigned').click(function() {
	window.location.href = 'login.html?returnurl=' + encodeURIComponent('my.html');
});
