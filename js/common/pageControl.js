var pager = function() {
    
    var action = {
        back :function() {
            EminBridge.back();  
        },
        openWindow : function(options) {
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 1.跳转登录界面
        toLoginPage : function(ops) {
            var defaultOption = {
                url: 'login.html',
                id: 'login'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 2.跳转到[完善个人信息]界面
        toUpdateInfoPage : function(ops) {
            var defaultOption = {
                url: 'pages/userMsg.html',
                id: 'userMsg'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 3.跳转到首页
        toIndexPage : function(ops) {
            var defaultOption = {
                url: 'index.html',
                id: 'index'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 4.跳转到[待收货清单列表]界面
        toOrderListPage : function(ops) {
            var defaultOption = {
                url: 'pages/orderList.html',
                id: 'orderList',
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 5.跳转到[待收货清单详情]界面
        toOrderDetailPage : function(ops) {
            var defaultOption = {
                url: 'pages/orderDetails.html',
                id: 'orderDetails'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 6.跳转到[已收货列表]界面
        toReceiptListPage : function(ops) {
            var defaultOption = {
                url: 'pages/receiptList.html',
                id: 'receiptList'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 7.跳转到[已收货详情]界面
        toReceiptDetailPage : function(ops) {
            var defaultOption = {
                url: 'pages/receiptDetails.html',
                id: 'receiptDetails'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 8.跳转到扫码界面
        toScanPage : function(ops) {
            var defaultOption = {
                url: 'pages/scanList.html',
                id: 'scanList'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 9.跳转到收货查询界面
        toReceiptSearchPage : function(ops) {
            var defaultOption = {
                url: 'pages/search.html',
                id: 'search'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 11.跳转到个人中心界面
        toPersonalCenterPage : function(ops) {
            var defaultOption = {
                url: 'pages/personalCenter.html',
                id: 'personalCenter'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        },
        // 12.跳转到待开发界面
        toWaitPage : function(ops) {
            var defaultOption = {
                url: 'pages/wait.html',
                id: 'wait'
            };
            var options = (ops == null) ? defaultOption : ops;
            EminBridge.openWindow(JSON.stringify(options));
        }
    };
    
    return action;
}();