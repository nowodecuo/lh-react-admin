/**
 * 后台菜单列表
 */
import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import LIcon from '@/components/LComponents/LIcon'; // 图标组件
import LTable from '@/components/LComponents/LTable'; // 表格组件
import type { ActionsType, FormRefType, ParamType, TableColumnsType, TableRefType } from '@/components/LComponents/typings/tableType';
import Config from '@/config';
import { columns } from '@/config/system/backMenu';
import { actionData, deleteData, queryTableList } from '@/services/system/backMenu';
import type { BackMenuResDto } from '@/typings/system/backMenu';
import { listToTree, listToTreeData, TreeType } from '@/utils';
import * as Icons from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { message } from 'antd';
import { common } from 'lh-work-tools';
import React, { useRef, useState } from 'react';

const BackMenu: React.FC = () => {
    const tableRef = useRef<TableRefType>(); // 表格ref
    const formRef = useRef<FormRefType>(); // 表单ref
    const access = useAccess(); // 权限
    const { ADD, EDIT, DETAIL } = ActionsEnum;
    const [roleTree, setRoleTree] = useState<TreeType[]>([]); // 上级菜单树形列表
    const [expandedRowKeys, setExpandedRowKeys] = useState<(number | string)[]>([]); // 默认展开的节点
    const iconOptions: any = Object.keys(Icons).map((key) => ({ label: <LIcon key={key} name={key} />, value: key })); // 图标数据
    const tableColumns: TableColumnsType[] = columns.concat([
        // 表格结构
        {
            sort: 4,
            title: '图标',
            dataIndex: 'bmIcon',
            valueType: 'select',
            hideInTable: true,
            valueEnum: iconOptions,
        }, // 用于表单
        {
            sort: 4,
            title: '图标',
            dataIndex: 'bmIconInfo',
            hiddenAction: [ADD, EDIT, DETAIL],
            render: (_, record: BackMenuResDto) => {
                // 用于表格
                return record.bmIcon ? <LIcon key={record.bmIcon} name={record.bmIcon} /> : null;
            },
        },
        {
            sort: 3,
            title: '上级菜单',
            dataIndex: 'bmPids',
            valueType: 'treeSelect',
            required: true,
            hideInTable: true,
            hiddenAction: [EDIT, DETAIL],
            fieldProps: { treeData: roleTree, treeDefaultExpandAll: true },
        },
    ]);
    /** 获取表格数据 */
    const getTableList = async (params: ParamType<any>) => {
        const { response } = await queryTableList();
        if (response) {
            const data = response.data.map((item) => ({ ...item, bmIconInfo: item.bmIcon }));
            const treeData = listToTreeData({ list: data, labelName: 'bmTitle', idName: 'bmId', pidName: 'bmPids' }) || [];
            const treeList = listToTree({ list: data, labelName: 'bmTitle', idName: 'bmId', pidName: 'bmPids' }) || [];
            const expandeKeys = response.data.map((item) => item.bmId.toString()); // 默认展开的节点
            setRoleTree([{ value: '0', key: '0', label: '顶级', title: '顶级', children: treeList }]);
            setExpandedRowKeys(expandeKeys);
            const list = common.array.arrayPage(treeData, params.pageNum, params.pageSize);
            return { success: true, data: list, total: treeData?.length };
        }
        return { success: true, data: [], total: 0 };
    };
    /** 操作事件回调 */
    const handleActionCall = async (actionType: ActionsType, row: BackMenuResDto) => {
        // 删除数据
        if (actionType === ActionsEnum.DELETE) {
            const { response } = await deleteData(row.bmId);
            if (response) {
                message.success('删除成功');
                tableRef.current?.reload();
            }
            // 复制
        } else if (actionType === ActionsEnum.COPY) {
            row.bmPids = row.bmPids.split(',').pop() || ''; // 取最后一位
            return row;
        }
    };
    /** 操作事件请求提交 */
    const handleActionRequest = async (params: BackMenuResDto, actionType: ActionsType) => {
        // 新增、更新、复制数据
        if ([ActionsEnum.EDIT, ActionsEnum.ADD, ActionsEnum.COPY].includes(actionType)) {
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
        <PageContainer content="父菜单无需填写访问地址与组件地址">
            <Access accessible={access.backMenuList} fallback={Config.RULE_CHECK_ERROR}>
                <LTable
                    name="back_menu"
                    title="菜单"
                    tableRef={tableRef}
                    formRef={formRef}
                    tableColumns={tableColumns}
                    visible={{
                        hideSearchTool: true,
                        hideBatchDelBtn: true,
                        showCopyBtn: access.backMenuAdd,
                        hideAddBtn: !access.backMenuAdd,
                        hideDelBtn: () => !access.backMenuDelete,
                        hideEditBtn: () => !access.backMenuUpdate,
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
                />
            </Access>
        </PageContainer>
    );
};

export default BackMenu;
