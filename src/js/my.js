$('#logout_btn').click(function() {
	common.ajax({
		url: '/api/logout',
		success: function(data) {
			if (data.status === 1000) {
				window.location.href = 'index.html';
			}
		}
	});
});
common.ajax({
	url: '/api/getLoginStatus',
	success: function(data) {
		console.log(data);
	}
});