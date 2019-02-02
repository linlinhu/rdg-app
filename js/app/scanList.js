var statisticData = {},
    scanList = [];
var pageParam;
var scanListModel = null;
var tmpBarcode;

function eminReady() {
    pageParam = JSON.parse(EminBridge.pluginWebview.getExtras());
    console.log('### 发货单,物流单信息:' + JSON.stringify(pageParam));
    setTimeout(function() {
        startBarcode(); // 加载二维码扫描控件
    }, 200);

    setTimeout(function() {
        getLocalScanList(); // 从数据库中获取上次未提交的扫码记录
    }, 200);
}

eminBack = function() {
    pager.back();
};

// 开启摄像头进行扫码
function startBarcode() {
    console.log('## startBarcode device width:' + window.screen.width);
    var options = {
        left: 0, // 区域的最左边距离屏幕左边的距离
        top: 90, // 区域的最上边距离屏幕顶端的距离
        right: 720, // 区域的最右边距离屏幕左边的距离
        bottom: 580 // 区域的最下边距离屏幕顶端的距离
    };
    var callbackName = "onBarcodeScan";
    EminBridge.pluginBarcode.loadBarcodeView(options, callbackName);
}

// 扫码解析成功的回调处理
function onBarcodeScan(result) {
    var isRepeat = false;
    tmpBarcode = result;
    console.log('## barcode result:' + result);
    /* 判断是否重复 */
    for(var i = 0; i < scanList.length; i++) {
        if(scanList[i].code == result) {
            var posttion = getElementOffset($$('#scanList-view li')[i]);
            $$('#scanList-view li p').removeClass("color-red");
            $$('.scanListContainer .below').scrollTop(posttion.top - 31);
            $$('#scanList-view li p')[i].setAttribute("class", "color-red");
            isRepeat = true;
            break;
        }
    }
    if(!isRepeat) {
        var options = {
            ecmId: pageParam.deliverEcmId,
            code: result
        };
        myApp.showPreloader('正在为您查询');
        setTimeout(function() {
            queryProduct(options);
        }, 200);
    }

}

//动态渲染扫描模板
function render(data) {
    if(data.length > 0) {
        laodTemplate('scanList', Template7.templates.scanListTemplate(data));
        $$('.scanListContainer .below').scrollTop($$('.scanListContainer .below')[0].scrollHeight);
        $$('.scanListContainer li .remove').on('click', function() {
            var removeCode = $$(this).parent().attr('data-id');
            for(var i = 0; i < scanList.length; i++) {
                if(scanList[i].code == removeCode) {
                    scanList.splice(i, 1);
                    break;
                }
            }
            render(scanList);
        });
    } else {
        $$('.scanListContainer ul').html('<p class="tip">请用手机扫描货品上方二维码</p>');
    }
    // 保存到数据库
    setTimeout(function() {
        saveScanList(data);
    }, 200);
}

// 返回
$$('.icon-back').on('click', function() {
    eminBack();
});

// 开灯/关灯
var isOn = false;
$$('.open-flash').on('click', function() {
    console.log('## will setting flash light current state:' + isOn);

//  var onOrOff = isOn ? 'off' : 'on';
//  try {
//      EminBridge.pluginBarcode.setFlashLight(onOrOff);
//      isOn = !isOn;
//  } catch(e) {}

    if(isOn) {
        EminBridge.pluginBarcode.setFlashLight('off');
        $$('.open-flash i').addClass('bg-gray');
        $$('.open-flash i').removeClass('bg-lightgray');
        
        isOn = false;
    } else {
        EminBridge.pluginBarcode.setFlashLight('on');
        $$('.open-flash i').addClass('bg-lightgray');
        $$('.open-flash i').removeClass('bg-gray');
        isOn = true;
    }
});

//重置
$$('.scanListContainer .reset').on('click', function() {
    resetAction();
});

function resetAction() {
    scanList = [];
    statisticData = {
        list: [],
        count: 0
    };
    render(scanList);
}

//扫码解析成功后添加数据
function add(data, code) {
    var logisticsSn = data.logisticsSn,
        sn = data.sn,
        type1 = '',
        type2 = '';
    /* 判断货品是否属于该物流单 */
    if(pageParam.logisticsSn == logisticsSn) {
        for(var i = 0; i < data.prdFeatures.length; i++) {
            var prdFeature = data.prdFeatures[i]
            if(prdFeature.type == 1) {
                type1 += (prdFeature.value + '&nbsp');
            } else {
                type2 += ('×' + prdFeature.value + prdFeature.prdFeatureTemplateName + '&nbsp');
            }
        }
        data.msg = type1 + type2;
        scanList.push({
            code: code,
            good: data
        });
        render(scanList);
    } else {
        EminBridge.toast('此货品不属于本次待收货单');
    }
}

