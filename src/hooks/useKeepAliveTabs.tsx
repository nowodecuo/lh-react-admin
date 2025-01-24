/**
 * 处理匹配过的路由信息
 */
import { useMatchRoute } from '@/hooks/useMatchRoute';
import { history } from '@umijs/max';
import { useCallback, useEffect, useState } from 'react';

export interface KeepAliveTab {
  title: string;
  routePath: string;
  key: string; // 这个key，后面刷新有用到它
  pathname: string;
  icon?: any;
  children: any;
}
/** 获取当前事件作为key */
const getKey = () => {
  return new Date().getTime().toString();
};

export const useKeepAliveTabs = () => {
  const [keepAliveTabs, setKeepAliveTabs] = useState<KeepAliveTab[]>([]);
  const [activeTabRoutePath, setActiveTabRoutePath] = useState<string>('');
  const matchRoute = useMatchRoute();
  /** 关闭tabs */
  const closeTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      const index = keepAliveTabs.findIndex((o) => o.routePath === routePath);
      if (keepAliveTabs[index].routePath === activeTabRoutePath) {
        if (index > 0) {
          history.push(keepAliveTabs[index - 1].routePath);
        } else {
          history.push(keepAliveTabs[index + 1].routePath);
        }
      }
      keepAliveTabs.splice(index, 1);
      setKeepAliveTabs([...keepAliveTabs]);
    },
    [activeTabRoutePath],
  );
  /** 关闭其他 */
  const closeOtherTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      setKeepAliveTabs((prev) => prev.filter((o) => o.routePath === routePath));
      // 如果在未激活tab关闭其他，则跳转到进行右键的页面
      if (routePath !== activeTabRoutePath) {
        setActiveTabRoutePath(routePath);
        history.push(routePath);
      }
    },
    [activeTabRoutePath],
  );

  useEffect(() => {
    if (!matchRoute) return;
    const existKeepAliveTab = keepAliveTabs.find((o) => o.routePath === matchRoute?.routePath);
    // 如果不存在则需要插入
    if (!existKeepAliveTab) {
      setKeepAliveTabs((prev) => [
        ...prev,
        {
          title: matchRoute.title,
          key: getKey(),
          routePath: matchRoute.routePath,
          pathname: matchRoute.pathname,
          children: matchRoute.children,
          icon: matchRoute.icon,
        },
      ]);
    }
    setActiveTabRoutePath(matchRoute.routePath);
  }, [matchRoute]);

  return {
    keepAliveTabs,
    activeTabRoutePath,
    closeTab,
    closeOtherTab,
  };
};
