import request from "@/services/request";
import type { CreateInfoDto, CreateListDto, CreateParamDto, CreateRespDto } from "@/typings/system/create";
/** 查询可创建数据表列表 */
export const queryTableList = () => {
    return request<CreateListDto[]>({ method: "post", url: "/create/createTableList"  });
}
/** 查询可数据表详情信息 */
export const queryTableInfo = (tableName: string) => {
    return request<CreateInfoDto[]>({ method: "post", url: "/create/createTableInfo", data: { tableName } });
}
/** 发起创建CURD */
export const handleCreateCurd = (params: CreateParamDto) => {
    return request<CreateRespDto>({ method: "post", url: "/create/createCurd", data: params });
}
/** 发起下载zip包 */
export const downloadCreateCurd = (filePath: string) => {
    return request({ method: "post", url: "/create/createFileDownload", responseType: "blob", data: { filePath } });
}
