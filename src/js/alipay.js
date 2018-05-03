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
// 获取密保问题
var getQuestions = function(callback) {

	common.ajax({
		url: '/api/getQuestions',
		success: function(data) {
			if (data.status === 1000) {
				if (data.ques) {
					callback(data.ques);
				}
				else {
					alert('对不起，该账号暂未设置密码保护');
				}
			}
			else {
				alert('数据异常，请稍后重试');
			}
		}
	});
};

// 初始化问题列表
var initQuestionList = function(quesList) {

	$('#protect_form .line:nth-child(1) .ques-text').text(quesList[0]);
	$('#protect_form .line:nth-child(2) .ques-text').text(quesList[1]);
	$('#protect_form .line:nth-child(3) .ques-text').text(quesList[2]);
};

// 重置密码
var _getValue = function(name) {

	return $('input[name="' + name + '"]').val();
};
var setAlipayWithProtection = function() {

	common.ajax({

		url: '/api/setAlipayWithProtection',
		data: {
			alipay: _getValue('alipay'),
			answ_a: _getValue('answ_a'),
			answ_b: _getValue('answ_b'),
			answ_c: _getValue('answ_c')
		},
		success: function(data) {

			var status = data.status;
			if (status === 1000) {
				alert('支付宝绑定成功');
				window.location.href = 'personal.html';
			}
			else if (status === 2006) {
				alert('密保问题验证失败，请检查您的答案');
				$('#alipay').hide();
				$('#protection').show();
			}
			else {
				alert('对不起，数据异常，请稍后重试');
			}
		}
	});
};
var setAlipayWithoutProtection = function() {

	common.ajax({

		url: '/api/setAlipayWithoutProtection',
		data: {
			alipay: _getValue('alipay')
		},
		success: function(data) {

			var status = data.status;
			if (status === 1000) {
				alert('支付宝绑定成功');
				window.location.href = 'personal.html';
			}
			else {
				alert('对不起，数据异常，请稍后重试');
			}
		}
	});
};

// 检验protection表单内容是否合法
var protValid = function() {

	var inputs = $('#protection input[type="text"]');
	for (var i = 0; i < inputs.length; i ++) {
		var text = $(inputs[i]).val();
		if (text.length <= 0) {
			return 0;
		}
		if (text.length > 16) {
			return 2;
		}
	}
	return 1;
};

$('#protect_form').submit(function() {

	var validStatus = protValid();
	if (validStatus === 1) {
		$('#protection').hide();
		$('#alipay').show();
	}
	else if (validStatus === 2) {
		alert('选项内容不能超过16个字符，请检查您的输入');
	}
	else {
		alert('选项不能为空');
	}
	return false;
});
$('#alipay_form').submit(function() {

	var alipay = $('#alipay').find('input[name="alipay"]').val();
	if (alipay) {
		if (pType === '1') {
			setAlipayWithProtection();
		}
		else if (pType === '0') {
			setAlipayWithoutProtection()
		}
		else {
			alert('type参数异常');
		}
	}
	else {
		alert('选项不能为空');
	}
	return false;
});

var pType = getParam('type');
if (pType === '1') {
	getQuestions(function(quesList) {
		initQuestionList(quesList);
		$('#protection').show();
	});
}
else if (pType === '0') {
	$('#alipay').show();
}
else {
	alert('type参数异常');
}

