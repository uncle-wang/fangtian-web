var errorText=$(".error-text"),showError=function(r){errorText.text(r).show()},hideError=function(r){errorText.text("").hide()},infoText=$(".info-text"),showInfo=function(r){infoText.text(r).show()},turnToPage=function(r){setTimeout(function(){window.location.href=r},1e3)};$("#login_form").submit(function(){var r=$('input[name="username"]').val(),o=$('input[name="password"]').val();return hideError(),r&&o?$.ajax({url:"/api/sign",data:{username:r,password:o},success:function(r){1e3===r.status?(showInfo("登录成功，即将自动跳转..."),turnToPage("index.html")):2004===r.status?(showInfo("您已登录，即将自动为您跳转至首页..."),turnToPage("index.html")):2005===r.status?showError("用户名或密码错误"):showError("无法连接服务器，请稍后重试")}}):showError("请输入用户名和密码"),!1});