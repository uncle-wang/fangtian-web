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
				callback(data.ques);
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
	console.log(quesList);
};

// 初始化
var init = function() {

	var type = getParam('type');
	if (type === '1') {
		getQuestions(function(quesList) {
			initQuestionList(quesList);
			$('#old_protection').show();
		});
	}
	if (type === '0') {
		$('#new_protection').show();
	}
};

$('#old_protect_form').submit(function() {
	$('#old_protection').hide();
	$('#new_protection').show();
	return false;
});

$('#new_protect_form').submit(function() {

	$('#new_protection').hide();
	$('#password').show();
	return false;
});

$('#password_form').submit(function() {

	return false;
});

init();
