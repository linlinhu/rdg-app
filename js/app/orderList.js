
var limitNo = 10, pageNo = 1, maxItems = 0;//最大显示数目 ;
var listData = [];

function eminReady() {
   viewDidLoad();
}

// 异步验证
//$$(".test1").on('click', function() {
//  console.log('### clicked');
//});

function viewDidLoad() {
    myApp.showPreloader('正在为您加载数据');
    setTimeout(function(){
        willGetData();
    }, 250);
}

/**
 * 监听事件,从待收货->待收货详情->扫码->提交成功->已收货详情->返回到本界面的情形
 * 应当重新刷新界面,因为可能公司其他的用户也收了货.列表不能简单得去掉自己收获的那一行
 */
function onRefreshView() {
    // 数据重置
    listData = []; //清空数组
    limitNo = 10;
    pageNo = 1;
    viewDidLoad();
}

function willGetData() {
    var options = {
        page: pageNo,
        limit: limitNo
    };
    getOrderListData(options);
    //renderList('orderList', DemoData.orderListData());
    //bindClickEvent();
}

/**
 * 从服务器端获取待收货清单
 * 备注:如果本地无ecmId,则应当再发起请求获取
 * 
 * @param {Object} data {page:xx,limit:xx}
 */
function getOrderListData(data) {
    var ecmId = localStorage.ecmId;
    console.log('## getOrderListData ecmId:' + ecmId);
    EminBridge.ohr.request({
        url: serviceConfig.orderListUrl,
        path: serviceConfig.orderListPath,
        data: data,
        type: 'get',
        header: {
            ecmId:ecmId
        },
        success: function(result) {
            console.log('## get order list result:\n' + JSON.stringify(result));
            myApp.hidePreloader();
            if(result.success) {
                didGetOrderListSuccess(result.result);
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

function didGetOrderListSuccess(data) {
    var list = data.resultList;
    maxItems  = data.totalCount;
    $$('.infinite-scroll-preloader').addClass('hide');
    if(list.length > 0){
        listData.push.apply(listData,list);
    }
    renderList('orderList', listData);
    bindClickEvent();
}

//给订单绑定点击事件
function bindClickEvent(){
    $$('.card').on('click', function() {
        console.log('### 点击物流单:' + this.dataset.id);
        var logisticsSn = this.dataset.id;
        pager.toOrderDetailPage({
            url: 'pages/orderDetails.html',
            id: 'orderDetails',
            extras: {
                logisticsSn: logisticsSn
            }
        });
    });
}

//上拉加载
infiniteScroll(maxItems, orderListInfiniteScroll)
function orderListInfiniteScroll(maxItems) {
    loading = false;
    if($$('#orderList-view .card').length >= maxItems) {
        myApp.detachInfiniteScroll($$('.infinite-scroll'));
        $$('.infinite-scroll-preloader').remove();
        /*$$('.infinite-scroll-preloader').addClass('hide')*/
        return;
    }
    pageNo += 1;
    options = {
        page: pageNo,
        limit: limitNo
    }
    getOrderListData(options);
}

//下拉刷新
refresh(orderListRefresh);
function orderListRefresh() {
    setTimeout(function() {
//      var options = {
//          page: 1,
//          limit: limitNo
//      };
//      getOrderListData(options);
        myApp.pullToRefreshDone();
    }, 1000);   
}

$$('.icon-back').on('click', function() {
    eminBack();
});

eminBack = function() {
    pager.back();
};
