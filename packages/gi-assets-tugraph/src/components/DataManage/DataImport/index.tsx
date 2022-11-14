// @ts-nocheck
import * as React from "react";
import { useContext } from "@alipay/graphinsight";
import { GraphinData } from "@antv/graphin";
import { useImmer } from "use-immer";
import { Col, Row, Statistic, Tag, Select, notification } from "antd";
import { CollapseCard } from "../../../components-ui";
import Import from "./Import";
import {
  queryVertexLabelCount,
  querySubGraphList,
  queryGraphSchema
} from "../../../services/TuGraphService";

const { Option } = Select;
export interface DataImportProps {}

const DataImport: React.FunctionComponent<DataImportProps> = props => {
  const useToken = localStorage.getItem("TUGRAPH_USER_TOKEN");

  const { graph, updateContext } = useContext();
  const [state, setState] = useImmer({
    data: {
      nodes: [],
      edges: []
    },
    count: {
      node: 0,
      edge: 0
    },
    subGraphList: [],
    defaultGraphName: localStorage.getItem("CURRENT_TUGRAPH_SUBGRAPH")
  });

  const getVertexLabelCount = async () => {
    const result = await queryVertexLabelCount(state.defaultGraphName);
    if (!result.success) {
      return;
    }
    const { data } = result;
    setState(draft => {
      draft.count = {
        node: data.nodeCount,
        edge: data.edgeCount
      };
    });
  };

  const getSubGraphList = async () => {
    const result = await querySubGraphList();
    if (!result.success) {
      notification.error({
        message: "查询子图列表失败",
        description: `查询失败：${result.message}`
      });
      return;
    }

    setState(draft => {
      draft.subGraphList = result.data;
    });
  };

  const handleChange = async value => {
    setState(draft => {
      draft.defaultGraphName = value;
    });
    localStorage.setItem("CURRENT_TUGRAPH_SUBGRAPH", value);

    // 切换子图后，同步查询 Schema
    const schemaData = await queryGraphSchema({
      graphName: value
    });
    console.log(schemaData);
    updateContext(draft => {
      draft.schemaData = schemaData;
    });
  };

  React.useEffect(() => {
    graph.on("graphin:datachange", () => {
      const res = graph.save() as GraphinData;
      setState({
        ...state,
        data: res
      });
    });
  }, [graph]);

  React.useEffect(() => {
    if (useToken) {
      getVertexLabelCount();
    }
  }, [state.defaultGraphName]);

  React.useEffect(() => {
    if (useToken) {
      getSubGraphList();
    }
  }, []);
  const { data, count, subGraphList } = state;

  return (
    <div>
      <CollapseCard title="图数据" extra={<Import />}>
        <div
          style={{
            borderBottom: "1px solid #d9d9d9",
            marginBottom: "14px",
            padding: "0px 0px 14px 0px"
          }}
        >
          {useToken ? (
            <>
              <Tag color="green">已连接</Tag>
              <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                TuGraph 数据源已连接, 开始分析
              </span>
            </>
          ) : (
            <>
              <Tag color="red">未连接</Tag>
              <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                TuGraph 数据源未连接, 请先连接
              </span>
            </>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          选择子图：
          <Select
            showSearch
            placeholder="请选择要查询的子图"
            size="small"
            defaultValue={state.defaultGraphName}
            onChange={handleChange}
            style={{ width: 215 }}
          >
            {subGraphList.map((d: any) => {
              return (
                <Option value={d.value}>
                  {!d.description ? d.label : `${d.label}(${d.description})`}
                </Option>
              );
            })}
          </Select>
        </div>
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Statistic title="节点规模" value={count.node} />
          </Col>
          <Col span={12}>
            <Statistic title="边规模" value={count.edge} />
          </Col>
        </Row>
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Statistic title="当前节点" value={data.nodes.length} />
          </Col>
          <Col span={12}>
            <Statistic title="当前边" value={data.edges.length} />
          </Col>
        </Row>
      </CollapseCard>
    </div>
  );
};

export default DataImport;
