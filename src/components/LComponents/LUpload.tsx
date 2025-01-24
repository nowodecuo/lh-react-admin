import { useModel } from "@umijs/max";
import { useState } from "react";
import { Button, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { UploadListType } from "antd/es/upload/interface";

type PropsType = {
    url?: string; // 请求地址
    headers?: Record<string, any>;
    showUploadList?: boolean; // 是否显示上传列表
    listType?: UploadListType; // 文件显示样式
    mimeType?: string[]; // 文件限制类型
    maxSize?: number; // 文件最大体积限制(kb)
    maxCount?: number; // 文件最大数量
    fileList?: UploadFile[]; // 文件列表
    visibleBtn?: boolean; // 是否显示按钮
    btnText?: string; // 按钮名称
    beforeUpload?: (file: RcFile, fileList: RcFile[]) => boolean | Promise<File> | void; // 上传前回调
    onSuccess?: (info: UploadChangeParam<UploadFile>) => void; // 成功后回调
    onError?: (info: UploadChangeParam<UploadFile>) => void; // 失败后回调
    onRemove?: (file: UploadFile) => void; // 删除列表文件回调
}

const LUpload = (props: PropsType) => {
    const { beforeUpload, onSuccess, onRemove, onError, mimeType, maxSize, maxCount, showUploadList, headers, url, btnText, visibleBtn, listType } = props;
    const { initialState } = useModel("@@initialState");
    const [loading, setLoading] = useState<boolean>(false);
    const [initFileList, setInitFileList] = useState<UploadFile[]>([]);
    /** 初始值 */
    const initShowUploadList = showUploadList ? true : showUploadList; // 是否显示上传列表
    const initMimeType = mimeType || ["image/jpeg", "image/png", "image/gif"]; // 限制类型
    const initMaxSize = maxSize || (2 * 1024); // 文件最大体积限制(kb) 默认2M
    const initMaxCount = maxCount || 1; // 最大数量
    const initBtnText = btnText || "点击上传"; // 按钮文本
    const initVisibleBtn = visibleBtn ? true : visibleBtn; // 显示按钮
    const initListType = listType || "text"; // 文件显示样式
    const initHeaders = { "admin-token": initialState?.currentUser?.token }; // 请求头部
    const initAction = url || "/api/file/upload"; // 上传地址
    /** 上传前处理 */
    const handleBeforeUpload = (file: RcFile, fileList: RcFile[]) => {
        if (!initMimeType.includes(file.type)) {
            const fileText = initMimeType.join("|");
            message.error(`请上传${fileText}类型的文件`);
            return false;
        }
        if ((file.size / 1024) > initMaxSize) {
            message.error(`请上传大小不超过${initMaxSize}KB的文件`);
            return false;
        }
        // 自定义上传前回调
        if (beforeUpload) return beforeUpload(file, fileList);
    }
    /** 删除文件列表 */
    const handleRemove = (file: UploadFile, handleCallBack: boolean = true) => {
        const newFileArray = initFileList.filter((item) => (item.uid !== file.uid));
        setInitFileList(newFileArray);
        // 删除回调
        if (handleCallBack && onRemove) onRemove(file);
    }
    /** 上传改变处理 */
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>, ) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            setInitFileList([...info.fileList]);
            return;
        }
        if (info.file.status === "error") {
            setLoading(false);
            handleRemove(info.file, false);
            // 失败处理回调
            if (onError) onError(info);
            return;
        }
        if (info.file.status === "done") {
            setLoading(false);
            setInitFileList([...info.fileList]);
            // 成功处理回调
            if (onSuccess) onSuccess(info);
            return;
        }
    }

    return (
        <Spin spinning={loading} tip="上传中...">
            <Upload
                headers={headers ? { ...headers, ...initHeaders } as any : initHeaders}
                action={initAction}
                listType={initListType}
                maxCount={initMaxCount}
                showUploadList={initShowUploadList}
                fileList={initFileList}
                beforeUpload={handleBeforeUpload}
                onChange={handleChange}
                onRemove={handleRemove}
            >
                <div>{initVisibleBtn ? <Button><UploadOutlined /> { initBtnText }</Button> : null}</div>
            </Upload>
        </Spin>
    )
}

export default LUpload;