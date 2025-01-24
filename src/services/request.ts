/**
 * 请求
 * @author 1874
 */
import axios from "axios";
import Config from "@/config";
import { message } from "antd";
import { user } from "@/utils";
import { history } from "@umijs/max";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { RequestType, ResponseType } from "@/typings/common/request";
import type { ResDto } from "@/typings/common/res";
/** 请求配置 */
const instance = axios.create({
    baseURL: "/admin-api",
    headers: { "Content-Type": "application/json" },
});
/** 请求拦截器 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // config.headers = { "Content-Type": "application/json", ...config.headers } as any;
    // 获取token
    const userInfo = user.getAdminUserInfo();
    if (userInfo) config.headers["admin-token"] = userInfo.token;
    return config;
}, (error) => {
    return Promise.reject(error);
});
/** 响应拦截器 */
instance.interceptors.response.use((response: AxiosResponse) => {
    let data = response.data;
    // 错误提示
    const errorFunc = (data: AxiosResponse["data"]) => {
        // 登录过期|未登录|其他设备登录，则清除登录信息跳转到登录页
        if ([Config.NOT_LOGIN, Config.EXPIRE_LOGIN, Config.USER_EXTRUSION].includes(data.code)) {
            user.deleteAdminUserInfo();
            history.replace(`/loginError/${data.code}`);
            return;
        }
        const errorInfo = data.msg || Config.ERR_MSG;
        message.error(errorInfo);
        return errorInfo;
    }
    // 处理blob对象的json数据
    if (response.config.responseType === "blob" && data.type === "application/json") {
        const myBlob = new Blob([data], { type : "application/json" });
        const reader = new FileReader();
        reader.readAsText(myBlob);
        reader.onload = function() {
            data = JSON.parse(this.result as string);
            return Promise.reject(errorFunc(data));
        }
        return;
    }
    // 如果是json数据 && code != 200则报错
    if (response.config.responseType === "json" && data.code !== Config.SUCCESS_CODE) {
        return Promise.reject(errorFunc(data));
    }
    return data;
}, (err: any) => {
    return Promise.reject(err);
});

export default async function useRequest<T = any>({ method = "post", url = "", data = {}, headers = {} as any, responseType = "json" }: RequestType): Promise<ResponseType<T>> {
    const info: ResponseType<any> = { response: null, error: null };
    try {
        const res: ResDto<any> = await instance.request({ method, url, data, headers, responseType }) as AxiosResponse["data"];
        info.response = res;
    } catch(err: any) {
        info.error = err;
    }
    return info;
} 