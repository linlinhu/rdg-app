
function eminReady() {
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
}

//信息重置
$$('#userMsgForm .reset').on('click', function() {
    $$('#userMsgForm input').val('');
});

//获取验证码
$$('#userMsgForm .getCode').on('click', function(){
    var formData = myApp.formToJSON('#userMsgForm'),
        mobileReg = /^1[34578]\d{9}$/;
    if(!mobileReg.test(formData.mobile)) {
        myApp.alert('请填写有效手机的号码！', '温馨提示');
    } else {
        getCode({
            id:localStorage.userId,
            mobile:formData.mobile
        })
    }
});

//提交用户信息
$$('#userMsgForm .submit').on('click', function() {
    var formData = myApp.formToJSON('#userMsgForm');
    var mobileReg = /^1[34578]\d{9}$/;

    console.log('formData',formData)
    if(!mobileReg.test(formData.mobile)) {
        myApp.alert('请填写有效手机的号码！', '温馨提示');
    } else if(formData.code && formData.code.trim().length != 4) {
        myApp.alert('请填写验证码', '温馨提示');
    } else {
        willSubmitUserInfo(formData);
    }
});

//注销
$$('.logout a').on('click', function() {
    myApp.confirm('确认退出app吗？', '温馨提示：', function() {
        localStorage.isLogin = false;
        clearLocalUser();
        var viewId = 'login';
        var view = EminBridge.pluginWebview.getWebviewById(viewId);
        if(view == null) {
            pager.toLoginPage();
        } else {
            EminBridge.popToWindow(viewId);
        }
    });
});

function clearLocalUser() {
    localStorage.ecmId = '';
    localStorage.mobile = '';
    localStorage.realName = '';
    localStorage.username = '';
    localStorage.email = '';
}

/**
 * 提交前置事件
 * 将界面原始数据进行处理,如对密码进行MD5加密,包装接口需要的userId
 * 
 * @param {Object} formData 原始表单
 */
function willSubmitUserInfo(formData) {
    var data = {
        id: localStorage.userId,
        mobile: formData.mobile,
        code: formData.code?formData.code:''
    };
    myApp.showPreloader('正在为您提交...');
    setTimeout(function() {
        submitUserInfo(data);
    }, 200);
}

/**
 * 提交用户信息
 * 
 * @param {Object} data 满足服务端接口的参数JSON
 */
function submitUserInfo(data) {
    console.log('## submit User Info:' + JSON.stringify(data));
    EminBridge.ohr.request({
        url: serviceConfig.bindMobileUrl,
        path: serviceConfig.bindMobilePath,
        data: data,
        type: 'post',
        success: function(result) {
            console.log('## submit user info result:\n' + JSON.stringify(result));
            myApp.hidePreloader();
            if(result.success) {
                localStorage.infoIsUpdated = true;
                EminBridge.toast('手机号码绑定成功');
                pager.toIndexPage();
            } else {
                var errCode = result.code;
                var errMsg = serviceConfig.getErrorMsg(errCode);
                myApp.alert(errMsg, '温馨提示');
            }
        },
        error: function(e) {
            myApp.hidePreloader();
            EminBridge.toast('网络不给力');
        }
    });
}

function getCode(data){
    EminBridge.ohr.request({
        url: serviceConfig.sendSMSUrl,
        path: serviceConfig.sendSMSPath,
        data: data,
        type: 'post',
        success: function(result) {
            var num = 60;
            $$('#userMsgForm .getCode').addClass('hide');
            $$('#userMsgForm .num').removeClass('hide');
            $$('#userMsgForm .num').html(num + ' s');
            var timer = setInterval(function(){
                num -= 1;
                if(num < 1){
                    $$('#userMsgForm .getCode').removeClass('hide');
                   $$('#userMsgForm .num').addClass('hide');
                    clearInterval(timer)
                } else {
                    $$('#userMsgForm .num').html(num + ' s');
                }
            },1000) 
        },
        error: function(e) {
            myApp.hidePreloader();
            EminBridge.toast('网络不给力');
        }
    });
}
