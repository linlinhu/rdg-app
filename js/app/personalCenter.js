
function eminReady() {
    myApp.showPreloader('');
    setTimeout(function() {
        init();//界面初始化    
    }, 200);
}

eminBack = function() {
    pager.back();
};

var userDetail;
var edit = function() {
    var action = {
        nickname: function(ops) {
            var option = {
                title: '编辑用户昵称',
                name: 'nickname',
                value: ops
            };
            edit.popup(option);
            $$('.personalCenterPopup .save').on('click',function(){
                var formDate =  edit.getFormData(),
                    isValidate = false;
                formDate.nickname = formDate.nickname.trim();
                isValidate = edit.validate({
                    value:formDate.nickname,
                    reg:/^\S[\s\S]{0,18}\S$/,
                    errorMsg:'昵称长度为2-20个字符'
                });
               
                if(isValidate) {
                    save.personalMsg({
                        id:localStorage.userId,
                        key: "nickname",
                        value: formDate.nickname
                    });
                }
            });
        },
        realName: function(ops) {
            var option = {
                title: '编辑真实姓名',
                name: 'realName',
                value: ops
            };
            edit.popup(option);
            $$('.personalCenterPopup .save').on('click',function(){
                var formDate =  edit.getFormData();
                formDate.realName = formDate.realName.trim(),
                    isValidate
                var isValidate = edit.validate({
                    value:formDate.realName,
                    reg:/^\S[\s\S]{0,18}\S$/,
                    errorMsg:'真实姓名为2-20个字符'
                });
                
                if(isValidate) {
                    save.personalMsg({
                        id:localStorage.userId,
                        key: "realName",
                        value: formDate.realName
                    });
                }
            });
        },
        mobile: function(ops) {
            var option = {
                title: '编辑手机号码',
                name: 'mobile',
                value: ops
            };
            edit.popup(option);
             $$('.personalCenterPopup .save').on('click',function(){
                var formDate =  edit.getFormData(),
                    isValidate = false;
                formDate.mobile = formDate.mobile.trim();
                isValidate = edit.validate({
                    value:formDate.mobile,
                    reg:/^1[34578]\d{9}$/,
                    errorMsg:'请输入有效的手机号码'
                });
                
                if(isValidate) {
                    save.personalMsg({
                        id:localStorage.userId,
                        key: "mobile",
                        value: formDate.mobile
                    });
                }
            });
        },
        email: function(ops) {
            var option = {
                title: '编辑电子邮箱',
                name: 'email',
                value: ops
            };
            edit.popup(option);
             $$('.personalCenterPopup .save').on('click',function(){
                var formDate =  edit.getFormData(),
                    isValidate = false;
                formDate.email = formDate.email.trim();
                isValidate = edit.validate({
                    value:formDate.email,
                    reg:/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
                    errorMsg:'请输入有效的电子邮箱'
                });
                
                if(isValidate) {
                    save.personalMsg({
                        id:localStorage.userId,
                        key: "email",
                        value: formDate.email
                    });
                }
            });
        },
        gender: function(ops) {
            var option = {
                title: '编辑用户性别',
                name: 'gender',
                value: ops
            };
            edit.genderPopup(option);
            if(ops == '女'){
                $$('.personalCenterPopup input[value="女"]').attr('checked','checked')
            } else if(ops == '男'){
                $$('.personalCenterPopup input[value="男"]').attr('checked','checked')
            }
            $$('.personalCenterPopup .save').on('click',function(){
                var formDate =  edit.getFormData();
                save.personalMsg({
                    id:localStorage.userId,
                    key: "gender",
                    value: formDate.gender
                });
            });
        },
        password: function(ops) {
            var option = {
                title: '修改密码'
            };
            edit.passwordPopup(option);
            
            setTimeout(function() {
                $$('.personalCenterPopup input[name="oldPassword"]').focus();
            }, 200);
            $$('.personalCenterPopup .save').on('click',function(){
                var formDate =  edit.getFormData(),
                    isValidate = false;
                formDate.oldpassword = formDate.oldPassword.trim();
                formDate.newPassword = formDate.newPassword.trim();
                formDate.rNewPassword = formDate.rNewPassword.trim();
                isValidate = edit.passwordValidate(formDate);
                if(isValidate) {
                    save.password({
                        id: localStorage.userId,
                        oldPassword:md5(formDate.oldpassword),
                        newPassword:md5(formDate.newPassword)
                    });
                }
            });
        },
        popup: function(ops) {
            var popupHTML = '<div class="popup personalCenterPopup">' +
                    '<div class="content-block">' +
                        '<div class="content-block-title">' + ops.title + '</div>' +
                        '<form class="list-block inputs-list">' +
                            '<div class="item-content">' +
                                '<div class="item-inner"> ' +
                                    '<div class="item-input">' +
                                        '<input type="text" name="' + ops.name + '" value="' + ops.value + '"/>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</form>' +
                    '<div class="content-block">' +
                        '<p class="buttons-row">' +
                            '<a href="#" class="button button-raised button-fill color-orange close-popup">取消</a>'+
                            '<a href="#" class="button button-raised button-fill save">确认</a>'+
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
            myApp.popup(popupHTML);
            setTimeout(function() {
                $$('.personalCenterPopup input').val('').focus().val(ops.value);
            }, 200);
            
           
        },
        genderPopup: function(ops) {
           
            var popupHTML = '<div class="popup personalCenterPopup">' +
                    '<div class="content-block">' +
                        '<div class="content-block-title">' + ops.title + '</div>' +
                        '<form class="list-block inputs-list">' +
                            '<ul>' +
                                '<li>' +
                                    '<label class="label-radio item-content">' +
                                        '<input type="radio" name="gender" value="女"/>' +
                                        '<div class="item-media"><i class="icon icon-form-radio"></i></div>' +
                                        '<div class="item-inner">' +
                                            '<div class="item-title">女</div>' +
                                        '</div>' +
                                    '</label>' +
                                '</li>' +
                                '<li>' +
                                    '<label class="label-radio item-content">' +
                                        '<input type="radio" name="gender" value="男"/>' +
                                        '<div class="item-media"><i class="icon icon-form-radio"></i></div>' +
                                        '<div class="item-inner">' +
                                            '<div class="item-title">男</div>' +
                                        '</div>' +
                                    '</label>' +
                                '</li>' +
                            '<ul>' +
                        '</form>' +
                    '<div class="content-block">' +
                        '<p class="buttons-row">' +
                            '<a href="#" class="button button-raised button-fill color-orange close-popup">取消</a>'+
                            '<a href="#" class="button button-raised button-fill save">确认</a>'+
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
            myApp.popup(popupHTML);
        },
        passwordPopup: function(ops) {
            var popupHTML = '<div class="popup personalCenterPopup">' +
                    '<div class="content-block">' +
                        '<div class="content-block-title">' + ops.title + '</div>' +
                        '<form class="list-block inputs-list">' +
                            '<ul>' +
                                '<li>' +
                                    '<div class="item-content">' +
                                        '<div class="item-media"><i class="icon material-icons">lock</i></div>' +
                                        '<div class="item-inner">' +
                                            '<div class="item-input">' +
                                                '<input type="password" name="oldPassword" placeholder="原密码" />' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<div class="item-content">' +
                                        '<div class="item-media"><i class="icon material-icons">lock</i></div>' +
                                        '<div class="item-inner">' +
                                            '<div class="item-input">' +
                                                '<input type="password" name="newPassword" placeholder="新密码" />' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<div class="item-content">' +
                                        '<div class="item-media"><i class="icon material-icons">lock</i></div>' +
                                        '<div class="item-inner">' +
                                            '<div class="item-input">' +
                                                '<input type="password" name="rNewPassword" placeholder="再次输入新密码" />' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</li>' +
                            '</ul> ' +
                        '</form>' +
                    '<div class="content-block">' +
                        '<p class="buttons-row">' +
                            '<a href="#" class="button button-raised button-fill color-orange close-popup">取消</a>'+
                            '<a href="#" class="button button-raised button-fill save">确认</a>'+
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
            myApp.popup(popupHTML);
        },
        validate: function(ops){
            var isValidate = false;
            if(ops.reg.test(ops.value)){
               isValidate = true;
            } else {
                myApp.alert(ops.errorMsg,'温馨提示');
            }
            return isValidate;
        },
        passwordValidate: function(ops){
            var isValidate = false,
                passwordReg = /^[0-9a-zA-Z]{6,20}$/;
            if(!passwordReg.test(ops.oldPassword)){
                myApp.alert('原密码由数字、字母组成，长度为6-20','温馨提示');
            } else if(!passwordReg.test(ops.newPassword)){
                myApp.alert('新密码由数字、字母组成，长度为6-20','温馨提示');
                
            } else if(ops.newPassword != ops.rNewPassword){
                myApp.alert('两次输入的密码不一致','温馨提示');
            } else {
                isValidate = true
            }
            
            return isValidate;
        },
        getFormData: function(){
            var formData = myApp.formToJSON('.personalCenterPopup form');
            return formData;
        }
    };
    return action;
}();

