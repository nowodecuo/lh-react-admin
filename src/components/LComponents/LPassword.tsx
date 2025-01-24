/**
 * 修改密码
 */
import { updateMyPassword, updatePassword } from "@/services/system/admin";
import { ModalForm, ProFormInstance, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useRef } from "react";
import type { FormInstance } from "antd/node_modules/rc-field-form";

type PropsType = {
    id: number | string; // 管理员id
    visible: boolean; // 显示隐藏modal
    isUpdateMyself?: boolean; // 是否修改个人密码
    handleVisibleCall?: (visible: boolean) => void; // 显示隐藏回调
}
type FormType = {
    id: number;
    password: string;
    confirmPassword: string;
}

const LPassword = (props: PropsType) => {
    const { visible, handleVisibleCall, id, isUpdateMyself } = props;
    const formRef = useRef<ProFormInstance>();
    /**
     * 密码强度校验
     */
    const passwordCheck = (value: string) => {
        const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
        if (!pwdRegex.test(value)) {
            return false;
        }
        return true;
    }
    /**
     * 密码校验
     */
    const passwordValidator = (info: any, value: string, getFieldValue: FormInstance["getFieldValue"]) => {
        const password = getFieldValue("password");
        if (info.field === "confirmPassword" && value !== password) {
            return Promise.reject(new Error("新密码与确认密码不一致"));
        }
        if (!passwordCheck(value)) {
            return Promise.reject(new Error("密码复杂度太低（密码中必须包含字母、数字、特殊字符）"));
        }
        return Promise.resolve();
    }
    /**
     * 隐藏显示处理
     */
    const handleVisible = (visible: boolean) => {
        if (!visible) formRef.current?.resetFields();
        if (handleVisibleCall) handleVisibleCall(visible);
    }

    return (
        <ModalForm
            key="l-password"
            name="l_password"
            title="修改密码"
            formRef={formRef}
            width={600}
            visible={visible}
            onVisibleChange={handleVisible}
            onFinish={async (params: FormType) => {
                const { id, password } = params;
                const { response } = isUpdateMyself ? await updateMyPassword(id, password) : await updatePassword(id, password);
                if (response) {
                    message.success("修改成功");
                    return true;
                }
                return false;
            }}
        >
            <ProFormText 
                name="id" 
                label="管理员ID" 
                hidden={true}
                initialValue={id}
            />
            <ProFormText.Password 
                name="password" 
                label="新密码" 
                placeholder="请输入新密码" 
                rules={[
                    { required: true, message: "请输入新密码" },
                    ({ getFieldValue }) => ({ validator: (_, value) => passwordValidator(_, value, getFieldValue) }),
                ]}
            />
            <ProFormText.Password 
                name="confirmPassword" 
                label="确认密码" 
                placeholder="请输入确认密码" 
                rules={[
                    { required: true, message: "请输入确认密码" },
                    ({ getFieldValue }) => ({ validator: (_, value) => passwordValidator(_, value, getFieldValue) }),
                ]}
            />
        </ModalForm>
    )
}

export default LPassword;