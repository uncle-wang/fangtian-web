(function() {

	var body = $('body');

	// 页脚
	var footer = (function() {
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
	// loading
	var _loading = (function() {
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
	var ajax = function(options) {

		$.ajax({

			url: options.url,
			method: 'get',
			data: options.data || {},
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

	// 充值
	var recharge = (function() {
		var rechargeData = {};
		var rechargeConfirm, rechargeCancel;
		var rechargeDom = $('\
			<div id="recharge_box" class="layer">\
				<div class="quota-box">\
					<div class="quota-list">\
						<a class="quota-item" value="100">100个</a>\
						<a class="quota-item" value="300">300个</a>\
						<a class="quota-item" value="1000">1000个</a>\
						<a class="quota-item" value="2000">2000个</a>\
						<a class="quota-item" value="5000">5000个</a>\
						<a class="quota-item" value="10000">10000个</a>\
						<a class="quota-item" value="20000">20000个</a>\
						<a class="quota-item" value="50000">50000个</a>\
					</div>\
					<div class="quota-fun">\
						<a id="recharge_confirm" class="quota-btn">确定</a>\
						<a id="recharge_cancel" class="quota-btn">取消</a>\
					</div>\
				</div>\
			</div>\
		');
		var show = function(callback) {
			rechargeDom.show();
			rechargeData.callback = callback;
		};
		var hide = function() {
			rechargeDom.hide();
			rechargeData = {};
			rechargeDom.find('.quota-item').removeClass('actived');
			rechargeConfirm.removeClass('actived');
		};
		return {
			init: function() {
				body.append(rechargeDom);
				rechargeConfirm = $('#recharge_confirm');
				rechargeCancel = $('#recharge_cancel');
				rechargeDom.click(function() {
					hide();
				});
				rechargeCancel.click(function() {
					hide();
				});
				rechargeConfirm.click(function() {
					if (rechargeData.value) {
						ajax({
							url: '/api/recharge',
							data: {
								value: rechargeData.value
							},
							success: function(data) {
								rechargeData.callback && rechargeData.callback(data);
							}
						});
					}
				});
				rechargeDom.find('.quota-item').click(function() {
					var _this = $(this);
					rechargeData.value = _this.attr('value');
					rechargeDom.find('.quota-item').removeClass('actived');
					rechargeConfirm.addClass('actived');
					_this.addClass('actived');
				});
				// 阻止向上冒泡
				rechargeDom.find('.quota-box').click(function(e) {
					e.stopPropagation();
				});
			},
			show: show,
			hide: hide
		};
	}());

	// 下单
	var payorder = (function() {
		var payorderData = {};
		var payorderConfirm, payorderCancel;
		var payorderDom = $('\
			<div id="payorder_box" class="layer">\
				<div class="quota-box">\
					<div class="quota-list">\
						<a class="quota-item" value="50">50个</a>\
						<a class="quota-item" value="100">100个</a>\
						<a class="quota-item" value="200">200个</a>\
						<a class="quota-item" value="500">500个</a>\
						<a class="quota-item" value="1000">1000个</a>\
						<a class="quota-item" value="2000">2000个</a>\
						<a class="quota-item" value="5000">5000个</a>\
						<a class="quota-item" value="10000">10000个</a>\
						<a class="quota-item" value="20000">20000个</a>\
						<a class="quota-item" value="50000">50000个</a>\
					</div>\
					<div class="quota-fun">\
						<a id="payorder_confirm" class="quota-btn">确定</a>\
						<a id="payorder_cancel" class="quota-btn">取消</a>\
					</div>\
				</div>\
			</div>\
		');
		var show = function(options) {
			payorderDom.show();
			payorderData.type = options.type;
			payorderData.gameId = options.gameId;
			payorderData.callback = options.callback;
		};
		var hide = function() {
			payorderDom.hide();
			payorderData = {};
			payorderDom.find('.quota-item').removeClass('actived');
			payorderConfirm.removeClass('actived');
		};
		return {
			init: function() {
				body.append(payorderDom);
				payorderConfirm = $('#payorder_confirm');
				payorderCancel = $('#payorder_cancel');
				payorderDom.click(function() {
					hide();
				});
				payorderCancel.click(function() {
					hide();
				});
				payorderConfirm.click(function() {
					if (payorderData.value) {
						ajax({
							url: '/api/buyConfessed',
							data: {
								type: payorderData.type,
								gameId: payorderData.gameId,
								quota: payorderData.value
							},
							success: function(data) {
								payorderData.callback && payorderData.callback(data);
							}
						});
					}
				});
				payorderDom.find('.quota-item').click(function() {
					var _this = $(this);
					payorderData.value = parseInt(_this.attr('value'));
					payorderDom.find('.quota-item').removeClass('actived');
					payorderConfirm.addClass('actived');
					_this.addClass('actived');
				});
				// 阻止向上冒泡
				payorderDom.find('.quota-box').click(function(e) {
					e.stopPropagation();
				});
			},
			show: show,
			hide: hide
		};
	}());

	window.common = {

		ajax: ajax,
		footer: footer,
		recharge: recharge,
		payorder: payorder
	};

}());
