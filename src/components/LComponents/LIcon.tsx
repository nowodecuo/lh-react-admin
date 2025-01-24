/**
 * 图标组件
 */
import * as Icons from "@ant-design/icons";
import React from "react";

const LIcon = (props: { name: string }) => {
    const { name } = props;
    const icon: { [key: string]: any } = Icons;
    return React.createElement(icon[name]);
}

export default LIcon;