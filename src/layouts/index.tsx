/**
 * keepAlive多标签
 * @author 1874
 */
import { KeepAliveTab, useKeepAliveTabs } from '@/hooks/useKeepAliveTabs';
import { history } from '@umijs/max';
import { Dropdown, MenuProps, Tabs } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useCallback, useMemo } from 'react';
import styles from "@/assets/style/layout/index.less";

enum OperationType {
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHER = 'close-other',
}

const KeepAliveLayout = () => {
  const { keepAliveTabs, activeTabRoutePath, closeTab, closeOtherTab } = useKeepAliveTabs();
  /** 右键菜单 */
  const menuItems: MenuProps['items'] = useMemo(
    () =>
      [
        { label: '(✪ω✪)', key: OperationType.REFRESH },
        keepAliveTabs.length <= 1 ? null : { label: '关闭', key: OperationType.CLOSE },
        keepAliveTabs.length <= 1 ? null : { label: '关闭其他', key: OperationType.CLOSEOTHER },
      ].filter((o) => o),
    [keepAliveTabs],
  );
  /** 菜单点击事件 */
  const menuClick = useCallback(
    ({ key, domEvent }: MenuInfo, tab: KeepAliveTab) => {
      domEvent.stopPropagation();
      if (key === OperationType.CLOSE) {
        closeTab(tab.routePath);
      } else if (key === OperationType.CLOSEOTHER) {
        closeOtherTab(tab.routePath);
      }
    },
    [closeOtherTab, closeTab],
  );
  /** 下拉菜单 */
  const renderTabTitle = useCallback(
    (tab: KeepAliveTab) => {
      return (
        <Dropdown
          menu={{ items: menuItems, onClick: (e) => menuClick(e, tab) }}
          trigger={['contextMenu']}
        >
          <div style={{ margin: '-12px 0', padding: '12px 0' }}>
            {tab.icon}
            {tab.title}
          </div>
        </Dropdown>
      );
    },
    [menuItems],
  );
  /** tabs数据 */
  const tabItems = useMemo(() => {
    return keepAliveTabs.map((tab, index) => {
      return {
        key: tab.routePath,
        label: renderTabTitle(tab),
        children: (
          <div key={tab.key} style={{ height: 'calc(100vh - 112px)', overflow: 'auto' }}>
            {tab.children}
          </div>
        ),
        closable: Boolean(index > 0),
      };
    });
  }, [keepAliveTabs]);
  /** tabs改变事件  */
  const onTabsChange = useCallback((tabRoutePath: string) => {
    history.push(tabRoutePath);
  }, []);
  /** tabs编辑 */
  const onTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove') {
      closeTab(targetKey as string);
    }
  };

  return (
    <Tabs
      className={styles['keep-alive-tabs']}
      type="editable-card"
      size="small"
      items={tabItems}
      activeKey={activeTabRoutePath}
      animated={false}
      hideAdd
      onChange={onTabsChange}
      onEdit={onTabEdit}
    />
  );
};

export default KeepAliveLayout;
