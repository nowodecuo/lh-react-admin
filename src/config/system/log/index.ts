import { ActionsEnum } from '@/components/LComponents/enum/tableEnum';
import type { TableColumnsType } from '@/components/LComponents/typings/tableType';

const { ADD, EDIT, DETAIL } = ActionsEnum;

const resultStatus = {
  '1': '成功',
  '0': '失败',
};
/** 表格结构 */
export const columns: TableColumnsType[] = [
  { title: 'ID', dataIndex: 'loId', hideInTable: true, hideInSearch: true, hiddenForm: true },
  { title: '管理员', dataIndex: 'adName' },
  { title: '内容', dataIndex: 'loContent' },
  { title: '执行方法', dataIndex: 'loMethod' },
  {
    title: '执行参数',
    dataIndex: 'loParams',
    valueType: 'textarea',
    hideInSearch: true,
    hideInTable: true,
  },
  { title: '执行结果', dataIndex: 'loResult', valueType: 'select', valueEnum: resultStatus },
  {
    title: '失败原因',
    dataIndex: 'loReason',
    valueType: 'textarea',
    hideInSearch: true,
    ellipsis: true,
  },
  { title: 'IP', dataIndex: 'loIp' },
  { title: 'IP地址', dataIndex: 'loAddress' },
  {
    title: '执行时间',
    dataIndex: 'dateRange',
    valueType: 'dateRange',
    hideInTable: true,
    hiddenAction: [ADD, EDIT, DETAIL],
  },
  { title: '执行时间', dataIndex: 'createTime', hideInSearch: true, hiddenAction: [ADD, EDIT] },
];
