
/*renderDetails('orderDetails', DemoData.orderDetailData());
bindClickEvent()*/
function eminReady() {
    myApp.showPreloader('正在为您加载数据');
    setTimeout(function() {
        willGetData();
    }, 200);
}

function willGetData() {
    var pageParam = JSON.parse(EminBridge.pluginWebview.getExtras());
    var options = {
        logisticsSn : pageParam.logisticsSn
    }
    getOrderDetail(options);
}

/**
 * (以物流单号)查询待收货订单的详情
 * 
 * @param {Object} data {logisticsSn:xxx}
 */
function getOrderDetail(data) {
    var ecmId = localStorage.ecmId;
    EminBridge.ohr.request({
        url: serviceConfig.orderDetailUrl,
        path: serviceConfig.orderDetailPath,
        data: data,
        header: {
            ecmId:ecmId
        },
        type: 'get',
        success: function(result) {
            myApp.hidePreloader();
            console.log('== got order detail result:\n' + JSON.stringify(result));
            if(result.success) {
                renderDetails('orderDetails', result.result);
                bindClickEvent();
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
function bindClickEvent(){
    $$('.orderDetailsContainer .button').on('click', function() {
        // 摄像头权限检查
        var isPermit = EminBridge.pluginPermission.check('Camera');
        console.log('=== camera permission:' + isPermit);
        if(isPermit == 'true') {
            pager.toScanPage({
                url: 'pages/scanList.html',
                id: 'scanList',
                extras: {
                    logisticsSn: $$('.logisticsSn').html(),
                    deliverSn: $$('.deliverSn').html(),
                    deliverEcmId: $$('.deliver').attr('data-deliverecmid'),
                    deliverName: $$('.deliver').attr('data-delivername')
                }
            });
        } else {
            myApp.alert('app需要您的同意才能访问相机,请到系统设置中配置"允许"再试.', '需要相机访问权限');
        }
    });
}

$$('.icon-back').on('click', function() {
    eminBack();
});

eminBack = function() {
    pager.back();
};
