import { extra, useContext } from "@alipay/graphinsight";
import { DeleteOutlined, TableOutlined } from "@ant-design/icons";
import { Col, Row, Space, Statistic } from "antd";
import * as React from "react";
import { CollapseCard } from "../../../components-ui";
import ActionList from "../../../components-ui/ActionList";
import Import from "./Import";

const { GIAComponent, deepClone } = extra;

export interface MyCounterProps {}

const MyCounter: React.FunctionComponent<MyCounterProps> = (props) => {
  const context = useContext();
  const handleImport = () => {};

  return (
    <div>
      <CollapseCard title="图数据" extra={<Import />}>
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Statistic title="节点规模" value={112893} />
          </Col>
          <Col span={12}>
            <Statistic title="边规模" value={412893} />
          </Col>
        </Row>
        <div
          style={{
            borderTop: "1px solid #d9d9d9",
            marginTop: "12px",
            padding: "8px 0px",
          }}
        >
          <ActionList
            title={"xxx-odps-xxx-1"}
            extra={
              <Space>
                <TableOutlined />
                <DeleteOutlined />
              </Space>
            }
          ></ActionList>
          <ActionList
            title={"xxx-odps-xxx-2"}
            extra={
              <Space>
                <TableOutlined />
                <DeleteOutlined />
              </Space>
            }
          ></ActionList>
        </div>
      </CollapseCard>
    </div>
  );
};

export default MyCounter;
