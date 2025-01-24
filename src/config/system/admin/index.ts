import { StatusEnum } from "@/config/com";
import { ActionsEnum } from "@/components/LComponents/enum/tableEnum";
import type { TableColumnsType } from "@/components/LComponents/typings/tableType";
/** 省市县json数据 */
const cityJson = require("@/config/system/city/city-code");
/** 操作类型 */
const { EDIT, DETAIL } = ActionsEnum;
/** 管理员表格结构 */
export const columns: TableColumnsType[] = [
    { sort: 1, title: "ID", dataIndex: "adId", hideInTable: true, hideInSearch: true, hiddenForm: true },
    { sort: 2, title: "姓名", dataIndex: "adName", required: true },
    { sort: 3, title: "角色", dataIndex: "roName", hideInSearch: true, hiddenForm: true }, // 表格数据
    { sort: 5, title: "账号", dataIndex: "adAccount", hideInSearch: true, hiddenAction: [EDIT], rules: [
        { required: true, message: "请输入账号" },
        { validator: (_, value: string) => {
            if (!/^[A-Za-z0-9]+$/.test(value)) return Promise.reject("账号格式应为字母或数字");
            return Promise.resolve();
        }}
    ]},
    { sort: 6, title: "密码", dataIndex: "adPassword", valueType: "password", required: true, hideInTable: true, hideInSearch: true, hiddenAction: [EDIT, DETAIL] },
    { sort: 7, title: "手机号", dataIndex: "adPhone", required: true },
    { sort: 8, title: "城市", dataIndex: "adCity", valueType: "cascader", required: true, fieldProps: { options: cityJson, changeOnSelect: true }},
    { sort: 9, title: "状态", dataIndex: "adStatus", required: true, valueType: "select", valueEnum: StatusEnum },
]
/** 角色迁移form结构 */
export const roleMoveColumns: TableColumnsType[] = [
    { sort: 1, title: "管理员ID", dataIndex: "adIds", hiddenForm: true },
]