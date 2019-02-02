
var pageParam = {};
function eminReady() {
    myApp.showPreloader('正在为您加载数据');
    setTimeout(function() {
        pageParam = JSON.parse(EminBridge.pluginWebview.getExtras());
        willGetData();
    }, 200);
}

/**
 * 查询已收货详情前置事件,组织接口所需数据
 * 物流单号从上级界面列表项点击传入
 */
function willGetData() {
    var options = {
        logisticsSn : pageParam.logisticsSn
    };
    getReceivedDetail(options);
    //renderDetails('receiptDetails', DemoData.orderDetailData());
}

/**
 * 查询已收货详情
 * 
 * @param {Object} data {logisticsSn:物流单号}
 */
function getReceivedDetail(data) {
    var ecmId = localStorage.ecmId;
    console.log('## getReceivedDetail ecmId:' + ecmId);
    EminBridge.ohr.request({
        url: serviceConfig.receivedDetailUrl,
        path: serviceConfig.receivedDetailPath,
        data: data,
        header: {
            ecmId:ecmId
        },
        type: 'get',
        success: function(result) {
            myApp.hidePreloader();
            console.log('== got received detail result:\n' + JSON.stringify(result));
            if(result.success) {
                renderDetails('receiptDetails', result.result);
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

/**
 * 如果是从扫码收货提交成功后过来的,那么返回index界面;
 * 否则从正常流程过来的,则返回上一级
 */
$$('.icon-back').on('click', function() {
    eminBack();
});

eminBack = function() {
    if(pageParam.fromScanSubmit) {
        console.log('## back from scan submit');
        EminBridge.pluginWebview.invokeMethod('index', 'onReceiveSuccess');
//      EminBridge.popToWindow('index');
        EminBridge.pluginWebview.invokeMethod('orderList', 'onRefreshView');
        EminBridge.popToWindow('orderList');
    } else {
        pager.back();
    }
};
