import Footer from '@/components/Footer';
import { Question, SelectLang } from '@/components/RightContent';
import { LinkOutlined, SmileOutlined } from '@ant-design/icons';
import { SettingDrawer } from '@ant-design/pro-components';
import { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import React from 'react';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { user } from '@/utils';
import Config from '@/config';
import { queryRoleMenuAndRule } from './services/system/role';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { UserDto } from './typings/common/res';
import type { MenuType } from './utils/routes';
// 默认头像
const initHeaderImg = require("@/assets/img/initHeaderImg.png");
/** @state */
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
// 欢迎页
const welcome = [    {
  path: "/welcome",
  name: "welcome",
  icon: <SmileOutlined />,
  component: "./Welcome",
}]
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserDto;
  menuData?: MenuType[];
  ruleData?: string[];
  loading?: boolean;
}> {
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    // 获取用户信息
    const currentUser = user.getAdminUserInfo();
    // 获取菜单
    const { menuData, ruleData } = await queryRoleMenuAndRule();
    return {
      currentUser,
      menuData,
      ruleData,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const headerImg = initialState?.currentUser?.headerImg;
  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: headerImg ? Config.IMAGE_PATH + headerImg : initHeaderImg,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu={true}>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // 左侧菜单
    menu: {
      params: { token: initialState?.currentUser?.token },
      request: async () => {
        if (!initialState?.menuData) {
          const { menuData, ruleData } = await queryRoleMenuAndRule();
          setInitialState((s) => ({ ...s, menuData, ruleData }));
          return [...welcome, ...menuData];
        }
        return [...welcome, ...(initialState?.menuData || [])];
      }
    },  
    // 脚部
    footerRender: () => <Footer />,
    // 页面改变
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser?.token && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
