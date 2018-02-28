(function() {

	var exports = {};

	// loading
	var loading = $('\
		<div class="loading-wrap">\
			<div class="loading-layer"></div>\
			<div class="loading-text">玩儿命加载中...</div>\
			<style>\
				.loading-wrap {\
					display: none;\
				}\
				.loading-wrap .loading-layer {\
					z-index: 998;\
					position: fixed;\
					top: 0;\
					left: 0;\
					width: 100%;\
					height: 100%;\
					background-color: rgba(255, 255, 255, 0.8);\
				}\
				.loading-wrap .loading-text {\
					top: 45%;\
					z-index: 999;\
					color: #ff5000;\
					text-align: center;\
					position: fixed;\
					width: 100%;\
					left: 0;\
				}\
			</style>\
		</div>\
	');
	var loadingCount = 0;
	var showLoading = function() {
		$('body').css('overflow', 'hidden');
		loading.show();
		loadingCount ++;
	};
	var hideLoading = function() {
		loadingCount = Math.max(loadingCount - 1, 0);
		if (loadingCount <= 0) {
			$('body').css('overflow', 'visible');
			loading.hide();
		}
	};

	// 页脚
	var footer = $('\
		<footer class="footer">\
			<a class="footer-link" href="my.html">\
				<div class="footer-link-item">\
					<div class="footer-icon"></div>\
					<div class="footer-text">快速充值</div>\
				</div>\
			</a>\
			<a class="footer-link" href="my.html">\
				<div class="footer-link-item">\
					<div class="footer-icon"></div>\
					<div class="footer-text">我的订单</div>\
				</div>\
			</a>\
			<a class="footer-link" href="my.html">\
				<div class="footer-link-item">\
					<div class="footer-icon"></div>\
					<div class="footer-text">个人中心</div>\
				</div>\
			</a>\
			<style>\
				.footer {\
					position: fixed;\
					width: 100%;\
					bottom: 0;\
					left: 0;\
					background-color: #ff5000;\
					height: 64px;\
					overflow: hidden;\
				}\
				.footer .footer-link {\
					outline: none;\
					text-decoration: none;\
					display: block;\
					width: 33.3333%;\
					height: 100%;\
					float: left;\
				}\
				.footer .footer-link-item {\
					margin-top: 21px;\
				}\
				.footer .footer-text {\
					color: #fff;\
					text-align: center;\
				}\
			</style>\
		</footer>\
	');

	$('body').append(loading).append(footer);

	// ajax
	var ajax = function(options) {

		$.ajax({

			url: options.url,
			method: 'get',
			dataType: 'json',
			beforeSend: function() {
				showLoading();
			},
			success: function(data) {
				options.success(data);
			},
			error: function(err) {
				console.log(err);
			},
			complete: function() {
				hideLoading();
			}
		});
	};

	exports.ajax = ajax;

	window.common = exports;
}());