import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import type { ActionsType } from '@/components/LComponents/typings/tableType';
import request from '@/services/request';
import type { ResPageDto } from '@/typings/common/res';
import type {
  AdminActionDto,
  AdminListParamDto,
  AdminMyUpdateDto,
  AdminResDto,
  AdminUpdateRoleDto,
} from '@/typings/system/admin';
/**
 * 查询管理员列表
 */
export const queryTableList = (params: AdminListParamDto) => {
  return request<ResPageDto<AdminResDto[]>>({ method: 'post', url: '/admin/page', data: params });
};
/**
 * 更新、新增管理员
 */
export const actionData = (params: AdminActionDto, type: ActionsType) => {
  const url = type === ActionsEnum.ADD ? 'add' : 'update';
  return request<boolean>({ method: 'post', url: `/admin/${url}`, data: params });
};
/**
 * 删除管理员
 */
export const deleteData = (id: string) => {
  return request<boolean>({ method: 'post', url: '/admin/delete', data: { id } });
};
/**
 * 更新管理员密码
 */
export const updatePassword = (adId: number, adPassword: string) => {
  return request<boolean>({
    method: 'post',
    url: '/admin/adminPasswordUpdate',
    data: { adId, adPassword },
  });
};
/**
 * 批量更新管理员角色
 */
export const batchUpdateRole = (params: AdminUpdateRoleDto) => {
  return request<boolean>({ method: 'post', url: '/admin/adminBatchUpdateRole', data: params });
};
/**
 * 查询管理员个人信息
 */
export const querymMyAdminData = () => {
  return request<AdminResDto>({ method: 'post', url: '/admin/myAdminData' });
};
/**
 * 更新管理员个人信息
 */
export const updateMyAdminData = (params: AdminMyUpdateDto) => {
  return request<boolean>({ method: 'post', url: '/admin/myAdminUpdate', data: params });
};
/**
 * 更新管理员个人密码
 */
export const updateMyPassword = (adId: number, adPassword: string) => {
  return request<boolean>({
    method: 'post',
    url: '/admin/adminMyPasswordUpdate',
    data: { adId, adPassword },
  });
};
