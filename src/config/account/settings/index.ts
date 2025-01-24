import type { TableColumnsType } from "@/components/LComponents/typings/tableType";
/** 省市县json数据 */
const cityJson = require("@/config/system/city/city-code");
/** 个人设置结构 */
export const columns: TableColumnsType[] = [
    { sort: 1, title: "姓名", dataIndex: "adName", required: true },
    { sort: 2, title: "角色", dataIndex: "roName", disabled: true },
    { sort: 3, title: "头像", dataIndex: "adHeaderImg", hiddenForm: true },
    { sort: 4, title: "账号", dataIndex: "adAccount", hideInSearch: true, rules: [
        { required: true, message: "请输入账号" },
        { validator: (_, value: string) => {
            if (!/^[A-Za-z0-9]+$/.test(value)) return Promise.reject("账号格式应为字母或数字");
            return Promise.resolve();
        }}
    ]},
    { sort: 5, title: "手机号", dataIndex: "adPhone", required: true },
    { sort: 6, title: "城市", dataIndex: "adCity", valueType: "cascader", required: true, fieldProps: { options: cityJson, changeOnSelect: true }},
]