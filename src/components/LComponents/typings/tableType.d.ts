import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import type { TableRowSelection } from '@ant-design/pro-table/es/typing';
import type { ExpandableConfig } from 'antd/es/table/interface';
import type { Rule } from 'antd/lib/form';
import type { ReactNode, Ref } from 'react';
import type { ActionsEnum } from '../enum/tableEnum';

/** 表格 prop type */
export type PropType = {
    name?: string;
    rowKey?: string;
    tableRef?: Ref;
    formRef?: Ref<ProFormInstance | undefined>;
    title?: string; // 名称
    modalWidth?: number; // modal 宽度
    tableColumns: tableColumnsType[]; // 表格列结构
    request: (params?: ParamType<T>) => Promise<ResType<R>>; // 列表数据请求
    visible?: {
        hideModalForm?: boolean; // 隐藏详情、新增、编辑modal, 用于自定义modal时
        hideActionColumn?: boolean; // 隐藏操作列
        showCopyBtn?: boolean; // 显示复制按钮
        hideAddBtn?: boolean; // 隐藏新增按钮
        hideEditBtn?: (row?: T) => boolean; // 隐藏编辑按钮
        hideDetailBtn?: (row?: T) => boolean; // 隐藏详情按钮
        hideDelBtn?: (row?: T) => boolean; // 隐藏删除按钮
        hideBatchDelBtn?: boolean; // 隐藏批量删除按钮
        hideSearchTool?: boolean; // 隐藏筛选栏
        hideModalFormBtn?: boolean; // 隐藏modal表单默认按钮
    };
    rowSelection?: TableRowSelection; // 多选配置
    expandedRowKeys?: ExpandableConfig; // 展开功能的配置
    toolRender?: () => ReactNode[]; // 工具栏自定义dom
    actionRender?: (row?: T) => ReactNode[]; // 操作栏自定义dom
    modalFormRender?: (props: SubmitterProps) => ReactNode[]; // modal 表单底部自定义按钮dom
    modalFormRequest?: (params: T, actionType: ActionsType) => Promise<boolean>; // modal 表单提交请求
    handleActionCall?: (type: ActionsType, row: T) => void | T; // 操作事件回调
};
/** 表格 ref */
export type TableRefType = ActionType & {
    visibleModalForm: (visible: boolean) => void; // 显示隐藏modal form
    setCustomTitle: (title: string) => void; // 设置自定义form标题，actionType会设置为custom
    reload: () => void; // 刷新表格
    clearSelected: () => void; // 清除表格勾选
};
/** 表格数据结构 */
export type TableColumnsType = ProColumns & {
    hiddenForm?: boolean; // 在操作表单中隐藏，会渲染dom
    hiddenAction?: ActionsType[]; // 在各操作类型中隐藏， 不渲染dom
    required?: boolean; // 是否必填
    disabled?: boolean; // 是否禁用
    renderFormInSearch?: boolean; // 操作表单自定义dom与搜索一直
    rules?: Rule[]; // 验证规则
    sort?: number; // 排序
    formatInForm?: (value?: any) => any; // 在操作表单中转换格式
    renderInForm?: (props: RenderFormPropsType) => ReactNode; // 在操作表单中自定义dom
    renderCustomFunc?: (row: T, props: RenderFormPropsType) => boolean; // 自定义方法控制字段的显示
};
/** 表格请求入参 */
export type ParamType<T = unknown> = {
    [key in keyof T]: T[key];
} & {
    current?: number;
    pageNum?: number;
    pageSize: number;
};
/** 表格请求返参 */
export type ResType<T = unknown> = {
    total: number;
    success: boolean;
    data: T;
    params?: ParamType<any>;
};
/** 操作事件 type */
export type ActionsType =
    | ActionsEnum.ADD
    | ActionsEnum.EDIT
    | ActionsEnum.DETAIL
    | ActionsEnum.EXPORT
    | ActionsEnum.BATCH_DELETE
    | ActionsEnum.DELETE
    | ActionsEnum.COPY
    | ActionsEnum.CUSTOM;
/** 隐藏详情、新增、编辑modal props type */
export type SubmitterProps = {
    row: any;
    actionType: ActionsType;
    methods: {
        submit: () => void; // 表单提交方法
        reset: () => void; // 表单重置方法
    };
};
/** 表单 props type */
export type ModalFormPropsType = {
    mode?: 'form' | 'drawerForm'; // 使用模式：表单 | 抽屉表单
    formRef?: Ref;
    name?: string; // 表单name，用于区别多个表单
    title?: string; // 标题
    modalWidth?: number; // modal宽度
    showModal?: boolean; // 是否显示modal
    currentData: any; // 当前数据
    currentAction: ActionsType; // 当前操作类型
    columns: TableColumnsType[]; // 渲染表单结构
    hideModalFormBtn?: boolean; // 隐藏modal表单默认按钮
    handleVisibleCall?: (visible: boolean) => void; // 显示隐藏回调
    modalFormRender?: (props: SubmitterProps) => ReactNode[]; // modal 表单底部自定义按钮dom
    modalFormRequest?: (params: T, actionType: ActionsType) => Promise<boolean>; // modal 表单提交请求
};
/** 表单 ref */
export type FormRefType = ProFormInstance & { setActionText: (text: string) => void };
/** 自定义dom 参数 */
export type RenderFormPropsType = {
    key: string;
    name: string; // 索引值name
    hidden: boolean; // 隐藏表单显示，但仍然会渲染dom
    label?: string; // 名称
    disabled: boolean; // 禁用
    rules: Rule[]; // 校验规则
    initialValue: any; // 初始值
    fieldProps?: Record<string, any>;
};
/** option type */
export type LabelInValue = {
    label: string;
    value: string | number;
    children?: LabelInValue[];
};
