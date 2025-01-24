import type { TableColumnsType } from '@/components/LComponents/typings/tableType';
/** 权限表格结构 */
export const columns: TableColumnsType[] = [
    {
        sort: 1,
        title: 'ID',
        dataIndex: 'arId',
        hideInTable: true,
        hideInSearch: true,
        hiddenForm: true,
    },
    { sort: 3, title: '权限名称', dataIndex: 'arName', required: true },
    { sort: 4, title: '方法名称', dataIndex: 'arMethod', required: true },
];
