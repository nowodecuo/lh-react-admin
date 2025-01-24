import { StatusEnum } from "@/config/com";
import type { TableColumnsType } from "@/components/LComponents/typings/tableType";

/** 角色表格结构 */
export const columns: TableColumnsType[] = [
    { sort: 1, title: "ID", dataIndex: "roId", hideInTable: true, hideInSearch: true, hiddenForm: true },
    { sort: 2, title: "角色名", dataIndex: "roName", required: true },
    { sort: 4, title: "状态", dataIndex: "roStatus", required: true, valueType: "select", valueEnum: StatusEnum },
]