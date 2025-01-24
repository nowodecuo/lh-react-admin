import request from '@/services/request';
import type { ResPageDto } from '@/typings/common/res';
import type { LogListParamDto, LogResDto } from '@/typings/system/log';
/** 查询日志列表 */
export const queryTableList = (params: LogListParamDto) => {
  return request<ResPageDto<LogResDto[]>>({ method: 'post', url: '/log/page', data: params });
};
/** 批量删除日志 */
export const batchDeleteData = (ids: string) => {
  return request<boolean>({ method: 'post', url: '/log/batchDelete', data: { ids } });
};
