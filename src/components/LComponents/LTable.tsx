/* eslint-disable @typescript-eslint/no-use-before-define */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import ProTable from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import { common } from 'lh-work-tools';
import { useImperativeHandle, useRef, useState } from 'react';
import { ActionsEnum } from './enum/tableEnum';
import LModalForm from './LModalForm';
import type { ActionsType, ParamType, PropType, TableColumnsType } from './typings/tableType';

const LTable = (props: PropType) => {
    const {
        title,
        rowKey,
        name,
        tableRef,
        formRef,
        tableColumns,
        visible,
        expandedRowKeys,
        rowSelection,
        toolRender,
        actionRender,
        handleActionCall,
        modalFormRequest,
        modalFormRender,
    } = props;
    const refs = useRef<ActionType>();
    const [formTitle, setFormTitle] = useState<string>(title || '');
    const [showModal, setShowModal] = useState<boolean>(false); // 显示隐藏Modal
    const [currentAction, setCurrentAction] = useState<ActionsType>(ActionsEnum.ADD); // 当前操作类型
    const [currentData, setCurrentData] = useState<Record<string, any>>({} as any); // 当前信息
    const [currentParamData, setCurrentParamData] = useState<ParamType<any>>({} as any); // 当前筛选信息
    /** 表格结构 */
    const otherColumns: TableColumnsType[] = [
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_: any, row: any) => [
                actionRender && actionRender(row),
                hideActionBtn(ActionsEnum.COPY, row) && (
                    <a key="copy" onClick={() => handleAction(ActionsEnum.COPY, row)}>
                        复制
                    </a>
                ),
                !hideActionBtn(ActionsEnum.EDIT, row) && (
                    <a key="edit" onClick={() => handleAction(ActionsEnum.EDIT, row)}>
                        编辑
                    </a>
                ),
                !hideActionBtn(ActionsEnum.DETAIL, row) && (
                    <a key="detail" onClick={() => handleAction(ActionsEnum.DETAIL, row)}>
                        详情
                    </a>
                ),
                !hideActionBtn(ActionsEnum.DELETE, row) && (
                    <a key="delete" onClick={() => handleAction(ActionsEnum.DELETE, row)}>
                        删除
                    </a>
                ),
            ],
        },
    ];
    const newTableColumns = common.array.arraySort(tableColumns, 'sort', 'asc'); // 排序
    const columns: TableColumnsType[] = visible?.hideActionColumn
        ? newTableColumns
        : newTableColumns.concat(otherColumns);
    /** 注册父组件方法 */
    useImperativeHandle(tableRef, () => ({
        visibleModalForm,
        setCustomTitle,
        clearSelected: refs.current?.clearSelected,
        reload: refs.current?.reload,
    }));
    /**
     * 查询表格数据
     * @param params 请求入参
     */
    async function queryTableData(params: ParamType<any>) {
        const initParam: ParamType = { ...params, pageNum: params?.current };
        if (initParam?.current) delete initParam?.current;
        const res = await props.request(initParam);
        setCurrentParamData(initParam || ({} as any));
        return res;
    }
    /**
     * 操作事件
     * @param type 操作类型
     * @param data 操作的数据
     */
    async function handleAction(type: ActionsType, data: any = null) {
        // 设置当前操作类型
        setCurrentAction(type);
        // 操作类型对应的执行方法
        const actionMap: Record<string, any> = {
            [ActionsEnum.ADD]: async () => {
                await handleActionCallBack(type, data);
                setShowModal(true);
            },
            [ActionsEnum.COPY]: async () => {
                const isSet = await handleActionCallBack(type, data);
                if (!isSet) setCurrentData(data); // 没有回调返参时，设置当前详情信息
                setShowModal(true);
            },
            [ActionsEnum.EDIT]: async () => {
                const isSet = await handleActionCallBack(type, data);
                if (!isSet) setCurrentData(data); // 没有回调返参时，设置当前详情信息
                setShowModal(true);
            },
            [ActionsEnum.DETAIL]: async () => {
                const isSet = await handleActionCallBack(type, data);
                if (!isSet) setCurrentData(data); // 没有回调返参时，设置当前详情信息
                setShowModal(true);
            },
            [ActionsEnum.DELETE]: () => {
                Modal.confirm({
                    content: '确认删除该数据吗？',
                    onOk: () => handleActionCallBack(type, data),
                });
            },
            [ActionsEnum.BATCH_DELETE]: () => {
                Modal.confirm({
                    content: '确认删除选中的数据吗？',
                    onOk: () => handleActionCallBack(type, data),
                });
            },
        };
        // 执行操作方法
        if (actionMap[type]) await actionMap[type]();
    }
    /**
     * 操作事件回调
     * @param type 操作类型
     * @param data 当前操作数据
     */
    async function handleActionCallBack(type: ActionsType, data: any = null) {
        if (handleActionCall) {
            // 如果返回参数，则将参数赋值给当前信息
            const res = await handleActionCall(type, data);
            if (res) {
                setCurrentData(res);
                return true;
            }
        }
        return false;
    }
    /**
     * 隐藏操作按钮
     * @param type 操作类型
     * @param data 当前操作数据
     */
    function hideActionBtn(type: ActionsType, data: Record<string, any>) {
        const map: Record<string, any> = {
            [ActionsEnum.COPY]: visible?.showCopyBtn,
            [ActionsEnum.EDIT]: visible?.hideEditBtn ? visible?.hideEditBtn(data) : false,
            [ActionsEnum.DETAIL]: visible?.hideDetailBtn ? visible?.hideDetailBtn(data) : false,
            [ActionsEnum.DELETE]: visible?.hideDelBtn ? visible?.hideDelBtn(data) : false,
        };
        return map[type] || false;
    }
    /** 隐藏或显示modal */
    function visibleModalForm(show: boolean) {
        setShowModal(show);
        if (!show) {
            setCurrentData({} as any);
            setFormTitle(title || '');
        }
    }
    /** 设置自定义标题，当前操作类型设置为custom */
    function setCustomTitle(title: string) {
        setCurrentAction(ActionsEnum.CUSTOM);
        setFormTitle(title);
    }

    return (
        <div className="l-table">
            <ProTable
                name={name || 'l-table'}
                rowKey={rowKey || 'key'}
                actionRef={refs}
                columns={columns}
                search={visible?.hideSearchTool ? false : { defaultCollapsed: false }}
                request={queryTableData}
                expandable={expandedRowKeys}
                rowSelection={rowSelection}
                pagination={{ pageSize: 10 }}
                toolBarRender={() => [
                    toolRender && toolRender(),
                    !visible?.hideAddBtn && (
                        <Button
                            key="add"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAction(ActionsEnum.ADD)}
                        >
                            新 增
                        </Button>
                    ),
                    !visible?.hideBatchDelBtn && (
                        <Button
                            key="batchDelete"
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={() => handleAction(ActionsEnum.BATCH_DELETE, currentParamData)}
                        >
                            批量删除
                        </Button>
                    ),
                ]}
            />
            {/** 新增、编辑、详情Modal */}
            {!visible?.hideModalForm && (
                <LModalForm
                    name={name}
                    formRef={formRef}
                    title={formTitle}
                    showModal={showModal}
                    hideModalFormBtn={visible?.hideModalFormBtn}
                    currentAction={currentAction}
                    currentData={currentData}
                    columns={newTableColumns}
                    modalFormRender={modalFormRender}
                    handleVisibleCall={visibleModalForm}
                    modalFormRequest={modalFormRequest}
                />
            )}
        </div>
    );
};

export default LTable;
