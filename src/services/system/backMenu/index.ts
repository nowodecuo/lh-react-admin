import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import type { ActionsType } from '@/components/LComponents/typings/tableType';
import request from '@/services/request';
import type { BackMenuActionDto, BackMenuResDto } from '@/typings/system/backMenu';
/**
 * 查询后台菜单列表
 */
export const queryTableList = () => {
  return request<BackMenuResDto[]>({ method: 'post', url: '/backMenu/list' });
};
/**
 * 查询授权后台菜单列表
 */
export const queryTableEmpoweList = () => {
  return request<BackMenuResDto[]>({ method: 'post', url: '/backMenu/empowerList' });
};
/**
 * 更新、新增、复制后台菜单
 */
export const actionData = (params: BackMenuActionDto, type: ActionsType) => {
  const url = [ActionsEnum.ADD, ActionsEnum.COPY].includes(type) ? 'add' : 'update';
  return request<boolean>({ method: 'post', url: `/backMenu/${url}`, data: params });
};
/**
 * 删除角色
 */
export const deleteData = (id: string) => {
  return request<boolean>({ method: 'post', url: '/backMenu/delete', data: { id } });
};
