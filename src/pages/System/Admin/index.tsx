/**
 * 管理员列表
 */
import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import LModalForm from '@/components/LComponents/LModalForm'; // 表单组件
import LPassword from '@/components/LComponents/LPassword'; // 密码修改组件
import LTable from '@/components/LComponents/LTable'; // 表格组件
import type { ActionsType, TableColumnsType, TableRefType } from '@/components/LComponents/typings/tableType';
import Config from '@/config';
import { columns, roleMoveColumns } from '@/config/system/admin';
import { actionData, batchUpdateRole, deleteData, queryTableList } from '@/services/system/admin';
import { queryMySubordinatesList } from '@/services/system/role';
import type { AdminActionDto, AdminListParamDto, AdminResDto, AdminUpdateRoleDto } from '@/typings/system/admin';
import { convertProTableData, TreeType } from '@/utils';
import { SwapOutlined } from '@ant-design/icons';
import { PageContainer, ProFormInstance } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const AdminList: React.FC = () => {
    const tableRef = useRef<TableRefType>(); // 表格ref
    const formRef = useRef<ProFormInstance>(); // 表单ref
    const access = useAccess(); // 权限
    const roleMoveRef = useRef<ProFormInstance>(); // 角色迁移表单ref
    const [pwdVisble, setPwdVisible] = useState<boolean>(false); // 密码修改显示隐藏
    const [roleMoveVisble, setRoleMoveVisible] = useState<boolean>(false); // 角色迁移显示隐藏
    const [adminId, setAdminId] = useState<string>('0'); // 管理员id
    const [roleTree, setRoleTree] = useState<TreeType[]>([]); // 我的下级角色树形列表
    const [roleMoveData, setRoleMoveData] = useState<AdminUpdateRoleDto>({} as any); // 角色迁移数据
    /** 数据结构 */
    const roleTreeSelect: TableColumnsType[] = [{
        sort: 4,
        title: '角色',
        dataIndex: 'adRoleId',
        valueType: 'treeSelect',
        required: true,
        hideInTable: true,
        fieldProps: { treeData: roleTree, treeDefaultExpandAll: true },
    }];
    const tableColumns: TableColumnsType[] = columns.concat(roleTreeSelect); // 管理员表格结构
    const roleMoveFormColumns: TableColumnsType[] = roleMoveColumns.concat(roleTreeSelect); // 角色迁移表格结构
    /** 获取我的下级角色列表 */
    const getMySubordRoleList = async () => {
        const treeData = await queryMySubordinatesList(true);
        setRoleTree(treeData);
    };
    /** 加载我的下级角色 */
    useEffect(() => {
        getMySubordRoleList();
    }, []);
    /** 获取表格数据 */
    const getTableList = async (params: AdminListParamDto) => {
        if (params.adCity) params.adCity = (params.adCity as unknown as string[]).join(',');
        const { response } = await queryTableList(params);
        return convertProTableData<AdminResDto>({
            response,
            callback: (list) => {
                return list.map((item) => ({ ...item, adCity: (item.adCity as string).split(',') }));
            },
        });
    };
    /** 操作事件回调 */
    const handleActionCall = async (actionType: ActionsType, row: AdminResDto) => {
        // 删除数据
        if (actionType === ActionsEnum.DELETE) {
            const { response } = await deleteData(row.adId || '0');
            if (response) {
                message.success('删除成功');
                tableRef.current?.reload();
            }
        }
    };
    /** 操作事件请求提交 */
    const handleActionRequest = async (params: AdminActionDto, actionType: ActionsType) => {
        // 新增、更新数据
        if ([ActionsEnum.EDIT, ActionsEnum.ADD].includes(actionType)) {
            params.adCity = (params.adCity as string[]).join(',');
            const { response } = await actionData(params, actionType);
            if (response) {
                message.success('操作成功');
                tableRef.current?.reload();
                return true;
            }
        }
        return false;
    };
    /** 修改密码事件 */
    const handleUpdatePassword = (id: string) => {
        setPwdVisible(true);
        setAdminId(id);
    };
    /** 管理员多选事件 */
    const handleRowSelection = (selectedRowKeyArr: React.Key[]) => {
        const adIds = selectedRowKeyArr.join(',');
        setRoleMoveData({ ...roleMoveData, adIds });
    };
    /** 角色迁移点击事件 */
    const handleRoleMove = () => {
        if (!roleMoveData.adIds || !roleMoveData.adIds.length) {
            message.error('请选择要迁移的管理员信息');
            return false;
        }
        setRoleMoveVisible(true);
    };

    return (
        <PageContainer>
            <Access accessible={access.adminList} fallback={Config.RULE_CHECK_ERROR}>
                <LTable
                    title="管理员"
                    rowKey="adId"
                    name="admin"
                    tableRef={tableRef}
                    formRef={formRef}
                    tableColumns={tableColumns}
                    visible={{
                        hideBatchDelBtn: true,
                        hideAddBtn: !access.adminAdd,
                        hideEditBtn: () => !access.adminUpdate,
                        hideDelBtn: () => !access.adminDelete,
                    }}
                    request={getTableList}
                    handleActionCall={handleActionCall}
                    modalFormRequest={handleActionRequest}
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                        onChange: handleRowSelection,
                    }}
                    toolRender={() => [
                        access.adminBatchUpdateRole && (<Button key="add" type="primary" icon={<SwapOutlined />} onClick={handleRoleMove}>角色迁移</Button>),
                    ]}
                    actionRender={(row: AdminResDto) => [
                        access.adminPasswordUpdate && (<a key="password" onClick={() => handleUpdatePassword(row.adId || '0')}>修改密码</a>),
                    ]}
                />
            </Access>
            {/** 密码修改 */}
            <LPassword
                visible={pwdVisble}
                id={adminId}
                handleVisibleCall={(visible) => setPwdVisible(visible)}
            />
            {/** 批量迁移角色 */}
            <LModalForm
                name="adminRole"
                title="角色迁移"
                formRef={roleMoveRef}
                showModal={roleMoveVisble}
                currentAction={ActionsEnum.EDIT}
                currentData={roleMoveData}
                columns={roleMoveFormColumns}
                handleVisibleCall={(visible: boolean) => setRoleMoveVisible(visible)}
                modalFormRequest={async (params: AdminUpdateRoleDto) => {
                    const { response } = await batchUpdateRole(params);
                    if (response) {
                        message.success('操作成功');
                        tableRef.current?.clearSelected(); // 清空勾选
                        tableRef.current?.reload(); // 刷新表格
                        return true;
                    }
                    return false;
                }}
            />
        </PageContainer>
    );
};

export default AdminList;
