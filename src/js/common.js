(function() {

	var body = $('body');

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
						color: #009688;\
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
				if (options.error) {
					options.error();
				}
				else {
					alert('请求失败，请检查您的网络或稍后重试');
				}
			},
			complete: function() {
				_loading.hide();
				options.complete && options.complete();
			}
		});
	};

	// 充值
	var recharge = (function() {
		var rechargeData = {};
		var rechargeConfirm, rechargeCancel, payForm;
		var rechargeDom = $('\
			<div id="recharge_box" class="layer">\
				<div class="quota-box">\
					<div class="quota-title">请选择充值金额</div>\
					<div class="quota-list">\
						<a class="quota-item" value="10.00">10豆</a>\
						<a class="quota-item" value="30.00">30豆</a>\
						<a class="quota-item" value="100.00">100豆</a>\
						<a class="quota-item" value="300.00">300豆</a>\
						<a class="quota-item" value="1000.00">1000豆</a>\
						<a class="quota-item" value="2000.00">2000豆</a>\
						<a class="quota-item" value="5000.00">5000豆</a>\
						<a class="quota-item" value="10000.00">10000豆</a>\
					</div>\
					<div class="quota-fun">\
						<a id="recharge_confirm" class="quota-btn">确定</a>\
						<a id="recharge_cancel" class="quota-btn">取消</a>\
					</div>\
				</div>\
			</div>\
		');
		var show = function() {
			rechargeDom.show();
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
				payForm = $('form#payform');
				rechargeConfirm = $('#recharge_confirm');
				rechargeCancel = $('#recharge_cancel');
				// 初始化表单
				payForm.find('input[name="redirect"]').val(window.location.href);
				// 绑定事件
				rechargeDom.click(function() {
					hide();
				});
				rechargeCancel.click(function() {
					hide();
				});
				rechargeDom.find('.quota-item').click(function() {
					var _this = $(this);
					rechargeData.price = _this.attr('value');
					rechargeDom.find('.quota-item').removeClass('actived');
					rechargeConfirm.addClass('actived');
					_this.addClass('actived');
				});
				rechargeConfirm.click(function() {
					var price = rechargeData.price;
					var redirect = window.location.href;
					if (price) {
						ajax({
							url: '/api/createRecharge',
							data: {
								redirect: redirect,
								price: price
							},
							success: function(data) {
								if (data.status === 1000) {
									var payInfo = data.payInfo;
									recharge.hide();
									payform
									.set('redirect', window.location.href)
									.set('price', price)
									.set('order_id', payInfo.order_id)
									.set('order_info', payInfo.order_info)
									.set('signature', payInfo.signature)
									.show();
								}
							}
						});
					}
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

	// 充值支付
	var payform = (function() {

		var payformDom = $('\
			<div id="payform_box" class="layer">\
				<div class="payform">\
					<div class="pay-text">\
						订单创建成功，去支付吧！\
					</div>\
					<div class="pay-info">\
						付款即时到账，支付遇到问题请在<br>个人中心>问题反馈 联系我们\
					</div>\
					<form id="payform" method="post" action="https://www.paypayzhu.com/api/pay">\
						<input type="hidden" name="api_user" value="a7026c0e">\
						<input type="hidden" name="type" value="2">\
						<input type="hidden" name="redirect">\
						<input type="hidden" name="price">\
						<input type="hidden" name="order_id">\
						<input type="hidden" name="order_info">\
						<input type="hidden" name="signature">\
						<input type="submit" class="pay-submit" value="去支付">\
					</form>\
				</div>\
			</div>\
		');
		var payText = payformDom.find('.pay-text');

		return {
			init: function() {
				body.append(payformDom);
				return this;
			},
			show: function(hideText) {
				if (hideText) {
					payText.hide();
				}
				else {
					payText.show();
				}
				payformDom.show();
				return this;
			},
			hide: function() {
				payformDom.hide();
				return this;
			},
			set: function(key, value) {
				payformDom.find('input[name="' + key + '"]').val(value);
				return this;
			},
			reset: function() {
				payformDom.find('input[name="redirect"]').removeAttr('value');
				payformDom.find('input[name="price"]').removeAttr('value');
				payformDom.find('input[name="order_id"]').removeAttr('value');
				payformDom.find('input[name="order_info"]').removeAttr('value');
				payformDom.find('input[name="signature"]').removeAttr('value');
				return this;
			}
		};
	}());

	// 下单
	var orderbox = (function() {
		var prodname = ['双', '单'];
		var orderboxData = {};
		var orderboxConfirm, orderboxCancel, orderType;
		var orderboxDom = $('\
			<div id="orderbox_box" class="layer">\
				<div class="quota-box">\
					<div class="quota-title">您将投注<span id="order_type"></span>，请选择金额</div>\
					<div class="quota-list">\
						<a class="quota-item" value="10.00">10豆</a>\
						<a class="quota-item" value="30.00">30豆</a>\
						<a class="quota-item" value="100.00">100豆</a>\
						<a class="quota-item" value="300.00">300豆</a>\
						<a class="quota-item" value="1000.00">1000豆</a>\
						<a class="quota-item" value="2000.00">2000豆</a>\
						<a class="quota-item" value="5000.00">5000豆</a>\
						<a class="quota-item" value="10000.00">10000豆</a>\
					</div>\
					<div class="quota-fun">\
						<a id="orderbox_confirm" class="quota-btn">确定</a>\
						<a id="orderbox_cancel" class="quota-btn">取消</a>\
					</div>\
				</div>\
			</div>\
		');
		var show = function(options) {
			orderboxDom.show();
			orderboxData.type = options.type;
			orderboxData.gameId = options.gameId;
			orderboxData.callback = options.callback;
			orderType.text('[' + prodname[options.type] + ']');
		};
		var hide = function() {
			orderboxDom.hide();
			orderboxData = {};
			orderboxDom.find('.quota-item').removeClass('actived');
			orderboxConfirm.removeClass('actived');
		};
		return {
			init: function() {
				body.append(orderboxDom);
				orderboxConfirm = $('#orderbox_confirm');
				orderboxCancel = $('#orderbox_cancel');
				orderType = $('#order_type');
				orderboxDom.click(function() {
					hide();
				});
				orderboxCancel.click(function() {
					hide();
				});
				orderboxConfirm.click(function() {
					var orderValue = orderboxData.value;
					if (orderValue) {
						if (confirm('投注种类:' + prodname[orderboxData.type] + '，金额:' + orderValue + '，请确认')) {
							ajax({
								url: '/api/createOrder',
								data: {
									type: orderboxData.type,
									gameId: orderboxData.gameId,
									quota: orderValue
								},
								success: function(data) {
									orderboxData.callback && orderboxData.callback(data);
								}
							});
						}
					}
				});
				orderboxDom.find('.quota-item').click(function() {
					var _this = $(this);
					orderboxData.value = parseInt(_this.attr('value'));
					orderboxDom.find('.quota-item').removeClass('actived');
					orderboxConfirm.addClass('actived');
					_this.addClass('actived');
				});
				// 阻止向上冒泡
				orderboxDom.find('.quota-box').click(function(e) {
					e.stopPropagation();
				});
			},
			show: show,
			hide: hide
		};
	}());

	window.common = {

		ajax: ajax,
		recharge: recharge,
		orderbox: orderbox,
		payform: payform
	};

}());
