/** 权限列表入参 */
export interface AuthRuleListParamDto {
    arName: string;
    arPid: number;
    arMethod: string;
    arStatus: string;
}
/** 权限信息返参*/
export interface AuthRuleResDto extends AuthRuleListParamDto {
    arId: string;
}
/** 权限新增、修改入参*/
export interface AuthRuleActionDto extends AuthRuleListParamDto {
    arId?: string;
}
/** 登录角色的权限dto */
export interface AuthRuleRoleDto {
    arId: string;
    arName: string;
    arMethod: string;
}
