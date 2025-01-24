/** 统一返参 */
export interface ResDto<T = unknown> {
  code: number;
  msg: string;
  data: T;
}
/** 分页返参 */
export interface ResPageDto<T = unknown> {
  list: T; // 列表
  pageNum: number; // 当前页数
  pageSize: number; // 每页数量
  total: number; // 总数
}
/** 用户信息 */
export interface UserDto {
  id: number;
  name: string;
  account: string;
  headerImg: string;
  roleId: number;
  roleName: string;
  token: string;
}
