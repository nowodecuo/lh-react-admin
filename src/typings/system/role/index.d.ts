import type { AuthRuleRoleDto } from '@/typings/system/authRule';
import type { BackMenuRoleDto } from '@/typings/system/backMenu';

/** 角色列表返参 */
export interface RoleResDto extends RoleSubordDto {
  roRuleIds?: string; // 权限ids
  roBackMenuIds?: string; // 后台菜单ids
  roStatus: string;
}
/** 我的下级角色dto */
export interface RoleSubordDto {
  roId: string;
  roName: string;
  roPids: string;
}
/** 登录角色菜单和权限返参 */
export interface RoleMenuAndRule {
  authRuleList: AuthRuleRoleDto[];
  backMenuList: BackMenuRoleDto[];
}
