import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import type { ActionsType } from '@/components/LComponents/typings/tableType';
import request from '@/services/request';
import type { RoleMenuAndRule, RoleResDto, RoleSubordDto } from '@/typings/system/role';
import { listToTree, user } from '@/utils';
import { backMenuToTree } from '@/utils/routes';
/**
 * 查询角色列表
 */
export const queryTableList = () => {
  return request<RoleResDto[]>({ method: 'post', url: '/role/list' });
};
/**
 * 更新、新增、复制角色
 */
export const actionData = (params: RoleResDto, type: ActionsType) => {
  const url = [ActionsEnum.ADD, ActionsEnum.COPY].includes(type) ? 'add' : 'update';
  return request<boolean>({ method: 'post', url: `/role/${url}`, data: params });
};
/**
 * 删除角色
 */
export const deleteData = (id: string) => {
  return request<boolean>({ method: 'post', url: '/role/delete', data: { id } });
};
/**
 * 查询我的下级角色列表
 */
export const queryMySubordinatesList = async (disabled: boolean = false) => {
  const { response } = await request<RoleSubordDto[]>({
    method: 'post',
    url: '/role/mySubordinatesRoleList',
  });
  if (response) {
    const userInfo = user.getAdminUserInfo();
    const roleId = userInfo?.roleId.toString() || '0';
    const roleName = userInfo?.roleName || '';
    const treeData = listToTree({
      list: response.data,
      labelName: 'roName',
      idName: 'roId',
      pidName: 'roPids',
      pidValue: roleId,
      valueType: 'number',
    });
    return [
      {
        title: roleName,
        label: roleName,
        value: roleId,
        key: roleId,
        disabled,
        children: treeData,
      },
    ];
  }
  return [];
};
/**
 * 角色菜单授权
 */
export const updateRoleBackMenu = (roId: string, menuIds: string) => {
  return request<boolean>({
    method: 'post',
    url: '/role/updateRoleBackMenu',
    data: { roId, menuIds },
  });
};
/**
 * 角色权限授权
 */
export const updateRoleAuthRule = (roId: string, ruleIds: string) => {
  return request<boolean>({
    method: 'post',
    url: '/role/updateRoleAuthRule',
    data: { roId, ruleIds },
  });
};
/**
 * 查询登录角色的权限及菜单
 */
export const queryRoleMenuAndRule = async () => {
  const { response } = await request<RoleMenuAndRule>({
    method: 'post',
    url: '/role/queryRoleMenuAndRule',
  });
  if (response) {
    return {
      menuData: backMenuToTree(response.data.backMenuList),
      ruleData: response.data.authRuleList.map((item) => item.arMethod),
    };
  }
  return { menuData: [], ruleData: [] };
};
