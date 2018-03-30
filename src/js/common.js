	var body = $('body');

	var _loading = (function() {
		// loading
		var loadingWrap = $('\
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
		var show = function() {
			body.css('overflow', 'hidden');
			loadingWrap.show();
			loadingCount ++;
		};
		var hide = function() {
			loadingCount = Math.max(loadingCount - 1, 0);
			if (loadingCount <= 0) {
				body.css('overflow', 'visible');
				loadingWrap.hide();
			}
		};
		body.append(loadingWrap);
		return {
			show: show,
			hide: hide
		};
	}());

	var footer = (function() {
		// 页脚
		var footerWrap = $('\
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
		return {
			init: function() {
				body.append(footerWrap);
			}
		};
	}());

	// ajax
	var ajax = function(options) {

		$.ajax({

			url: options.url,
			method: 'get',
			datas: options.datas || {},
			dataType: 'json',
			beforeSend: function() {
				_loading.show();
			},
			success: function(data) {
				options.success(data);
			},
			error: function(err) {
				console.log(err);
			},
			complete: function() {
				_loading.hide();
			}
		});
	};

	window.common = {

		ajax: ajax,
		footer: footer
	};
