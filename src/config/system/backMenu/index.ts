import { StatusEnum } from "@/config/com";
import type { TableColumnsType } from "@/components/LComponents/typings/tableType";

/** 后台菜单表格结构 */
export const columns: TableColumnsType[] = [
    { sort: 1, title: "ID", dataIndex: "bmId", hideInTable: true, hideInSearch: true, hiddenForm: true },
    { sort: 2, title: "标题", dataIndex: "bmTitle", required: true },
    { sort: 5, title: "访问地址", dataIndex: "bmPath" },
    { sort: 6, title: "组件地址", dataIndex: "bmComponent" },
    { sort: 7, title: "排序", dataIndex: "bmSort", required: true, valueType: "digit" },
    { sort: 8, title: "状态", dataIndex: "bmStatus", required: true, valueType: "select", valueEnum: StatusEnum },
]