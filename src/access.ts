import Config from '@/config';
import type { UserDto } from '@/typings/common/res';
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
    initialState: { currentUser?: UserDto; ruleData?: string[] } | undefined,
) {
    const { currentUser, ruleData } = initialState ?? {};
    /** 权限校验 */
    const authRuleChcek = (rule: string): boolean => {
        if (!Config.OPEN_RULE_CHECK) return true; // 如果关闭权限校验则全部通过
        if (currentUser?.roleId === 0) return true; // 超管直接通过
        if (ruleData?.includes(rule)) return true; // 权限列表中是否含有该权限，有则通过
        return false;
    };

    return {
        /** 后台菜单管理 */
        backMenuList: authRuleChcek('backMenuList'),
        backMenuAdd: authRuleChcek('backMenuAdd'),
        backMenuUpdate: authRuleChcek('backMenuUpdate'),
        backMenuDelete: authRuleChcek('backMenuDelete'),
        /** 权限管理 */
        authRuleList: authRuleChcek('authRuleList'),
        authRuleAdd: authRuleChcek('authRuleAdd'),
        authRuleUpdate: authRuleChcek('authRuleUpdate'),
        authRuleDelete: authRuleChcek('authRuleDelete'),
        /** 角色管理 */
        roleList: authRuleChcek('roleList'),
        roleAdd: authRuleChcek('roleAdd'),
        roleUpdate: authRuleChcek('roleUpdate'),
        roleDelete: authRuleChcek('roleDelete'),
        authRuleEmpowerList: authRuleChcek('authRuleEmpowerList'), // 角色权限授权
        backMenuEmpowerList: authRuleChcek('backMenuEmpowerList'), // 角色菜单授权
        /** 管理员管理 */
        adminList: authRuleChcek('adminPage'),
        adminAdd: authRuleChcek('adminAdd'),
        adminUpdate: authRuleChcek('adminUpdate'),
        adminDelete: authRuleChcek('adminDelete'),
        adminPasswordUpdate: authRuleChcek('adminPasswordUpdate'),
        adminBatchUpdateRole: authRuleChcek('adminBatchUpdateRole'),
        /** 日志管理 */
        logList: authRuleChcek('logPage'),
        logBatchDelete: authRuleChcek('logBatchDelete'),
        /** 创建CURD */
        createTableList: authRuleChcek('createTableList'),
        createTableInfo: authRuleChcek('createTableInfo'),
    };
}
