import React from "react";
import { Dropdown, Menu, Button } from "antd";
import { BugOutlined } from "@ant-design/icons"


const CustomerFeedback = () => {
    const items = [{ key: "issue", label: "提需求/Bug" }]
    const handleClickMenu = ({ key }) => {
        console.log(key)
        if (key === "issue") {
            window.open("https://github.com/antvis/GraphInsight/issues", "_blank");
        }
    }
    const menu =
        <Menu items={items} onClick={handleClickMenu} />

    return (
        <Dropdown overlay={menu} placement="bottom">
            <Button icon={<BugOutlined />} type="text"></Button>
        </Dropdown>
    )
}

export default CustomerFeedback;