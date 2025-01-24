/**
 * 权限列表
 */
import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import LTable from '@/components/LComponents/LTable'; // 表格组件
import type { ActionsType, ParamType, TableColumnsType } from '@/components/LComponents/typings/tableType';
import Config from '@/config';
import { StatusEnum } from '@/config/com';
import { columns } from '@/config/system/authRule';
import { actionData, deleteData, queryTableEmpowerList, queryTableList } from '@/services/system/authRule';
import type { AuthRuleActionDto, AuthRuleListParamDto, AuthRuleResDto } from '@/typings/system/authRule';
import { listToTree, listToTreeData, TreeType } from '@/utils';
import { ActionType, PageContainer, ProFormInstance } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { message } from 'antd';
import { common } from 'lh-work-tools';
import React, { Ref, useRef, useState } from 'react';

type PropsType = {
    isChild: boolean; // 是否作为子组件引用
    refs?: Ref<ActionType | undefined>;
    selectedRowKeys?: React.Key[]; // 默认选中的key
    handleRowSelection?: (selectedKeys: React.Key[]) => void; // 勾选事件
};

const AuthRule = (props: PropsType) => {
    const { refs, isChild, selectedRowKeys, handleRowSelection } = props;
    const tableRef = useRef<ActionType>(); // 表格ref
    const formRef = useRef<ProFormInstance>(); // 表单ref
    const access = useAccess(); // 权限
    const [authRuleTree, setAuthRuleTree] = useState<TreeType[]>([]); // 上级菜单树形列表
    const [expandedRowKeys, setExpandedRowKeys] = useState<(number | string)[]>([]); // 默认展开的节点
    const tableColumns: TableColumnsType[] = columns.concat([
        {
            sort: 2,
            title: '所属上级',
            dataIndex: 'arPid',
            valueType: 'treeSelect',
            required: true,
            hideInSearch: true,
            hideInTable: true,
            fieldProps: { treeData: authRuleTree, treeDefaultExpandAll: true },
        },
        {
            sort: 5,
            title: '状态',
            dataIndex: 'arStatus',
            required: true,
            hideInSearch: isChild,
            valueType: 'select',
            valueEnum: StatusEnum,
        },
    ]);
    /** 获取表格数据 */
    const getTableList = async (params: ParamType<AuthRuleListParamDto>) => {
        if (isChild) params.arStatus = '1'; // 作为子组件使用时，只查询启用状态数据
        const { response } = isChild ? await queryTableEmpowerList(params) : await queryTableList(params);
        if (response) {
            const treeData = listToTreeData({ list: response.data, labelName: 'arName', idName: 'arId', pidName: 'arPid' }) || [];
            const treeList = listToTree({ list: response.data, labelName: 'arName', idName: 'arId', pidName: 'arPid' }) || [];
            setAuthRuleTree([{ value: '0', key: '0', label: '顶级', title: '顶级', children: treeList }]);
            if (isChild) {
                // 默认展开的节点
                const expandeKeys = response.data.map((item) => item.arId);
                setExpandedRowKeys(expandeKeys);
            }
            const list = common.array.arrayPage(treeData, params.pageNum, params.pageSize);
            return { success: true, data: list, total: treeData?.length };
        }
        return { success: true, data: [], total: 0 };
    };
    /** 操作事件回调 */
    const handleActionCall = async (actionType: ActionsType, row: AuthRuleResDto) => {
        // 删除数据
        if (actionType === ActionsEnum.DELETE) {
            const { response } = await deleteData(row.arId);
            if (response) {
                message.success('删除成功');
                tableRef.current?.reload();
            }
        }
    };
    /** 操作事件请求提交 */
    const handleActionRequest = async (params: AuthRuleActionDto, actionType: ActionsType) => {
        // 新增、更新数据
        if ([ActionsEnum.EDIT, ActionsEnum.ADD].includes(actionType)) {
            const { response } = await actionData(params, actionType);
            if (response) {
                message.success('操作成功');
                tableRef.current?.reload();
                return true;
            }
        }
        return false;
    };

    return (
        <PageContainer
            header={(isChild ? { title: null, breadcrumb: { items: [] } } : null) as any}
            content={isChild ? null : '该页面需要专业人员维护，请注意！'}
        >
            <Access accessible={isChild || access.authRuleList} fallback={Config.RULE_CHECK_ERROR}>
                <LTable
                    name="auth_rule"
                    title="权限"
                    rowKey="arId"
                    tableRef={isChild ? refs : tableRef}
                    formRef={formRef}
                    tableColumns={tableColumns}
                    visible={{
                        hideActionColumn: isChild,
                        hideBatchDelBtn: true,
                        hideAddBtn: isChild || !access.authRuleAdd,
                        hideEditBtn: () => !access.authRuleUpdate,
                        hideDelBtn: () => !access.authRuleDelete,
                        hideDetailBtn: () => true,
                    }}
                    rowSelection={isChild ? { selectedRowKeys, preserveSelectedRowKeys: true, onChange: handleRowSelection } : undefined}
                    expandedRowKeys={{
                        expandedRowKeys,
                        onExpand: (open: boolean, event: any) => {
                            // 展开、收缩控制
                            const rowKeys = open ? [...expandedRowKeys, event.key] : expandedRowKeys.filter((item) => item !== event.key);
                            setExpandedRowKeys(rowKeys);
                        },
                    }}
                    request={getTableList}
                    handleActionCall={handleActionCall}
                    modalFormRequest={handleActionRequest}
                />
            </Access>
        </PageContainer>
    );
};

export default AuthRule;
