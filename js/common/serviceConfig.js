/**
 * 服务端service相关配置
 * 1.服务器地址配置
 * 2.接口地址与路劲配置
 * 3.错误信息配置
 * 
 * created by Sam 2017/12/12
 */

(function(sc) {
    // 服务器的地址配置
    var dockerIp = 'http://192.168.0.201';
    var dockerPort = '8881';

    var localIp = 'http://192.168.0.202';
    var localPort = '8881';

    var ip = localIp;
    var port = localPort;
    var serverAddress = ip + ":" + port;

    sc.basePath = serverAddress;
    sc.version = '1.0.0';

    // app登录接口
    sc.loginUrl = serverAddress + '/api-user/';
    sc.loginPath = 'clientLogin';

    // 查询用户的详细信息接口
    sc.userDetailUrl = serverAddress + '/api-user/member/user/';
    sc.userDetailPath = 'detail';

    // 完善个人信息接口
    sc.fixUserInfoUrl = serverAddress + '/api-user/member/user/';
    sc.fixUserInfoPath = 'perfect';

    // 获取待收货数量接口
    sc.notReceivedCountUrl = serverAddress + '/api-rdg/rg/';
    sc.notReceivedCountPath = 'findNotReceivedCount';

    // 查询待收货订单列表接口
    sc.orderListUrl = serverAddress + '/api-rdg/li/';
    sc.orderListPath = 'findNotReceivedGoods';

    // 查询待收货订单详情接口
    sc.orderDetailUrl = serverAddress + '/api-rdg/li/';
    sc.orderDetailPath = 'findByLSn';

    // 查询已收货列表接口
    sc.receivedListUrl = serverAddress + '/api-rdg/li/';
    sc.receivedListPath = 'findReceivedGoods';

    // 查询已收货详情接口
    sc.receivedDetailUrl = serverAddress + '/api-rdg/li/';
    sc.receivedDetailPath = 'findByLSn';

    // 搜索已收货列表接口
    sc.searchOrderUrl = serverAddress + '/api-rdg/li/';
    sc.searchOrderPath = 'findByCondition';

    // 根据箱码查询产品信息
    sc.queryProductInfoUrl = serverAddress + '/api-code/';
    //sc.queryProductInfoPath = 'queryProductByCode';
    sc.queryProductInfoPath = 'queryProAndLogiSnByEcmCode'; // 新版本 

    // 提交扫码收货记录接口
    sc.submitScanUrl = serverAddress + '/api-rdg/rg/';
    sc.submitScanPath = 'saveOrUpdateRG';
    
    // 用户信息详情接口
    sc.getUserDetailUrl = serverAddress + '/api-user/member/user/';
    sc.getUserDetailPath = 'detail';
    
    // 个人中心编辑用户信息接口
    sc.submitPersonalMsgUrl = serverAddress + '/api-user/member/user/';
    sc.submitPersonalMsgPath = 'perfectUserInfo';
    
    // 修改密码
    sc.modifyPasswordUrl = serverAddress + '/api-user/member/user/';
    sc.modifyPasswordPath = 'modifyPassword';
    
    // 绑定手机号码
    sc.bindMobileUrl = serverAddress + '/api-user/member/user/';
    sc.bindMobilePath = 'bindMobile';
    
    // 获取手机验证码
    sc.sendSMSUrl = serverAddress + '//api-user/common/';
    sc.sendSMSPath = 'sendSMS';

    // 接口地址配置
    /**
     * 根据服务端提供的code与message构建错误信息对象
     */
    var errorInfo = {
        'RDG_0.0.0': '服务器异常',
        'RDG_0.0.1': '无效的参数',
        'RDG_0.1.0': '名称重复',
        'RDG_0.1.1': '查询主体详情异常',
        'RDG_0.1.2': '根据箱码查询物流编号箱码失败',
        'RDG_0.1.3': '收货单列表为空 ',
        'RDG_0.1.4': '发货单列表为空',
        'RDG_0.1.5': '货车司机不存在',
        'RDG_0.1.6': '货车不存在',
        'RDG_0.1.7': '收货记录不存在',
        'RDG_0.1.8': '物流单不存在',
        'RDG_0.1.9': '物流公司不存在',
        'RDG_0.1.10': '发货记录信息不存在',
        'RDG_0.1.11': '司机手机号码重复',
        'RDG_0.1.12': '车牌号重复',

        'CODE_0.0.1': '编码不能为空 ',
        'CODE_0.0.3': '编码规则不存在',
        'CODE_0.0.4': '商品不存在',
        'CODE_0.0.5': '没有要同步的规则 ',
        'CODE_0.0.6': '参数错误',
        'CODE_0.0.7': '主体的id不能为空',
        'CODE_0.0.8': '系统异常',
        'CODE_0.0.9': '编码不能重复保存 ',
        'CODE_0.0.10': '类型错误',
        'CODE_0.0.11': '参数不全',
        'CODE_0.0.12': '主体不存在',
        'CODE_0.0.13': '用户不存在',
        'CODE_0.0.14': '收发货单号不能为空 ',
        'CODE_0.0.15': '收发货记录已经存在 ',
        'CODE_0.0.16': '二维码不能为空',
        'CODE_0.0.17': '二维码不合法',
        'CODE_0.0.18': '该商品未收货',
        
        'USER_0.0.1': '用户名不能为空 ',
        'USER_0.0.2': '用户不存在 ',
        'USER_0.0.3': '用户的密码不能为空',
        'USER_0.0.4': '该用户已经被禁用了',
        'USER_0.0.5': '用户密码错误',
        'USER_0.0.6': '手机号码或邮箱必须填一个',
        'USER_0.0.7': '邮箱已经存在',
        'USER_0.0.8': '手机号码已经存在',
        'USER_0.0.9': '账号已经存在',
        'USER_0.0.10': '邮箱的格式错误',
        'USER_0.0.11': '手机号码格式错误',
        'USER_0.0.12': '用户账号格式不正确',
        'USER_0.0.13': '验证码错误',
        'USER_0.0.14': '主体管理员已存在',
        'USER_0.0.15': '主体不存在',
        'USER_0.0.16': '手机号码不能为空',
        'USER_0.0.17': '原密码错误',
        'USER_0.0.18': '用户ID不能为空',
        'USER_0.0.19': '系统异常',
        'USER_0.0.20': '参数错误',
        'USER_0.0.21': '用户性别错误',
        'USER_0.0.22': '查找用户组失败',
        'USER_0.0.23': '基础组已经存在',
        'USER_0.0.24': '新密码不能为空',
        'USER_0.0.25': '新密码不能和原密码重复'
    };

    /**
     * 调用service后,通过返回的code获取相应的message
     * 
     * @param {string} code 服务端返回的错误代码,如'RDG_0.1.1'
     */
    sc.getErrorMsg = function(code) {
        var msg = errorInfo[code];
        if(msg == null || msg == 'undefined') {
            msg = '';
        }
        return msg;
    };

}(window.serviceConfig = {}));