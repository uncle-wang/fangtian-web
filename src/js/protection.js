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
					window.location.href = 'protection.html?type=0';
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

	$('#old_protect_form .line:nth-child(1) .ques-text').text(quesList[0]);
	$('#old_protect_form .line:nth-child(2) .ques-text').text(quesList[1]);
	$('#old_protect_form .line:nth-child(3) .ques-text').text(quesList[2]);
};

// 设置密保
var _getValue = function(name) {

	return $('input[name="' + name + '"]').val();
};
var setProtection = function() {

	common.ajax({

		url: '/api/setProtection',
		data: {
			type: pType,
			old_answ_a: _getValue('old_answ_a'),
			old_answ_b: _getValue('old_answ_b'),
			old_answ_c: _getValue('old_answ_c'),
			new_ques_a: _getValue('new_ques_a'),
			new_ques_b: _getValue('new_ques_b'),
			new_ques_c: _getValue('new_ques_c'),
			new_answ_a: _getValue('new_answ_a'),
			new_answ_b: _getValue('new_answ_b'),
			new_answ_c: _getValue('new_answ_c')
		},
		success: function(data) {

			var status = data.status;
			if (status === 1000) {
				alert('密保设置成功');
				window.location.href = 'personal.html';
			}
			else if (status === 2006) {
				alert('原密保问题验证失败，请检查您的答案');
				$('#new_protection').hide();
				$('#old_protection').show();
			}
			else {
				alert('对不起，数据异常，请稍后重试');
			}
		}
	});
};

// 初始化
var init = function() {

	if (pType === '1') {
		getQuestions(function(quesList) {
			initQuestionList(quesList);
			$('#old_protection').show();
		});
	}
	else if (pType === '0') {
		$('#new_protection').show();
	}
	else {
		alert('type参数异常');
	}
};

// 检验new_protection表单内容是否合法
var newProtValid = function() {

	var inputs = $('#new_protection input[type="text"]');
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
// 检验old_protection表单内容是否合法
var oldProtValid = function() {

	var inputs = $('#old_protection input[type="text"]');
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

$('#old_protect_form').submit(function() {
	var validStatus = oldProtValid();
	if (validStatus === 1) {
		$('#old_protection').hide();
		$('#new_protection').show();
	}
	else if (validStatus === 2) {
		alert('选项内容不能超过16个字符，请检查您的输入');
	}
	else {
		alert('选项不能为空');
	}
	return false;
});

$('#new_protect_form').submit(function() {

	var validStatus = newProtValid();
	if (validStatus === 1) {
		setProtection();
	}
	else if (validStatus === 2) {
		alert('选项内容不能超过16个字符，请检查您的输入');
	}
	else {
		alert('选项不能为空');
	}
	return false;
});

var pType = getParam('type');
init();
