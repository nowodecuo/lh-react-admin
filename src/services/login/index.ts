import request from "@/services/request";
import type { LoginParamDto, VerifyCodeDto } from "@/typings/login";
/**
 * 获取验证码
 */
export const getVerifyCode = () => {
    return request<VerifyCodeDto>({ method: "post", url: "/login/getVerifyCode" });
}
/** 
 * 登录验证
 */
export const handleLoginChcek = (params: LoginParamDto) => {
    return request<string>({ method: "post", url: "/login/loginCheck", data: params });
}
/**
 * 登录退出
 */
export const handleLogout = () => {
    return request<boolean>({ method: "post", url: "/login/logout" });
}
