/** 后台菜单列表返参 */
export interface BackMenuResDto {
  bmId: string;
  bmPids: string;
  bmTitle: string;
  bmIcon: string;
  bmPath: string;
  bmComponent: string;
  bmSort: number;
  bmStatus: string;
}
/** 后台菜单新增、编辑入参 */
export interface BackMenuActionDto extends BackMenuResDto {
  bmId?: string;
}
/** 登录角色的菜单dto */
export type BackMenuRoleDto = BackMenuResDto;