// '完成'收货事件
$$('.scanListContainer .ok').on('click', function() {
    // EminBridge.pluginBarcode.stopScan();
    EminBridge.pluginBarcode.pauseScan(5);
    statisticData = {
        list: [],
        count: 0
    };
    var list = '';
    for(var i = 0; i < scanList.length; i++) {
        statisticData = statistic(scanList[i], statisticData);
    }
//  if(statisticData.count < 1) {
//      EminBridge.toast('没有要提交的货品,请先扫码');
//      return;
//  }
    
    for(var i = 0; i < statisticData.list.length; i++) {
        list += '<p>' + (i + 1) + '、 ' + statisticData.list[i].good.name + '&nbsp' + statisticData.list[i].good.msg + '&nbsp' + statisticData.list[i].count + '箱</p>'
    };
    
    list += '<p class="color-red" style="text-align:right;">共' + statisticData.count + '箱</p>';
    var title = '您确定要完成来自<span class="color-red">' + pageParam.deliverName + '</span>的收货吗？'
    myApp.confirm(list, title, function() {
        var netState = EminBridge.pluginNetwork.getNetworkState();
        console.log('### netState:' + netState);
        if(netState == -1) {
            EminBridge.toast('当前无网络可用,暂不能为您提交,您的扫码数据已经为您保存了');
            return;
        }

        // 如果姓名没有,就以手机号码替代
        var realName = localStorage.realName;
        if(TextUtil.isEmpty(realName)) {
            realName = localStorage.mobile;
        }
        //scanList 待处理的扫描结果
        var data = {
            deliverEcmId: pageParam.deliverEcmId, // 发货人ecmId(主体id)
            logisticsSn: pageParam.logisticsSn, // 物流单号
            deliverSn: pageParam.deliverSn, // 发货单号
            goods: scanList, // 收货一览
            receiverPersonName: realName, // 收货人姓名
            receiverPersonPhone: localStorage.mobile, // 收货人手机号
            receiverPersonId: localStorage.userId
        };
        var options = {
            rgStr: data
        };
        myApp.showPreloader('正在为您提交');
        setTimeout(function() {
            submitScanList(options);
        }, 200);

    }, function() {
        console.log('### 点击了取消按钮');
        EminBridge.pluginBarcode.resumeScan();
    });
});

/**
 * 从数据库中获取相应物流单号扫码但未提交的产品列表
 * 1.匹配目标扫码物流单号
 * 2.
 */
function getLocalScanList() {
    scanListModel = new ScanList();
    scanListModel.logisticsSn = pageParam.logisticsSn;
    var records = JSON.parse(EminBridge.orm.search(scanListModel));
    if(records.length > 0) {
        // 记录该模型的id,用户扫码后将覆盖更新该行记录
        scanListModel.id = records[0].id;
        // 获取表记录中的data列的值,渲染到界面
        scanList = JSON.parse(records[0].data);
        render(scanList);
    } else {
        var maxId = EminBridge.orm.getTableMaxId(scanListModel.tableName);
        scanListModel.id = maxId > 0 ? maxId : 1;
    }
    console.log('### scanListModel:' + JSON.stringify(scanListModel));
}

// 保存未提交的扫码列表数据到数据库
function saveScanList(data) {
    scanListModel.lastModifyTime = new Date().getTime();
    scanListModel.data = data;
    scanListModel.logisticsSn = pageParam.logisticsSn;
    var result = EminBridge.orm.save(scanListModel);
}

/**
 * 从数据库中清理已经提交的扫码列表数据
 * 1.做物理删除,可以避免多余的数据增加查询负担
 * 2.如果提交以后,这条记录已经失去存在的价值
 */
function clearScanList() {
    var model = new ScanList();
    model.id = scanListModel.id;
    EminBridge.orm.remove(model);
}

/**
 * 接口:根据扫码结果查询产品信息
 * yong的接口
 * 
 * @param {Object} data
 */
function queryProduct(data) {
    console.log('### query product info param:' + JSON.stringify(data));
    EminBridge.ohr.request({
        url: serviceConfig.queryProductInfoUrl,
        path: serviceConfig.queryProductInfoPath,
        data: data,
        type: 'get',
        success: function(result) {
            myApp.hidePreloader();
            console.log('### barcode product:\n' + JSON.stringify(result));
            if(result.success) {
                add(result.result[0], tmpBarcode);
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

// 接口:提交数据
function submitScanList(data) {
    console.log('### will submit data:\n' + JSON.stringify(data));
    var ecmId = localStorage.ecmId;
    EminBridge.ohr.request({
        url: serviceConfig.submitScanUrl,
        path: serviceConfig.submitScanPath,
        data: data,
        header: {
            ecmId: ecmId
        },
        type: 'post',
        success: function(result) {
            myApp.hidePreloader();
            console.log('### did submit result:\n' + JSON.stringify(result));
            if(result.success) {
                EminBridge.toast('收货已提交成功');
                didSubmitSuccess();
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

function didSubmitSuccess() {
    EminBridge.pluginBarcode.stopBarcode();
    pager.toReceiptDetailPage({
        url: 'pages/receiptDetails.html',
        id: 'receiptDetails',
        extras: {
            logisticsSn: pageParam.logisticsSn,
            fromScanSubmit: true
        }
    });

    setTimeout(function() {
        clearScanList();
    }, 200);
}

//获取节点在有定位的父元素中的相对位置
function getElementOffset(e) {
    var t = e.offsetTop;
    var l = e.offsetLeft;
    var w = e.offsetWidth;
    var h = e.offsetHeight - 1;

    /*while(e=e.offsetParent) { 
        t+=e.offsetTop;
        l+=e.offsetLeft;
    }*/
    return {
        top: t,
        left: l,
        width: w,
        height: h
    }
}