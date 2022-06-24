import React from "react";
import { Dropdown } from "antd";
import "./index.less"
const QRcode = () => {
    const img = (
        <img
            style={{ width: "200px",  }}
            alt="QRcode"
            src="https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*4DPGTaxGDRIAAAAAAAAAAAAAARQnAQ"
        />
    )
    return (
        <Dropdown overlay={img} placement="bottom">
            <span className="text">加入社区群</span>
        </Dropdown>
    )
}

export default QRcode;