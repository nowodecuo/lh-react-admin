import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import type { ActionsType } from '@/components/LComponents/typings/tableType';
import request from '@/services/request';
import type {
    AuthRuleActionDto,
    AuthRuleListParamDto,
    AuthRuleResDto,
} from '@/typings/system/authRule';
/**
 * 查询权限列表
 */
export const queryTableList = (params: AuthRuleListParamDto) => {
    return request<AuthRuleResDto[]>({ method: 'post', url: '/authRule/list', data: params });
};
/**
 * 查询角色权限授权列表
 */
export const queryTableEmpowerList = (params: AuthRuleListParamDto) => {
    return request<AuthRuleResDto[]>({
        method: 'post',
        url: '/authRule/empowerList',
        data: params,
    });
};
/**
 * 更新、新增权限
 */
export const actionData = (params: AuthRuleActionDto, type: ActionsType) => {
    const url = type === ActionsEnum.ADD ? 'add' : 'update';
    return request<boolean>({ method: 'post', url: `/authRule/${url}`, data: params });
};
/**
 * 删除权限
 */
export const deleteData = (id: string) => {
    return request<boolean>({ method: 'post', url: '/authRule/delete', data: { id } });
};
