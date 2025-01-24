/** 操作事件类型 enum */
export enum ActionsEnum {
    ADD = "add",
    EDIT = "edit",
    DETAIL = "detail",
    EXPORT = "export",
    BATCH_DELETE = "batchDelete",
    DELETE = "delete",
    COPY = "copy",
    CUSTOM = "costom",
}
/** modal 组件类型 enum */
export enum ComponentEnum {
    TEXT = "text", // 文本框
    TEXTAREA = "textarea", // 文本框
    PASSWORD = "password", // 密码
    SELECT = "select", // 下拉框
    DATE = "date", // 日期
    DATE_RANGE = "dateRange", // 日期区间
    CASCADER = "cascader", // 联级组件
    TREE_SELECT = "treeSelect", // 树形组件
    NUMBER = "digit", // 数字组件
}