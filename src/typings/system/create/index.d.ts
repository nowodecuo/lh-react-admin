/** 创建CURD 数据表列表返参 */
export interface CreateListDto {
    name: string;
    engine: string;
    rows: string;
    dataLength: number;
    createTime: string;
    comment: string;
}
/** 创建CURD 数据表详情返参 */
export interface CreateInfoDto extends FieldsConfigDto {
    type: string; // 类型
}
/** 创建CURD 发起创建入参 */
export interface CreateParamDto {
    tableName: string; // 表名
    cnClassName: string; // 中文名
    className: string; // 类名前缀
    methodName: string; // 方法名前缀
    functions: FunctionType[]; // 功能
    fieldsConfig?: FieldsConfigDto[]; // 字段配置
}
/** 创建CURD 发起创建返参 */
export interface CreateRespDto {
    filePath: string; // 下载地址
}
/** 字段配置 */
export interface FieldsConfigDto {
    field: string; // 字段名
    key: string; // 键类型
    componentType: string; // 组件类型
    comment: string; // 备注
}
/** 可创建的功能 */
export type FunctionType = "list" | "add" | "update" | "delete" | "batchDelete";