import { ParamType } from "@/components/LComponents/typings/tableType";

/** 管理员列表入参 */
export interface AdminListParamDto extends ParamType {
  adName: string;
  adRoleId: number;
  adCity: string;
  adPhone: string;
  adStatus: string;
}
/** 管理员信息新增、编辑入参 */
export interface AdminActionDto {
  adId?: string;
  adName: string;
  adRoleId: string;
  adAccount: string;
  adCity: string | string[];
  adPhone: string;
  adStatus: string;
}
/** 管理员信息返参 */
export interface AdminResDto extends AdminActionDto {
  adHeaderImg?: string;
  roId?: string; // 角色id
  roName?: string; // 角色名
}
/** 管理员批量更新角色入参 */
export interface AdminUpdateRoleDto {
  adIds: string;
  adRoleId: string;
}
/** 管理员个人信息更新入参 */
export interface AdminMyUpdateDto {
  adName: string;
  adAccount: string;
  adHeaderImg?: string;
  adCity: string | string[];
  adPhone: string;
}
