/**
 * 通用配置
 */
export default {
    ERR_MSG: "系统错误", // 错误提示
    OPEN_RULE_CHECK: true, // 开启权限校验
    RULE_CHECK_ERROR: "抱歉！您暂无访问权限", // 权限校验未通过信息
    SUCCESS_CODE: 200, // 请求成功code
    NOT_LOGIN: 1001,    // 未登录code
    EXPIRE_LOGIN: 1002,    // 登录过期code
    USER_EXTRUSION: 1003,    // 其他设备登录
    IMAGE_PATH: "/static/uploads/", // 图片预览路径
    DES_KEY_HEX: "lhqazwsxedcrfvtgbyhnujm", // DES KEY
    SM4_KEY_HEX: "86AE5AF211A0BD1EA013ACDE3F3BCD37", // SM4 KEY
    ADMIN_USER_KEY: "adminUserInfo", // 管理员信息标识
    WXCONFIG_KEY: "wxConfig", // session 微信配置 key
    HOST_URL: "http://localhost", // 域
    LOCATION_KEY: "location", // session 定位信息 key
    BAIDU_MAP_KEY: "hDrCa3YwTn0hPTToZGaiWNuFBmHAMbmD", //百度地图秘钥
    TABLE_PREFIX: 'tb_', // 表前缀
}
