import React, { useRef, useState } from "react";
import { message } from "antd";
import Config from "@/config";
import { PageContainer, ProFormInstance } from "@ant-design/pro-components";
import { convertProTableData } from "@/utils";
import { ActionsEnum } from "@/components/LComponents/enum/tableEnum";
import { columns } from "@/config/system/log";
import { Access, useAccess } from "@umijs/max";
import { queryTableList, batchDeleteData } from "@/services/system/log";
import LTable from "@/components/LComponents/LTable"; // 表格组件
import type { LogListParamDto, LogResDto } from "@/typings/system/log";
import type { ActionsType, TableRefType } from "@/components/LComponents/typings/tableType";
const LogList: React.FC = () => {
    const tableRef = useRef<TableRefType>(); // 表格ref
    const formRef = useRef<ProFormInstance>(); // 表单ref
    const [selectIds, setSelectIds] = useState<string>(); // ids数据
    const access = useAccess(); // 权限
    /** 获取表格数据 */
    const getTableList = async (params: LogListParamDto) => {
        if (params.dateRange) {
            const [starTime, endTime] = params.dateRange;
            params.startTime = `${starTime} 00:00:00`;
            params.endTime = `${endTime} 23:59:59`;
            delete params.dateRange;
        }
        const { response } = await queryTableList(params);
        return convertProTableData<LogResDto>({ response });
    }
    /** 操作事件回调 */
    const handleActionCall = async (actionType: ActionsType) => {
        // 批量删除数据
        if (actionType === ActionsEnum.BATCH_DELETE) {
            if (!selectIds) {
                message.error("请选择要删除的数据");
                return;
            }
            const { response } = await batchDeleteData(selectIds);
            if (response) {
                message.success("删除成功");
                tableRef.current?.clearSelected(); // 清空勾选
                tableRef.current?.reload();
            }
        }
    }
    /** 多选事件 */
    const handleRowSelection = (selectedRowKeyArr: React.Key[]) => {
        setSelectIds(selectedRowKeyArr.join(","));
    }

    return (
        <PageContainer>
            <Access accessible={access.logList} fallback={Config.RULE_CHECK_ERROR}>
                <LTable
                    title="日志"
                    rowKey="loId"
                    tableRef={tableRef}
                    formRef={formRef}
                    tableColumns={columns}
                    visible={{
                        hideAddBtn: true,
                        hideEditBtn: () => true,
                        hideDelBtn: () => true,
                        hideBatchDelBtn: !access.logBatchDelete,
                    }}
                    request={getTableList}
                    handleActionCall={handleActionCall}
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                        onChange: handleRowSelection,
                    }}
                />
            </Access>
       </PageContainer>
    )
}
export default LogList;