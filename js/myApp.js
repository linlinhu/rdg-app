
/**
 * 渲染模板
 * moduleName 模块名称
 * html 用Template7.templates.orderListTemplate(data)方法渲染出来的HTML，需要注意的是 orderListTemplate为模板id
 */
function laodTemplate(moduleName, html) {
    $$("#"+ moduleName + "-view").html(html);
}

/**
 * 渲染列表
 * moduleName 模块名称
 * data 待渲染的数据
 * type 1：首次加载，2：下拉加载
 */
function renderList(moduleName, data ,type) {
    if(data.length <= 0) {
        laodTemplate(moduleName, '<div class="no-data">暂无数据</div>');
        return;
    }
    switch(moduleName) {
        case 'orderList':
            renderOrderList(data);
            break;
        case 'receiptList':
            renderReceiptList(data);
            break;
        default:
            break;
    }
}

function renderOrderList(data) {
    var orderData = {
        data: []
    };
    for(var i = 0; i < data.length; i++) {
        orderData.data[i] = {
            d: {
                name: data[i].delivers[0].deliverJson.name,
            },
            company: {
                name: data[i].company.name
            },
            carNo: data[i].truck == null ? '' : data[i].truck.carNo,
            goods:[],
            logisticsSn: data[i].logisticsSn
        };
        var goods = data[i].delivers[0].goods;
        orderData.data[i].ceatetime =  data[i].delivers[0].createTime;
        orderData.data[i].deliverSn = data[i].delivers[0].deliverSn;
        orderData.data[i].count = goods.length;
        orderData.data[i].goods = getListGoods(goods);
    }
    laodTemplate('orderList', Template7.templates.orderListTemplate(orderData));
}

function renderReceiptList(data) {
    var orderData = {
        data: []
    };
    for(var i = 0; i < data.length; i++) {
        orderData.data[i] = {
            d: {
                name: data[i].delivers[0].deliverJson.name,
            },
            company: {
                name: data[i].company.name
            },
            carNo: data[i].truck == null ? '' : data[i].truck.carNo,
            goods:[],
            drivers: data[i].company.drivers,
            logisticsSn: data[i].logisticsSn
        };
        var goods = data[i].receives[0].goods;
        orderData.data[i].ceatetime = data[i].receives[0].createTime,
        orderData.data[i].receiveSn = data[i].receives[0].receiveSn;
        orderData.data[i].count = goods.length;
        orderData.data[i].goods = getListGoods(goods);
    }
    laodTemplate('receiptList', Template7.templates.receiptListTemplate(orderData));
}


//获取goods中的数据,统计goods的信息
function getListGoods(data){
    var list =[], temp = 0, msg = '', type1 = '', type2 = '';
    if(data.length > 2) {
        temp = 2;
    } else {
        temp = data.length;
    };
    for(var j = 0; j < temp; j++) {
        type1 = '';
        type2 = '';
        msg = data[j].good.name + '&nbsp;';
        for(var n = 0; n < data[j].good.prdFeatures.length; n++) {
            var prdFeature = data[j].good.prdFeatures[n];
            if(prdFeature.type == 1){
               type1 += (prdFeature.value + '&nbsp');
            } else {
               type2 += ('×'+prdFeature.value);
            }    
        }
        msg = msg + type1 + type2;
        list.push({
            code:data[j].code,
            good:{
                msg: msg
            }
        })  
    };
    if(data.length > 2) {
        list.push({
            good:{
                msg: '......'
            }
        })
    }
    return list;
}

//获取发货单详情
function getDelivers () {
    
}

/**
 * 渲染详情
 * moduleName 模块名称
 * data 待渲染的数据
 */
function renderDetails(moduleName,data) {
    //var goods = [],
    var orderData = {
            goods:[],
            ceatetime:data.delivers[0].createTime,
            company:{
                name:data.company.name,
                logisticsSn:data.logisticsSn
            },
            d: {
                name: data.delivers[0].deliverJson.name
            },
            carNo: data.truck == null ? '' : data.truck.carNo,
            driverName: data.truckDriver.driverName,
            driverMobile: data.truckDriver.driverMobile,
            deliverEcmId: data.delivers[0].deliverJson.id
        },
        statisticData = {
            list:[],
            count:0
        };
    
    if( moduleName == 'orderDetails') {
        var goods = data.delivers[0].goods;
        if(goods != 'undefined' && goods != null && goods.length > 0) {
            orderData.deliverSn = data.delivers[0].deliverSn;
            orderData.deliverPersonName = data.delivers[0].deliverPersonName;
            orderData.deliverPersonPhone = data.delivers[0].deliverPersonPhone;
            orderData.count = goods.length;
            getDetailsGoods(goods,statisticData);
            orderData.goods = statisticData.list;
        }
        laodTemplate('orderDetails', Template7.templates.orderDetailsTemplate(orderData));
    } else if (moduleName == 'receiptDetails') {
        var goods = data.receives[0].goods;
        if(goods != 'undefined' && goods != null && goods.length > 0) {
            orderData.receiverPersonName = data.receives[0].receiverPersonName;
            orderData.receiverPersonPhone = data.receives[0].receiverPersonPhone;
            orderData.endtime =  data.receives[0].createTime;
            orderData.receiveSn = data.receives[0].receiveSn;
            orderData.count = goods.length;
            getDetailsGoods(goods,statisticData);
            orderData.goods = statisticData.list;
        }
        laodTemplate('receiptDetails', Template7.templates.receiptDetailsTemplate(orderData));
    }
}

function getDetailsGoods(data,list) {
    for (var i = 0; i < data.length; i++) {
        var type1 = '', type2 = '', goodsItem = {};
        var msg = data[i].good.name + '&nbsp;';
        for(var n = 0; n < data[i].good.prdFeatures.length; n++) {
            var prdFeature = data[i].good.prdFeatures[n];
            if(prdFeature.type == 1){
               type1 += (prdFeature.value + '&nbsp');
            } else {
               type2 += ('×'+prdFeature.value);
            }    
        }
        msg = msg + type1 + type2;
        goodsItem = {
            code:data[i].code,
            good:{
                sn:data[i].sn,
                msg: msg
            }
        };
        list = statistic(goodsItem,list)
    }
}

/*数据统计
 * item 被统计的每一条数据
 * list 共计结果 {coun：0，list:[]}
 */
function statistic(item, list) {
   var temp = -1;
   list.count += 1;
   for(var i =0; i < list.list.length; i++){
      if(list.list[i].good.sn == item.good.sn) {
         list.list[i].count +=1; 
         temp = i;
      }
   }
   if(temp == -1) {
       item.count = 1;
       list.list.push(item);
   }
   return list;
}

/*下拉刷新
 * callback 回调函数
 */
function refresh(callback){
    $$('.pull-to-refresh-content').on('refresh', function(e) {
        callback()   
    });   
}


/*上拉加载
 * maxItems 最多显示的数目
 * callback 回调函数
 */
var loading = false;
function infiniteScroll(maxItems,callback){
    $$('.infinite-scroll').on('infinite', function() {
        if(loading) return;
        loading = true;
        $$('.infinite-scroll-preloader').removeClass('hide')
        callback(maxItems)
    });
}
