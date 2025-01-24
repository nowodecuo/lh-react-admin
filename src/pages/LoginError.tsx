import Config from '@/config';
import { history, useModel, useParams } from '@umijs/max';
import { Button, Result } from 'antd';
import React, { useEffect } from 'react';
/** 登录信息错误页面 */
const LoginError: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const { code } = useParams() as any; // 获取错误code
  const codeMap: Record<number, any> = {
    [Config.EXPIRE_LOGIN]: { label: '登录过期', value: '您的身份已过期，请重新登录' },
    [Config.NOT_LOGIN]: { label: '未登录', value: '您还未登录，请前往登录' },
    [Config.USER_EXTRUSION]: { label: '其他设备登录', value: '您已在其他设备登录' },
  };
  const title = codeMap[code] ? codeMap[code].label : '登录错误';
  const subTitle = codeMap[code] ? codeMap[code].value : '您登录信息遇到点问题，请重新登录';
  // 清空登录信息
  useEffect(() => {
    setInitialState((s) => ({ ...s, currentUser: undefined, ruleData: undefined }));
  }, []);

  return (
    <Result
      status="500"
      title={title}
      subTitle={subTitle}
      extra={
        <Button type="primary" onClick={() => history.push('/user/login')}>
          重新登录
        </Button>
      }
    />
  );
};

export default LoginError;
