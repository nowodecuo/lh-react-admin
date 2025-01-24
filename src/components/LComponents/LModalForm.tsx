import { DrawerForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormDateRangePicker, ProFormCascader, ProFormTreeSelect, ProFormDigit, ProForm, ProFormTextArea } from "@ant-design/pro-components";
import { useEffect } from "react";
import { ActionsEnum, ComponentEnum } from "./enum/tableEnum";
import { ModalFormPropsType, RenderFormPropsType, TableColumnsType } from "./typings/tableType";

const LModalForm = (props: ModalFormPropsType) => {
    const { mode, name, formRef, title, modalWidth, currentAction, showModal, currentData, columns, hideModalFormBtn, handleVisibleCall, modalFormRequest, modalFormRender } = props;
    const formMode = mode || "drawerForm";
    /** 设置当前数据 */
    useEffect(() => {
        if (formMode === "form" && formRef) formRef.current?.setFieldsValue(currentData);
        else if (formMode === "drawerForm" && showModal && formRef) formRef.current?.setFieldsValue(currentData);
    }, [showModal, currentData]);
    /**
    * 根据不同类型渲染不同组件
    * @params { column } 数据列配置
    */
    const RenderComponent = ({ column }: { column: TableColumnsType }) => {
        // 在对应的操作表单中隐藏字段
        if (column.hiddenAction?.includes(currentAction)) return null;
        // 字段类型
        const type = column.valueType as string; 
        // 字段索引
        const index = column.dataIndex as string; 
        // form组件props
        const renderProps: RenderFormPropsType = {
            key: index,
            name: index,
            hidden: column.hiddenForm || false,
            label: column.title as string || "",
            disabled: currentAction === ActionsEnum.DETAIL ? true : column.disabled || false, // 字段是否禁用，如果是详情所有字段禁用
            rules: column.rules || (column.required ? [{ required: true, message: `${column.title}不能为空` }] : []), // 验证规则
            initialValue: (column.formatInForm ? column.formatInForm(currentData[index]) : currentData[index]) || null, // 字段值，如果有格式转换则执行格式转换
            fieldProps: column.fieldProps || {},
        }
        // 自定义dom组件
        if (column.renderInForm) return column.renderInForm(renderProps);
        // 自定义方法控制字段的显示, 返回false则隐藏，true则显示
        if (column.renderCustomFunc && !column.renderCustomFunc(currentData, renderProps)) return null;
        // 渲染对应的组件
        const components: any = {
            // 文本框
            [ComponentEnum.TEXT]: () => <ProFormText {...renderProps} /> ,
            // 文本域
            [ComponentEnum.TEXTAREA]: () => <ProFormTextArea {...renderProps} /> ,
            // 密码框
            [ComponentEnum.PASSWORD]: () => <ProFormText.Password {...renderProps} />,
            // 下拉框
            [ComponentEnum.SELECT]: () => {
                const enums = column.valueEnum as Record<string, any>;
                const options = enums instanceof Array ? enums : Object.keys(enums).map((item) => ({ label: enums[item], value: item }))
                return (<ProFormSelect {...renderProps} options={options} showSearch />);
            },
            // 日期框
            [ComponentEnum.DATE]: () => <ProFormDatePicker {...renderProps} width="xl" />,
            // 日期区间框
            [ComponentEnum.DATE_RANGE]: () => <ProFormDateRangePicker {...renderProps} initialValue={renderProps.initialValue || []} width="xl" />,
            // 联级组件
            [ComponentEnum.CASCADER]: () => <ProFormCascader {...renderProps} />,
            // 树形组件
            [ComponentEnum.TREE_SELECT]: () => <ProFormTreeSelect {...renderProps} />,
            // 数字组件
            [ComponentEnum.NUMBER]: () => <ProFormDigit {...renderProps} />,
        }
        return components[type] ? components[type]() : components.text();
    }
    /** 设置标题 */
    function getTitle(title: string) {
        const { ADD, EDIT, DELETE, DETAIL, CUSTOM, EXPORT, COPY } = ActionsEnum;
        const map: Record<string, string> = {
            [ADD]: "新增",
            [EDIT]: "编辑",
            [DELETE]: "删除",
            [DETAIL]: "详情",
            [EXPORT]: "导出",
            [COPY]: "复制",
        }
        if (currentAction === CUSTOM) {
            return title
        }
        return map[currentAction] ? map[currentAction] + title : "";
    }
    /** 提交栏配置 */
    const submitter = {
        submitButtonProps: currentAction === ActionsEnum.DETAIL ? { style: { display: "none" } } : {}, // 详情时隐藏确定按钮
        render: (prop: any, defaultDom: any) => [
            !hideModalFormBtn && defaultDom,
            modalFormRender && modalFormRender({ methods: prop, actionType: currentAction, row: currentData }),
        ],
    }
    /** 提交请求 */
    const onFinish = async (params: any) => {
        if (modalFormRequest) {
            return await modalFormRequest(params, currentAction);
        }
        return false;
    }

    return (
        <>
            { formMode === "drawerForm" ? 
                <DrawerForm
                    name={name ? `${name}_form` : "l_form"}
                    formRef={formRef}
                    width={modalWidth || 600}
                    title={getTitle(title || "")}
                    visible={showModal}
                    onVisibleChange={handleVisibleCall}
                    drawerProps={{ destroyOnClose: true, maskClosable: false, forceRender: true }}
                    submitter={submitter}
                    onFinish={onFinish}
                >
                    {columns.map((item) => <RenderComponent key={`l-form-${item.dataIndex as string}`} column={item} />)}
                </DrawerForm>
                :
                <ProForm
                    name={name ? `${name}_form` : "l_form"}
                    formRef={formRef}
                    title={getTitle(title || "")}
                    submitter={submitter}
                    onFinish={onFinish}
                >
                    {columns.map((item) => <RenderComponent key={`l-form-${item.dataIndex as string}`} column={item} />)}
                </ProForm>
            }
        </>
    )
}

export default LModalForm;