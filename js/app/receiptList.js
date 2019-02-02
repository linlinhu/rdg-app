

var listData=[], pageNo = 1, limitNo = 10, maxItems = 0;

function eminReady() {
    myApp.showPreloader('正在为您加载数据');
    setTimeout(function() {
        willGetData();
    }, 200);
}

eminBack = function() {
    pager.back();
};

function willGetData() {
    var options = {
        page: pageNo,
        limit: limitNo
    };
    getReceiptListData(options);
    //renderList('receiptList', DemoData.orderListData());
    //bindClickEvent();
}

/**
 * 获取已收货清单列表
 * 备注:如果本地无ecmId,则应当再发起请求获取
 * 
 * @param {Object} data {page:xx,limit:xx}
 */
function getReceiptListData(data) {
    var ecmId = localStorage.ecmId;
    console.log('## getReceiptListData ecmId:' + ecmId + ' \nparams:' + JSON.stringify(data));
    EminBridge.ohr.request({
        url: serviceConfig.receivedListUrl,
        path: serviceConfig.receivedListPath,
        data: data,
        header: {
            ecmId: ecmId
        },
        type: 'get',
        success: function(result) {
            myApp.hidePreloader();
            console.log('## 已收货列表:\n' + JSON.stringify(result));
            if(result.success) {
                var list = result.result.resultList;
                maxItems  = result.result.totalCount;
                $$('.infinite-scroll-preloader').addClass('hide');
                if(list.length > 0){
                    listData.push.apply(listData, list);
                }
                renderList('receiptList', listData);
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

$$('.icon-back').on('click', function() {
    eminBack();
});

//展示搜素界面
$$('.receiptTitle .right i').on('click', function() {
    var item = $$('.receiptTitle .right i');
    item.disabled = 'disabled';
    setTimeout(function() {
        item.disabled = '';
        pager.toReceiptSearchPage();
    }, 100);
});

function bindClickEvent() {
    $$('.receiptListContainer .card').on('click', function() {
        console.log('## 已收货列表 点击物流单号:' + this.dataset.id);
        var logisticsSn = this.dataset.id;
        pager.toReceiptDetailPage({
            url: 'pages/receiptDetails.html',
            id: 'receiptDetails',
            extras: {
                logisticsSn: logisticsSn,
                fromScanSubmit: false
            }
        });
    });
}

//上拉加载
infiniteScroll(maxItems,receiptListInfiniteScroll)
function receiptListInfiniteScroll(maxItems) {
    loading = false;
    if(listData.length >= maxItems) {
        myApp.detachInfiniteScroll($$('.infinite-scroll'));
        $$('.infinite-scroll-preloader').remove();
        /*$$('.infinite-scroll-preloader').addClass('hide')*/
        return;
    }

    pageNo += 1;
    var options = {
        page: pageNo,
        limit: limitNo
    };
    getReceiptListData(options);
}

//下拉刷新,需要服务端接口支持,查询最新的数据
refresh(receiptListRefresh)
function receiptListRefresh(){
    //模拟加载效果
    setTimeout(function() {
        myApp.pullToRefreshDone();
    }, 1000);   
}

