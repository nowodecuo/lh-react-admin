import { ComponentEnum } from "@/components/LComponents/enum/tableEnum";
import type { TableColumnsType } from "@/components/LComponents/typings/tableType";
import type { CreateInfoDto } from "@/typings/system/create";
import type { ColumnsType } from "antd/es/table";

/** 可创建数据表列表结构 */
export const tableColumns: TableColumnsType[] = [
    { title: "表名", dataIndex: "name" },
    { title: "存储引擎", dataIndex: "engine" },
    { title: "数据量", dataIndex: "rows" },
    { title: "数据大小", dataIndex: "dataLength" },
    { title: "创建时间", dataIndex: "createTime" },
    { title: "备注", dataIndex: "comment" },
]
/** 可数据表详情结构 */
export const tableInfoColumns: ColumnsType<CreateInfoDto> = [
    { title: "字段名", dataIndex: "field" },
    { title: "类型", dataIndex: "type" },
    { title: "键类型", dataIndex: "key" },
    { title: "备注", dataIndex: "comment" },
]
/** 可创建功能 options */
export const functionOptions = [
    { label: "列表", value: "list" },
    { label: "新增", value: "add" },
    { label: "更新", value: "update" },
    { label: "删除", value: "delete" },
    { label: "批量删除", value: "batchDelete" },
]
/** 可创建类型 options */
export const createTypeOptions = [
    { label: "后台管理", value: "BACK" },
    { label: "APP应用", value: "APP" },
]
/** 组件类型 options */
export const componentOptions = [
    { label: "文本框", value: ComponentEnum.TEXT },
    { label: "文本域", value: ComponentEnum.TEXTAREA },
    { label: "密码框", value: ComponentEnum.PASSWORD },
    { label: "数字框", value: ComponentEnum.NUMBER },
    { label: "选择框", value: ComponentEnum.SELECT },
    { label: "日期框", value: ComponentEnum.DATE },
    { label: "日期区间", value: ComponentEnum.DATE_RANGE },
    { label: "联级选择", value: ComponentEnum.CASCADER },
    { label: "树形选择", value: ComponentEnum.TREE_SELECT },
]