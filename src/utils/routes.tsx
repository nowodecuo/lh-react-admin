import LIcon from "@/components/LComponents/LIcon";
import type { MenuDataItem } from "@ant-design/pro-components";
import type { RoleMenuAndRule } from "@/typings/system/role";
/** 
 * 后台菜单转为route需要树形数据格式
 */
 export type MenuType = MenuDataItem & {
    component?: string;
 }
 export const backMenuToTree = (list: RoleMenuAndRule["backMenuList"], pidValue = "0"): MenuType[] => {
    const array: MenuType[] = [];
    list.forEach(item => {
       const pid = item.bmPids.split(",").pop(); // 父id为逗号分隔字符，取数组最后一个值
       if (pid === pidValue) {
          const data: MenuType = {
            path: item.bmPath,
            icon: item.bmIcon ? <LIcon name={item.bmIcon} /> : null,
            name: item.bmTitle,
            locale: false,
            children: backMenuToTree(list, item.bmId.toString()),
         }
         if (item.bmComponent) data.component = item.bmComponent;
         array.push(data);
       }
    });
    return array;
 };