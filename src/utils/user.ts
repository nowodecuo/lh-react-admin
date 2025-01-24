import Config from '@/config';
import type { UserDto } from '@/typings/common/res';
import { common } from 'lh-work-tools';
/**
 * 获取管理员用户缓存信息
 */
export const getAdminUserInfo = (): UserDto | undefined => {
  const userInfo = common.getLocalStorage(Config.ADMIN_USER_KEY, Config.DES_KEY_HEX);
  return userInfo ? JSON.parse(userInfo) : undefined;
};
/**
 * 设置管理员用户缓存信息
 */
export const setAdminUserInfo = (userInfo: UserDto): boolean => {
  return common.setLocalStorage(Config.ADMIN_USER_KEY, userInfo, Config.DES_KEY_HEX);
};
/**
 * 删除管理员用户缓存
 */
export const deleteAdminUserInfo = () => {
  localStorage.removeItem(Config.ADMIN_USER_KEY);
};
