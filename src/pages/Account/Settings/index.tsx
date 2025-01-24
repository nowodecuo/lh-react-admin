import React, { useEffect, useRef, useState } from "react";
import Config from "@/config";
import { Button, message, Card } from "antd";
import { useModel } from "@umijs/max";
import { flushSync } from "react-dom";
import LModalForm from "@/components/LComponents/LModalForm"; // 表单组件
import LUpload from "@/components/LComponents/LUpload"; // 上传组件
import LPassword from "@/components/LComponents/LPassword"; // 密码修改组件
import { ActionsEnum } from "@/components/LComponents/enum/tableEnum";
import { columns } from "@/config/account/settings";
import { getAdminUserInfo, setAdminUserInfo } from "@/utils/user";
import { querymMyAdminData, updateMyAdminData } from "@/services/system/admin";
import styles from "@/assets/style/user/setting.less";
import type { ActionsType, FormRefType } from "@/components/LComponents/typings/tableType";
import type { AdminResDto } from "@/typings/system/admin";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
// 默认头像
const initHeaderImg = require("@/assets/img/initHeaderImg.png");
// 头像组件 方便以后独立，增加裁剪之类的功能
type AvatarType = {
    avatar: string;
    actionType: ActionsType;
    onSuccess: (info: UploadChangeParam<UploadFile>) => void;
}
const AvatarView = ({ avatar, actionType, onSuccess }: AvatarType) => {
    return (
        <div className={styles.avatar_content}>
            <div className={styles.avatar_content_left}>
                <div className={styles.avatar_title}>头像</div>
                <div className={styles.avatar}>
                    <img src={avatar || initHeaderImg} alt="avatar" />
                </div>
                <LUpload
                    visibleBtn={actionType === ActionsEnum.EDIT ? true : false}
                    btnText="更新头像"
                    showUploadList={false}
                    onSuccess={onSuccess}
                />
            </div>
            <div className={styles.avatar_content_right}></div>
        </div>
    )
};

const Settings: React.FC = () => {
    const { initialState, setInitialState } = useModel("@@initialState");
    const refs = useRef<FormRefType>();
    const [currentAction, setCurrentAction] = useState<ActionsType>(ActionsEnum.DETAIL); // 当前操作类型
    const [currentData, setCurrentData] = useState<AdminResDto>({} as any); // 当前信息 
    const [avatar, setAvatar] = useState<string>(""); // 头像地址
    const [pwdVisble, setPwdVisible] = useState<boolean>(false); // 密码修改显示隐藏
    /** 获取个人信息 */
    const getAdminData = async () => {
        const { response } = await querymMyAdminData();
        if (response && response.data) {
            const { data } = response;
            data.adCity = (data.adCity as string).split(",");
            if (data.adHeaderImg) setAvatar(Config.IMAGE_PATH + data.adHeaderImg);
            setCurrentData(data);
        } else {
            message.error("未获取到个人信息");
        }
    }
    /** 个人信息 */
    useEffect(() => {
        getAdminData();
    }, [])
    /** 个人信息更新提交 */
    const handleFinish = async () => {
        if (refs.current?.getFieldsFormatValue) {
            const data: AdminResDto = refs.current?.getFieldsFormatValue(); // 获取表单数据
            await refs.current?.validateFields(); // 校验表单
            data.adCity = (data.adCity as string[]).join(","); // 城市转为字符串
            const { response } = await updateMyAdminData(data);
            if (response) {
                // 更新头像
                flushSync(() => setInitialState((s) => {
                    const currentUser = { ...s?.currentUser, headerImg: data.adHeaderImg } as any;
                    return { ...s, currentUser };
                }));
                const userInfo = getAdminUserInfo();
                setAdminUserInfo({ ...userInfo, headerImg: data.adHeaderImg } as any);
                message.success("更新成功");
                setCurrentAction(ActionsEnum.DETAIL); // 设置操作为详情
            }
            return;
        }
        message.error("更新失败");
    };
    /** 上传成功处理 */
    const handleSuccess = (info: UploadChangeParam<UploadFile>) => {
        const { code, data, msg } = info.file.response;
        if (code === Config.SUCCESS_CODE) {
            refs.current?.setFieldsValue({ adHeaderImg: data }); // 设置头像值
            setAvatar(Config.IMAGE_PATH + data); // 设置预览头像值
            message.success("上传成功");
        } else {
            message.error(msg || "上传失败");
        }
    };

    return (
        <>
            <Card
                title="个人设置"
                extra={currentAction === ActionsEnum.DETAIL
                    ? <>
                        <Button type="primary" onClick={() => setPwdVisible(true)}>修改密码</Button>
                        <Button style={{ marginLeft: "10px" }} onClick={() => setCurrentAction(ActionsEnum.EDIT)}>编辑信息</Button>
                    </>
                    : <>
                        <Button style={{ marginLeft: "10px" }} type="primary" onClick={handleFinish}>提交更新</Button>
                        <Button style={{ marginLeft: "10px" }} onClick={(() => setCurrentAction(ActionsEnum.DETAIL))}>取 消</Button>
                    </>
                }
            >
                <div className={styles.baseView}>
                    <div className={styles.left}>
                        <LModalForm
                            mode="form"
                            formRef={refs}
                            hideModalFormBtn={true}
                            currentAction={currentAction}
                            currentData={currentData}
                            columns={columns}
                        />
                    </div>
                    <div className={styles.right}>
                        <AvatarView avatar={avatar} actionType={currentAction} onSuccess={handleSuccess} />
                    </div>
                </div>
            </Card>
            {/** 修改密码 */}
            <LPassword isUpdateMyself visible={pwdVisble} id={initialState?.currentUser?.id || 0} handleVisibleCall={(visible) => setPwdVisible(visible)} />
        </>
    );
};

export default Settings;
