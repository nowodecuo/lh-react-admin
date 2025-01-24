/** 登录入参 */
export interface LoginParamDto {
    account: string;
    password: string;
    verifyCode: string;
}
/** 验证码返参 */
export interface VerifyCodeDto {
    uuid: string;
    imageBase64: string;
}