var options = null;
var save = function(){
    var action  = {
        password: function(ops){
            console.log('## modify password:' + JSON.stringify(ops));
            EminBridge.ohr.request({
                url: serviceConfig.modifyPasswordUrl,
                path:serviceConfig.modifyPasswordPath,
                data:ops,
                type:'post',
                success: function(result) {
                    myApp.hidePreloader();
                    if(result.success) {
                        EminBridge.toast('密码修改成功');
                        myApp.closeModal();
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
        },
        personalMsg: function(ops){
            options = ops;
            EminBridge.ohr.request({
                url: serviceConfig.submitPersonalMsgUrl,
                path:serviceConfig.submitPersonalMsgPath,
                data:options,
                type:'post',
                success: function(result) {
                    myApp.hidePreloader();
                    if(result.success) {
                        $$('a[name="' + options.key + '"] .item-title').html(options.value);
                        EminBridge.toast('编辑成功');
                        myApp.closeModal();
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
    };
    return action;  
}();

$$('.icon-back').on('click', function() {
    eminBack();
});

$$('a[name="nickname"]').on('click', function() {
    var value = $$('a[name="nickname"] .item-title').html();
    $$('a[name="nickname"]').attr('disabled','disabled');
    edit.nickname(value);
    removeDisabled('nickname');
});

$$('a[name="realName"]').on('click', function() {
    var value = $$('a[name="realName"] .item-title').html();
     $$('a[name="realName"]').attr('disabled','disabled');
    edit.realName(value);
    removeDisabled('realName')
});

$$('a[name="mobile"]').on('click', function() {
    var value = $$('a[name="mobile"] .item-title').html();
    $$('a[name="mobile"]').attr('disabled','disabled');
    edit.mobile(value);
    removeDisabled('mobile')
});

$$('a[name="email"]').on('click', function() {
    var value = $$('a[name="email"] .item-title').html();
    $$('a[name="email"]').attr('disabled','disabled');
    edit.email(value);
    removeDisabled('email')
});

$$('a[name="gender"]').on('click', function() {
    var value = $$('a[name="gender"] .item-title').html();
    $$('a[name="gender"]').attr('disabled','disabled');
    edit.gender(value);
    removeDisabled('gender')
});

$$('a[name="password"]').on('click', function() {
    $$('a[name="password"]').attr('disabled','disabled');
    edit.password();
    removeDisabled('password')
});

$$('.personalCenterContainer .img').on('click', function () {
    
    var buttons = [
        {
            text: '拍照',
            bold: true,
            onClick: function () {
                myApp.alert('此处应该调用相机');
            }
        },
        {
            text: '从相册选择照片',
            onClick: function () {
                myApp.alert('此处应该打开相册');
            }
        }
    ];
    myApp.actions(buttons);
});

//退出
$$('.logout a').on('click',function(){
    logout();
})
function logout() {
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
}
function clearLocalUser() {
    localStorage.ecmId = '';
    localStorage.mobile = '';
    localStorage.realName = '';
    localStorage.username = '';
    localStorage.email = '';
}

function init(){
    EminBridge.ohr.request({
        url: serviceConfig.getUserDetailUrl,
        path:serviceConfig.getUserDetailPath,
        data:{
            id: localStorage.userId
        },
        type:'get',
        success: function(result) {
            console.log('## personnal center init result:' + JSON.stringify(result));
            myApp.hidePreloader();
            if(result.success) {
                userDetail = result.data;
                $$('span[name="account"] .user-name').html(userDetail.username);
                $$('a[name="nickname"] .item-title').html(userDetail.nickname);
                $$('a[name="realName"] .item-title').html(userDetail.realName);
                $$('a[name="gender"] .item-title').html(userDetail.gender);
                $$('a[name="mobile"] .item-title').html(userDetail.mobile);
                $$('a[name="email"] .item-title').html(userDetail.email);
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

function removeDisabled(name){
    setTimeout(function() {
        $$('a[name="'+ name +'"]').removeAttr('disabled');
    }, 100);
}
