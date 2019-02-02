
function eminReady() {
    var lastInputName = localStorage.lastInputUserName;
    if(!TextUtil.isEmpty(lastInputName)) {
        $$('.user-name').val(lastInputName);
    }
}

$$('.loginSub').on('click', function() {
	var formData = myApp.formToJSON('#loginForm');
	if(formData.username.length == 0) {
		myApp.alert('请填写用户名','提示');
	} else if(formData.password.length == 0) {
		myApp.alert('请填写密码','提示');
	} else {
        myApp.showPreloader('登录中...');
        setTimeout(function() {
            login(formData);
        }, 200);
	}
});

/**
 * 登录
 * 
 * @param {Object} loginInfo 登录form表单
 */
function login(loginInfo) {
	EminBridge.ohr.request({
		url: serviceConfig.loginUrl,
		path:serviceConfig.loginPath,
		data:{
			username:loginInfo.username,
			password:md5(loginInfo.password)
		},
		type:'post',
		success: function(result) {
		    myApp.hidePreloader();
			if(result.success) {
				didLoginSuccess(result.data);
			} else {
			    var errCode = result.code;
                var errMsg = serviceConfig.getErrorMsg(errCode);
                myApp.alert(errMsg, '温馨提示');
			}
		},
		error:function(e) {
		    myApp.hidePreloader();
			EminBridge.toast('网络不给力');
		}
	});
}

/**
 * 登录成功业务处理
 * 备注:
 * 1.首次登录/是否需要完善个人信息 返回信息中edit为true代表用户已经更新过信息
 * 2.保存用户上一次成功登陆所输入的值.该值可能是手机号、邮箱、账号
 * 
 * @param {Object} data 服务端返回的业务数据
 */
function didLoginSuccess(data) {
    $$('.input-password').val(null);
    localStorage.lastInputUserName = $$('.user-name').val();
    
    localStorage.userId = data.id;
	localStorage.username = data.username;
	localStorage.token = data.token;
	localStorage.isLogin = true;
	localStorage.infoIsUpdated = data.edit;

	if(data.edit) {
        pager.toIndexPage();
	} else {
        pager.toUpdateInfoPage();
	}
}

//首次按键，提示'再按一次退出应用'
var firstClick = null;
eminBack = function() {
    if(!firstClick) {
        firstClick = new Date().getTime();
        EminBridge.toast('再按一次退出应用');
        setTimeout(function() {
            firstClick = null;
        }, 1000);
    } else {
        if(new Date().getTime() - firstClick < 1000) {
            EminBridge.pluginRuntime.exit();
        }
    }
};
