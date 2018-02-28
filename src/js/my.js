$(document).ready(function() {
	// 加载登录信息
	common.ajax({
		url: '/api/getLoginStatus',
		success: function(data) {
			if (data.status === 1000 && data.signed === true) {
				var info = data.info;
				$('.my-info-icon.signed').text(info.nick);
				$('.my-info-name.signed').text(info.name);
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
});
