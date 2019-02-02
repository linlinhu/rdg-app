
var searchList = [], searchPageNo = 1, searchLimitNo = 99, searchMaxItems = 0;
var listData=[], pageNo = 1, limitNo = 10, maxItems = 0;

function eminReady() {
    console.log('## search page load');
}

eminBack = function() {
    pager.back();
};

function getReceiptListData(data) {
    var ecmId = localStorage.ecmId;
    console.log('## getReceiptListData ecmId:' + ecmId + ' params:' + JSON.stringify(data));
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

$$('.receiptSearch .search').on('click',function(){
    search();
});


// 键盘enter事件(搜索按钮)
document.onkeydown = function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode == 13) {
        $$('input[type = "search"]').blur();
        search();
    }
};

//搜索功能
function search() {
    var keyword = $$('input[type = "search"]').val();
    var options = {
        keyword:keyword,
        page: searchPageNo,
        limit:searchLimitNo
    };
    myApp.showPreloader();
    setTimeout(function() {
        searchFromServer(options)
    }, 200);
    //renderList('receiptList',result);
}

function bindClickEvent() {
    $$('.receiptListContainer .card').on('click', function() {
        console.log('## 查询结果列表 点击物流单号:' + this.dataset.id);
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
function receiptListRefresh() {
    //模拟加载效果
    setTimeout(function() {
        myApp.pullToRefreshDone();
    }, 1000);   
}

/**
 * 通过关键字查询收货信息
 * 关键字可以是:收货单号,发货方名称，货品名称，货品特性
 * 
 * @param {Object} data {page:xx,limit:xx,keyword:xx}
 * 
 */
function searchFromServer(data) {
    var ecmId = localStorage.ecmId;
    console.log('## searchFromServer ecmId:' + ecmId);
    EminBridge.ohr.request({
        url: serviceConfig.searchOrderUrl,
        path: serviceConfig.searchOrderPath,
        data: data,
        header: {
            ecmId: ecmId
        },
        type: 'get',
        success: function(result) {
            myApp.hidePreloader();
            console.log('## 查询服务端结果:\n' + JSON.stringify(result));
            if(result.success) {
                var list = result.result.resultList;
                /* 
                if(list.length > 0){
                    searchList.push.apply(searchList, list);
                }*/
                renderList('receiptList', list);
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
