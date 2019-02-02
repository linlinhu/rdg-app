//跳转到用户中心界面
$$('.toolbar-inner .personal').on('click', function() {
    pager.toPersonalCenterPage();
})
//跳转到待开发界面
$$('.toolbar-inner .wait').on('click', function() {
    pager.toWaitPage();
})