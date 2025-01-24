import Config from '@/config';
import type { ResDto, ResPageDto } from '@/typings/common/res';
import * as user from '@/utils/user';
import { sm4 } from 'sm-crypto';
/**
 * 返回ProTable需要的列表数据格式
 * @param res 分页返参数据
 * @param keyName 要转换key的字段名称, id = key: item.id
 */
type ConvertTableType<T = unknown> = {
    response: ResDto<ResPageDto<T[]>> | null;
    callback?: (list: T[]) => Record<string, any>[];
};
export const convertProTableData = <T = unknown>(params: ConvertTableType<T>) => {
    const { response, callback } = params;
    if (response) {
        const { total, list } = response.data;
        if (callback) {
            const data = callback(list);
            return { success: true, data, total };
        } else {
            return { success: true, data: list, total };
        }
    }
    return { success: true, data: [], total: 0 };
};
/**
 * 列表转树形菜单 label / value
 */
export type ListToTreeType = {
    list: Record<string, any>[];
    pidName: string;
    idName: string;
    labelName: string;
    pidValue?: string;
    valueType?: 'number' | 'string';
};
export type TreeType = {
    title: string;
    label: string;
    value: string | number;
    key: string | number;
    children?: TreeType[];
};
export const listToTree = ({
    list = [],
    pidName = 'pid',
    idName = 'id',
    labelName = 'label',
    pidValue = '0',
    valueType = 'string',
}: ListToTreeType): TreeType[] => {
    const array: TreeType[] = [];
    list.forEach((item) => {
        const pid =
            typeof item[pidName] === 'number' ? item[pidName] : item[pidName].split(',').pop(); // 父id为逗号分隔字符，取数组最后一个值
        if (pid.toString() === pidValue.toString()) {
            const value = valueType === 'number' ? +item[idName] : item[idName].toString();
            array.push({
                value,
                key: value,
                title: item[labelName],
                label: item[labelName],
                children: listToTree({ list, pidName, idName, labelName, pidValue: item[idName] }),
            });
        }
    });
    return array;
};
/**
 * 列表转树形菜单，保持原始数据
 */
export type ListToTreeDataType<T = unknown> = {
    [key in keyof T]: T[key];
} & {
    key: string | number;
    children: T[] | null;
};
export const listToTreeData = <T = unknown>({
    list = [],
    pidName = 'pid',
    idName = 'id',
    labelName = 'label',
    pidValue = '0',
    valueType = 'string',
}: ListToTreeType): ListToTreeDataType<T>[] | null => {
    const array: ListToTreeDataType<T>[] = [];
    list.forEach((item) => {
        const pid =
            typeof item[pidName] === 'number' ? item[pidName] : item[pidName].split(',').pop(); // 父id为逗号分隔字符，取数组最后一个值
        if (pid.toString() === pidValue.toString()) {
            const key = valueType === 'number' ? +item[idName] : item[idName].toString();
            array.push({
                ...item,
                key,
                children: listToTreeData<T>({
                    list,
                    pidName,
                    idName,
                    labelName,
                    pidValue: item[idName],
                }),
            } as any);
        }
    });
    return array.length ? array : null;
};
/**
 * SM4 解密
 */
export const sm4Decryption = (enContent: string): string => {
    return sm4.decrypt(enContent, Config.SM4_KEY_HEX);
};

export { user };
