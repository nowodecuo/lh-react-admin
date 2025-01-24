import React, { useRef, useState } from "react";
import { Card, Form, Input, message, Modal, Select, Table } from "antd";
import Config from "@/config";
import { PageContainer, ProFormInstance } from "@ant-design/pro-components";
import { tableColumns, tableInfoColumns, componentOptions, functionOptions, createTypeOptions } from "@/config/system/create";
import { Access, useAccess } from "@umijs/max";
import { queryTableList, queryTableInfo, handleCreateCurd, downloadCreateCurd } from "@/services/system/create";
import LTable from "@/components/LComponents/LTable"; // 表格组件
import { ComponentEnum } from "@/components/LComponents/enum/tableEnum";
import type { TableRefType } from "@/components/LComponents/typings/tableType";
import type { CreateInfoDto, CreateListDto } from "@/typings/system/create";

const CreateList: React.FC = () => {
    const tableRef = useRef<TableRefType>(); // 表格ref
    const formRef = useRef<ProFormInstance>(); // 表单ref
    const [createForm] = Form.useForm(); // 创建表单hook
    const access = useAccess(); // 权限
    const [showModal, setShowModal] = useState<boolean>(false); // 数据表详情隐藏|显示
    const [showCurdModal, setShowCurdModal] = useState<boolean>(false); // curd下载隐藏|显示
    const [filePath, setFilePath] = useState<string | null>(null); // 代码压缩包下载地址
    const [tableName, setTableName] = useState<string>(); // 数据表名称
    const [tableInfo, setTableInfo] = useState<CreateInfoDto[]>([]); // 数据表详情
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]); // 已选的字段名数组
    const newTableInfoColumns = tableInfoColumns.concat([
        { title: "组件类型", dataIndex: "componentType", render: (_, record: CreateInfoDto, index: number) => (
            <Select 
                style={{ width: 120 }} 
                options={componentOptions} 
                defaultValue={ComponentEnum.TEXT} 
                onChange={(value: string) => {
                    const item = { ...record, componentType: value };
                    const newTableInfo = [...tableInfo];
                    newTableInfo[index] = item;
                    setTableInfo(newTableInfo);
                }}
            />
        ) },
    ]);
    /** 获取表格数据 */
    const getTableList = async () => {
        const { response } = await queryTableList();
        return { 
            success: true, 
            data: response ? response.data.map((item) => ({ ...item, dataLength: `${item.dataLength / 100}KB` })) : [],
            total: response ? response.data.length : 0,
        };
    }
    /** 字符串转大驼峰 | 小驼峰 */
    const stringToFormat = (content: string, type: 'big' | 'small') => {
        const text = content.replace(Config.TABLE_PREFIX, ''); // 过滤掉表前缀
        if (type === 'big') {
            return text.toLowerCase().split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join('');
        }
        return text.replace(/[-_\s]+(.)?/g, (match, group1) => group1 ? group1.toUpperCase() : '');
    }
    /** 操作事件回调，获取数据表信息 */
    const handleActionCall = async (row: CreateListDto) => {
        const { response } = await queryTableInfo(row.name);
        if (response) {
            createForm.setFieldsValue({
                tableName: row.name,
                cnClassName: row.comment,
                className: stringToFormat(row.name, 'big'),
                methodName: stringToFormat(row.name, 'small'),
                functions: ["list", "add", "update", "delete", "batchDelete"],
                createType: 'BACK', // 默认后台管理
            });
            setTableInfo(response.data.map((item) => ({ ...item, componentType: ComponentEnum.TEXT })));
            setTableName(row.name);
            setShowModal(true);
        }
    }
    /** 数据表详情关闭回调 */
    const handleModalCancel = () => {
        setShowModal(false);
        setTableInfo([]);
        setTableName(undefined);
        setSelectedKeys([]);
        createForm.resetFields();
    }
    /** 创建CURD提交 */
    const handleSubmitCreateCurd = async () => {
        await createForm.validateFields();
        if (!selectedKeys.length) {
            message.error("请勾选要创建的字段");
            return;
        }
        Modal.confirm({
            content: "确定要以勾选的字段创建CURD文件吗？",
            onOk: async () => {
                const formData = createForm.getFieldsValue(true);
                const fieldsConfig = tableInfo.filter((item) => (selectedKeys.includes(item.field))); // 筛选出勾选的字段配置
                const params = { ...formData, tableName, fieldsConfig };
                const { response } = await handleCreateCurd(params);
                if (response) {
                    handleModalCancel();
                    setFilePath(response.data.filePath);
                    setShowCurdModal(true);
                    message.success(response.msg);
                }
            }
        })
    }
    /** 压缩包下载 */
    const handleZipDownload = async () => {
        if (!filePath) {
            message.error("下载地址不存在，请重新生成代码");
            return;
        }
        const { response } = await downloadCreateCurd(filePath);
        if (response) {
            const blob = new Blob([response as unknown as Blob]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "create-curd.zip");
            link.click();
            link.remove();
        }
    }

    return (
        <PageContainer>
            <Access accessible={access.createTableList} fallback={Config.RULE_CHECK_ERROR}>
                <LTable
                    title="创建CURD"
                    rowKey="name"
                    tableRef={tableRef}
                    formRef={formRef}
                    tableColumns={tableColumns}
                    visible={{ 
                        hideSearchTool: true,
                        hideAddBtn: true,
                        hideBatchDelBtn: true,
                        hideEditBtn: () => true, 
                        hideDelBtn: () => true, 
                        hideDetailBtn: () => true, 
                    }}
                    request={getTableList}
                    actionRender={(row: CreateListDto) => [
                        access.createTableInfo && <a key="select" onClick={() => handleActionCall(row)}>选择</a>
                    ]}
                />
                {/** 数据表详情 */}
                <Modal 
                    title={`创建信息 - ${tableName}`}
                    open={showModal} 
                    width={1000}
                    maskClosable={false}
                    onCancel={handleModalCancel}
                    onOk={handleSubmitCreateCurd}
                >
                    <Card bodyStyle={{ marginBottom: 40 }} bordered={false}>
                        <Form form={createForm} labelCol={{span: 3}}>
                            <Form.Item label="功能选择" name="functions" rules={[{ required: true, message: "请选择功能" }]}>
                                <Select mode="multiple" options={functionOptions} />
                            </Form.Item>
                            <Form.Item label="中文类名" name="cnClassName" rules={[{ required: true, message: "请输入中文类名" }]}>
                                <Input placeholder="如：管理员" />
                            </Form.Item>
                            <Form.Item label="创建类型" name="createType" rules={[{ required: true, message: "请选择创建类型" }]}>
                                <Select options={createTypeOptions} />
                            </Form.Item>
                            <Form.Item label="类名前缀" name="className" rules={[{ required: true, message: "请输入类名前缀" }]}>
                                <Input placeholder="输入英文大驼峰，如：Admin | UserInfo" />
                            </Form.Item>
                            <Form.Item label="方法名前缀" name="methodName" rules={[{ required: true, message: "请输入方法名前缀" }]}>
                                <Input placeholder="输入英文小驼峰，如：admin | userInfo" />
                            </Form.Item>
                        </Form>
                    </Card> 
                    <Card title="字段信息" bordered={false}>
                        <Table rowKey="field" pagination={false} columns={newTableInfoColumns} dataSource={tableInfo} rowSelection={{ 
                            selectedRowKeys: selectedKeys,
                            onChange: (keys: React.Key[]) => {
                                setSelectedKeys(keys);
                            }}} 
                        />
                    </Card>
                </Modal>
                {/** zip包下载 */}
                <Modal 
                    title="CURD压缩包下载"
                    open={showCurdModal} 
                    maskClosable={false}
                    onCancel={() => setShowCurdModal(false)}
                    footer={null}
                >
                    <div>点击下载CURD文件包, 有效期60秒：<a onClick={handleZipDownload}>下载</a></div>
                </Modal>
            </Access>
       </PageContainer>
    )
}
export default CreateList;