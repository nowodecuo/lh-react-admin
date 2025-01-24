/**
 * 角色列表
 */
import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import LTable from '@/components/LComponents/LTable'; // 表格组件
import type { ActionsType, ParamType, TableColumnsType } from '@/components/LComponents/typings/tableType';
import Config from '@/config';
import { columns } from '@/config/system/role';
import AuthRule from '@/pages/System/AuthRule'; // 权限组件
import { queryTableEmpoweList as queryBackMenuList } from '@/services/system/backMenu';
import { actionData, deleteData, queryMySubordinatesList, queryTableList, updateRoleAuthRule, updateRoleBackMenu } from '@/services/system/role';
import type { RoleResDto } from '@/typings/system/role';
import { listToTree, listToTreeData, TreeType } from '@/utils';
import { ActionType, PageContainer, ProFormInstance } from '@ant-design/pro-components';
import { Access, useAccess, useModel } from '@umijs/max';
import { message, Modal, Tree } from 'antd';
import { common } from 'lh-work-tools';
import React, { Key, useEffect, useRef, useState } from 'react';

const RoleList: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const tableRef = useRef<ActionType>(); // 表格ref
    const formRef = useRef<ProFormInstance>(); // 表单ref
    const autRuleRef = useRef<ActionType>(); // 权限表格ref
    const access = useAccess(); // 权限
    const [roleId, setRoleId] = useState<string>('0'); // 当前操作角色id
    const [roleTree, setRoleTree] = useState<TreeType[]>([]); // 我的上级角色树形列表
    const [backMenuTree, setBackMenuTree] = useState<TreeType[]>([]); // 后台菜单树形列表
    const [backMenuModal, setBackMenuModal] = useState<boolean>(false); // 后台菜单modal显示隐藏
    const [backMenuSelectKeys, setBackMenuSelectKeys] = useState<Key[]>([]); // 角色已选中的菜单ids
    const [authRuleModal, setAuthRuleModal] = useState<boolean>(false); // 权限modal显示隐藏
    const [authRuleSelectKeys, setAuthRuleSelectKeys] = useState<Key[]>([]); // 角色已选中的权限ids
    const [expandedRowKeys, setExpandedRowKeys] = useState<(number | string)[]>([]); // 默认展开的节点
    const tableColumns: TableColumnsType[] = columns.concat([{
        sort: 3,
        title: '上级角色',
        dataIndex: 'roPids',
        valueType: 'treeSelect',
        required: true,
        hiddenAction: [ActionsEnum.EDIT],
        hideInTable: true,
        fieldProps: { treeData: roleTree, treeDefaultExpandAll: true },
    }]);
    /** 获取我的下级角色列表 */
    const getMySubordRoleList = async () => {
        const treeData = await queryMySubordinatesList();
        setRoleTree(treeData);
    };
    /** 获取后台菜单列表 */
    const getBackMenuList = async () => {
        const { response } = await queryBackMenuList();
        if (response) {
            const treeData = listToTree({ list: response.data, labelName: 'bmTitle', idName: 'bmId', pidName: 'bmPids' });
            setBackMenuTree(treeData);
        }
    };
    /** 加载我的下级角色、后台菜单 */
    useEffect(() => {
        getMySubordRoleList();
        if (access.backMenuEmpowerList) getBackMenuList();
    }, []);
    /** 获取表格数据 */
    const getTableList = async (params: ParamType<any>) => {
        const { response } = await queryTableList();
        if (response) {
            const roleId = initialState?.currentUser?.roleId.toString() || '0'; // 当前登录用户角色id
            const treeData = listToTreeData({ list: response.data, labelName: 'roName', idName: 'roId', pidName: 'roPids', pidValue: roleId }) || []; // 我的下级角色列表
            const expandeKeys = response.data.map((item) => item.roId.toString()); // 默认展开的节点
            setExpandedRowKeys(expandeKeys);
            // 如果不是超管，则把本身加入树形菜单
            let treeList = treeData;
            if (roleId !== '0') {
                const [myselfData] = response.data.filter((item) => item.roId.toString() === roleId); // 当前登录用户角色信息
                treeList = [{ ...myselfData, key: myselfData.roId.toString(), children: treeData }]; // 拼接我的下级角色列表
            }
            const list = common.array.arrayPage(treeList, params.pageNum, params.pageSize);
            return { success: true, data: list, total: treeData?.length };
        }
        return { success: true, data: [], total: 0 };
    };
    /** 操作事件回调 */
    const handleActionCall = async (actionType: ActionsType | 'menu' | 'rule', row: RoleResDto) => {
        // 获取操作角色的上级角色id
        if (row && row.roPids) row.roPids = row.roPids.split(',').pop() as string;
        // 删除数据
        if (actionType === ActionsEnum.DELETE) {
            const { response } = await deleteData(row.roId);
            if (response) {
                getMySubordRoleList(); // 更新上级角色
                message.success('删除成功');
                tableRef.current?.reload();
            }
            // 菜单授权
        } else if (actionType === 'menu') {
            const selectKeys = row.roBackMenuIds ? row.roBackMenuIds.split(',') : [];
            setRoleId(row.roId);
            setBackMenuSelectKeys(selectKeys);
            setBackMenuModal(true);
            // 权限授权
        } else if (actionType === 'rule') {
            const selectKeys = row.roRuleIds ? row.roRuleIds.split(',') : [];
            setRoleId(row.roId);
            setAuthRuleSelectKeys(selectKeys);
            setAuthRuleModal(true);
        }
        return row;
    };
    /** 操作事件请求提交 */
    const handleActionRequest = async (params: RoleResDto, actionType: ActionsType) => {
        // 新增、复制、更新数据
        if ([ActionsEnum.EDIT, ActionsEnum.ADD, ActionsEnum.COPY].includes(actionType)) {
            const { response } = await actionData(params, actionType);
            if (response) {
                getMySubordRoleList(); // 更新上级角色
                message.success('操作成功');
                tableRef.current?.reload();
                return true;
            }
        }
        return false;
    };
    /** 菜单授权提交事件 */
    const handleBackMenuSubmit = async () => {
        const menuIds = backMenuSelectKeys?.join(',') || '';
        const { response } = await updateRoleBackMenu(roleId, menuIds);
        if (response) {
            message.success('操作成功');
            setBackMenuSelectKeys([]); // 清空已选菜单key
            setBackMenuModal(false);
            tableRef.current?.reload();
        }
    };
    /** 权限授权提交事件 */
    const handleAuthRuleSubmit = async () => {
        if (!authRuleSelectKeys.length) {
            message.error('权限不能为空');
            return;
        }
        const ruleIds = authRuleSelectKeys?.join(',') || '';
        const { response } = await updateRoleAuthRule(roleId, ruleIds);
        if (response) {
            message.success('操作成功');
            setAuthRuleSelectKeys([]); // 清空已选权限key
            setAuthRuleModal(false);
            if (autRuleRef.current?.reset) autRuleRef.current?.reset(); // 重置权限table参数
            tableRef.current?.reload();
        }
    };

    return (
        <PageContainer>
            <Access accessible={access.roleList} fallback={Config.RULE_CHECK_ERROR}>
                <LTable
                    name="role"
                    tableRef={tableRef}
                    formRef={formRef}
                    title="角色"
                    tableColumns={tableColumns}
                    visible={{
                        hideSearchTool: true,
                        hideBatchDelBtn: true,
                        showCopyBtn: access.roleAdd,
                        hideAddBtn: !access.roleAdd,
                        hideEditBtn: () => !access.roleUpdate,
                        hideDetailBtn: () => !access.roleDelete,
                    }}
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
                    actionRender={(row: RoleResDto) => [
                        access.backMenuEmpowerList && (<a key="menu" onClick={() => handleActionCall('menu', row)}>菜单授权</a>),
                        access.authRuleEmpowerList && (<a key="rule" onClick={() => handleActionCall('rule', row)}>权限授权</a>),
                    ]}
                />
            </Access>
            {/** 菜单授权 */}
            <Modal
                title="菜单授权"
                open={backMenuModal}
                maskClosable={false}
                onCancel={() => setBackMenuModal(false)}
                onOk={handleBackMenuSubmit}
            >
                <Tree
                    treeData={backMenuTree}
                    checkedKeys={backMenuSelectKeys}
                    checkable
                    checkStrictly
                    defaultExpandAll
                    onCheck={({ checked }: any) => setBackMenuSelectKeys(checked)}
                />
            </Modal>
            {/** 权限授权 */}
            <Modal
                title="权限授权"
                open={authRuleModal}
                width={1080}
                maskClosable={false}
                onCancel={() => {
                    setAuthRuleModal(false);
                    if (autRuleRef.current?.reset) autRuleRef.current?.reset(); // 重置权限table参数
                }}
                onOk={handleAuthRuleSubmit}
            >
                <AuthRule
                    refs={autRuleRef}
                    isChild={true}
                    selectedRowKeys={authRuleSelectKeys}
                    handleRowSelection={(selectKeys: React.Key[]) =>
                        setAuthRuleSelectKeys(selectKeys)
                    }
                />
            </Modal>
        </PageContainer>
    );
};

export default RoleList;
