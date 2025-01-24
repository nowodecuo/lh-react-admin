import type { Method, AxiosRequestHeaders, ResponseType as ResType } from "axios";
import { ResDto } from "@/typings/common/res";
/** 返参类型 */
export type ResponseType<T = unknown> = {
    response: ResDto<T> | null;
    error: string | null;
};
/** 入参类型 */
export type RequestType = {
    headers?: AxiosRequestHeaders;
    method?: Method;
    responseType?: ResType;
    data?: Record<string, any>;
    url: string;
}