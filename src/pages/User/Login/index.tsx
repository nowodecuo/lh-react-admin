import Footer from '@/components/Footer';
import { getVerifyCode, handleLoginChcek } from '@/services/login';
import type { UserDto } from '@/typings/common/res';
import type { LoginParamDto } from '@/typings/login';
import { sm4Decryption, user } from '@/utils';
import { InsuranceOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { message } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
const loginBg = require('@/assets/img/login-bg.png');

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

type CodeRefType = {
  getImageCapcha: () => void;
};
type CodePropsType = {
  imageCapchaCall: (uuid: string) => void;
};
/** 验证码图片组件 */
const VerifyCodeImage = forwardRef<CodeRefType, CodePropsType>((props, ref) => {
  const { imageCapchaCall } = props;
  const [codeImage, setCodeImage] = useState<string>();
  /** 获取图形验证码 */
  const getImageCapcha = async () => {
    const { response } = await getVerifyCode();
    if (response) {
      imageCapchaCall(response.data.uuid);
      setCodeImage('data:image/png;base64,' + response.data.imageBase64);
    }
  };
  useEffect(() => {
    getImageCapcha();
  }, []);

  useImperativeHandle(ref, () => ({
    getImageCapcha,
  }));

  return <img style={{ cursor: 'pointer' }} src={codeImage} width="125" onClick={getImageCapcha} />;
});

/** 登录组件  */
const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>(null);
  const codeRef = useRef<CodeRefType>(null);
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: `url(${loginBg})`,
      backgroundSize: '100% 100%',
      paddingTop: '15vh',
    };
  });
  /**
   * 保存用户信息
   */
  const handleSaveUser = async (loginResSm4: string) => {
    const userInfoJson = sm4Decryption(loginResSm4);
    const userInfo = JSON.parse(userInfoJson) as UserDto;
    await flushSync(() => setInitialState({ currentUser: userInfo }));
    await user.setAdminUserInfo(userInfo);
  };
  /**
   * 图片验证码成功回调
   */
  const imageCapchaCall = (uuid: string) => {
    formRef.current?.setFieldsValue({ uuid });
  };
  /**
   * 登录提交
   */
  const handleSubmit = async (values: LoginParamDto) => {
    const { response } = await handleLoginChcek({ ...values });
    if (response) {
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      // 保存用户信息
      await handleSaveUser(response.data);
      // 跳转路由
      setTimeout(() => {
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      }, 1500);
    } else {
      codeRef.current?.getImageCapcha(); // 报错刷新验证码
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'menu.login', defaultMessage: '登录页' })} - {Settings.title}
        </title>
      </Helmet>
      <Lang />
      <div style={{ flex: '1', padding: '32px 0' }}>
        <LoginForm
          formRef={formRef}
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{ autoLogin: true }}
          onFinish={handleSubmit}
        >
          <>
            <ProFormText
              name="account"
              fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '请输入用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '请输入密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
            <ProFormText
              name="verifyCode"
              fieldProps={{
                maxLength: 4,
                size: 'large',
                prefix: <InsuranceOutlined />,
                addonAfter: <VerifyCodeImage ref={codeRef} imageCapchaCall={imageCapchaCall} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.verifyCode.placeholder',
                defaultMessage: '请输入验证码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.verifyCode.required"
                      defaultMessage="请输入验证码!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText name="uuid" hidden={true} />
          </>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
