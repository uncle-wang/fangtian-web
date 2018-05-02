// 获取密保问题
var getQuestions = function(username, callback) {

	common.ajax({
		url: '/api/getQuestionsByName',
		data: {username: username},
		success: function(data) {
			if (data.status === 1000) {
				if (data.ques) {
					callback(data.ques);
				}
				else {
					alert('对不起，该账号暂未设置密码保护，无法重置密码');
				}
			}
			else if (data.status === 2002) {
				alert('用户名不存在，请检查您的输入');
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
var resetPassword = function() {

	common.ajax({

		url: '/api/resetPassword',
		data: {
			username: _getValue('username'),
			answ_a: _getValue('answ_a'),
			answ_b: _getValue('answ_b'),
			answ_c: _getValue('answ_c'),
			password: _getValue('password')
		},
		success: function(data) {

			var status = data.status;
			if (status === 1000) {
				alert('密码重置成功');
				window.location.href = 'login.html';
			}
			else if (status === 2006) {
				alert('密保问题验证失败，请检查您的答案');
				$('#password').hide();
				$('#protection').show();
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
		$('#password').show();
	}
	else if (validStatus === 2) {
		alert('选项内容不能超过16个字符，请检查您的输入');
	}
	else {
		alert('选项不能为空');
	}
	return false;
});
$('#user_form').submit(function() {

	var userName = $(this).find('input[name="username"]').val();
	if (userName) {
		getQuestions(userName, function(quesList) {
			initQuestionList(quesList);
			$('#username').hide();
			$('#protection').show();
		});
	}
	else {
		alert('请输入用户名');
	}
	return false;
});
$('#password_form').submit(function() {

	var password = $('#password').find('input[name="password"]').val();
	var password2 = $('#password').find('input[name="password2"]').val();
	if (password && password2) {
		if (password === password2) {
			resetPassword();
		}
		else {
			alert('两次输入不一致，请检查您的输入');
		}
	}
	else {
		alert('选项不能为空');
	}
	return false;
});
