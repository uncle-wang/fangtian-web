$(document).ready(function() {
	var vm = new Vue({

		el: '#main',
		data: {
			orderList: []
		},
		methods: {
			responseOrder: function(orderId) {
				$.ajax({
					url: '/api/responseOrder',
					data: {
						orderid: orderId
					},
					dataType: 'json',
					success: function(data) {
						console.log(data);
					}
				});
			}
		},
		beforeMount: function() {
			var _self = this;
			$.ajax({
				url: '/api/getOrderListToBeResponded',
				method: 'get',
				dataType: 'json',
				success: function(data) {
					if (data.status === 1000) {
						_self.orderList = data.orderList;
					}
					else {
						if (data.desc) {
							alert(data.desc);
						}
						else {
							alert(data.status);
						}
					}
				},
				error: function(e) {
					console.log(e);
				}
			});
		}
	});
});
