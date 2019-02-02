
//初始化
function eminReady() {
    myApp.showPreloader('');
    setTimeout(function() {
        $$('.panel-left .username').html(localStorage.username);
        getUserDetail(localStorage.userId);
        
    }, 200);
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

/**
 * 获取用户信息并且保存,尤其是用户所属的主体id(ecmId)
 * 之后的大部分业务都需要ecmId
 * 
 * @param {Object} uid 登录时服务端返回的用户id
 */
function getUserDetail(uid) {
    console.log('## getUserDetail for user id:' + uid);
    EminBridge.ohr.request({
        url: serviceConfig.userDetailUrl,
        path: serviceConfig.userDetailPath,
        data: {
            id: uid
        },
        type: 'get',
        success: function(result) {
            myApp.hidePreloader();
            console.log('## getUserDetail result:' + JSON.stringify(result));
            if(result.success) {
                didGetUserDetailSuccess(result.data);
            } else {}
        },
        error: function(e) {
            myApp.hidePreloader();
            EminBridge.toast('网络不给力');
        }
    });
}

function didGetUserDetailSuccess(data) {
    /* 保存数据到本地存储 localStorage */
    saveLocalUser(data);
    /* 
     * 获取待收货条数以显示在界面上
     * 需要在获取详情成功更新ecm id之后再发起获取数量,否则会出现切换用户后ecmid是上一次的情况
     */
    getOrderCount();
}

function saveLocalUser(data) {
    console.log('## should save ecmId:' + data.ecmId);
    localStorage.ecmId = data.ecmId;
    localStorage.mobile = data.mobile;
    localStorage.realName = data.realName;
    localStorage.username = data.username;
    localStorage.email = data.email;
}

//跳转到待收货页面
$$('.index-cotainer .above').on('click', function() {
    pager.toOrderListPage();
})
//跳转到已收货页面
$$('.index-cotainer .below').on('click', function() {
    pager.toReceiptListPage();
})

//获取待收货的列表
function getOrderCount() {
    var ecmId = localStorage.ecmId;
    console.log('## getOrderCount for ecmId:' + ecmId);
    EminBridge.ohr.request({
        url: serviceConfig.notReceivedCountUrl,
        path: serviceConfig.notReceivedCountPath,
        data: {},
        type: 'get',
        header: {
            ecmId: ecmId
        },
        success: function(result) {
            console.log('## get OrderCount:' + JSON.stringify(result));
            myApp.hidePreloader();
            if(result.success) {
                var noReceivedNum = result.result;
                updateNotReceiveCount(noReceivedNum);
            }
        },
        error: function(e) {
            myApp.hidePreloader();
            EminBridge.toast('网络不给力');
        }
    });
}

function updateNotReceiveCount(count) {
    if(count > 0) {
        $$('.above span').removeClass('hide');
        $$('.above span').html(count);
    } else {
        $$('.above span').addClass('hide');
    }
}

/**
 * 扫码收货成功后,回调该方法更新界面的数字
 */
function onReceiveSuccess() {
    console.log('### will update not receive count');
//  var count = Number($$('.above span').html()) - 1;
//  updateNotReceiveCount(count);
    setTimeout(function() {
        getOrderCount();    
    }, 200);
}

function onNetStateChange(e) {
    console.log("## onNetStateChange:" + JSON.stringify(e));
    var state = Number(JSON.parse(e).type);
    switch(state) {
        case -1:
            console.log("## 无网络");
            break;
        case 0:
            console.log("## 当前使用的是移动蜂窝煤网络");
            break;
        case 1:
            console.log("## 当前使用的是wifi网络");
            break;
        default:
            break
    }
}

