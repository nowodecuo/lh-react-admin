import { ParamType } from "@/components/LComponents/typings/tableType";

/** 日志列表入参 */
export interface LogListParamDto extends ParamType {
  loContent: string;
  loMethod: string;
  loResult: string;
  loIp: string;
  loAddress: string;
  dateRange?: string[];
  startTime: string;
  endTime: string;
  adName: string;
}
/** 日志返参 */
export interface LogResDto {
  loId: string;
  loAid: string;
  loContent: string;
  loMethod: string;
  loParams: string;
  loResult: string;
  loReason: string;
  loIp: string;
  loAddress: string;
  loTime: string;
  adName: string;
  adId: string;
}
