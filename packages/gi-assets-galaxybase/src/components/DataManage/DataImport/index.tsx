// @ts-nocheck
import { useContext } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
import { Col, notification, Row, Select, Statistic, Tag } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { CollapseCard } from '../../../components-ui';
import { queryGraphSchema, querySubGraphList, queryVertexLabelCount } from '../../../services/GraphService';
import Import from './Import';
import $i18n from '../../../i18n';

const { Option } = Select;
export interface DataImportProps {}

const DataImport: React.FunctionComponent<DataImportProps> = props => {
  const useToken = localStorage.getItem('Galaxybase_USER_TOKEN');

  const { graph, updateContext } = useContext();
  const [state, setState] = useImmer({
    data: {
      nodes: [],
      edges: [],
    },
    count: {
      node: 0,
      edge: 0,
    },
    subGraphList: [],
    defaultGraphName: localStorage.getItem('CURRENT_GALAXYBASE_SUBGRAPH'),
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
        edge: data.edgeCount,
      };
    });
  };

  const getSubGraphList = async () => {
    const result = await querySubGraphList();
    if (!result.success) {
      notification.error({
        message: $i18n.get({
          id: 'galaxybase.DataManage.DataImport.FailedToQuerySubgraphList',
          dm: '查询子图列表失败',
        }),
        description: $i18n.get(
          {
            id: 'galaxybase.DataManage.DataImport.QueryFailedResultmessage',
            dm: '查询失败：{resultMessage}',
          },
          { resultMessage: result.message },
        ),
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
    localStorage.setItem('CURRENT_GALAXYBASE_SUBGRAPH', value);

    // 切换子图后，同步查询 Schema
    const schemaData = await queryGraphSchema({
      graphName: value,
    });
    console.log(schemaData);
    updateContext(draft => {
      draft.schemaData = schemaData;
    });
  };

  React.useEffect(() => {
    graph.on('graphin:datachange', () => {
      const res = graph.save() as GraphinData;
      setState({
        ...state,
        data: res,
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
      <CollapseCard
        title={$i18n.get({ id: 'galaxybase.DataManage.DataImport.GraphData', dm: '图数据' })}
        extra={<Import />}
      >
        <div
          style={{
            borderBottom: '1px solid #d9d9d9',
            marginBottom: '14px',
            padding: '0px 0px 14px 0px',
          }}
        >
          {useToken ? (
            <>
              <Tag color="green">{$i18n.get({ id: 'galaxybase.DataManage.DataImport.Connected', dm: '已连接' })}</Tag>
              <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                {$i18n.get({
                  id: 'galaxybase.DataManage.DataImport.GalaxybaseDataSourceConnectedStart',
                  dm: 'Galaxybase 数据源已连接, 开始分析',
                })}
              </span>
            </>
          ) : (
            <>
              <Tag color="red">{$i18n.get({ id: 'galaxybase.DataManage.DataImport.NotConnected', dm: '未连接' })}</Tag>
              <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                {$i18n.get({
                  id: 'galaxybase.DataManage.DataImport.GalaxybaseTheDataSourceIs',
                  dm: 'Galaxybase 数据源未连接, 请先连接',
                })}
              </span>
            </>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          {$i18n.get({ id: 'galaxybase.DataManage.DataImport.SelectASubgraph', dm: '选择子图：' })}

          <Select
            showSearch
            placeholder={$i18n.get({
              id: 'galaxybase.DataManage.DataImport.SelectASubgraphToQuery',
              dm: '请选择要查询的子图',
            })}
            size="small"
            defaultValue={state.defaultGraphName}
            onChange={handleChange}
            style={{ width: 215 }}
          >
            {subGraphList.map((d: any) => {
              return <Option value={d.value}>{!d.description ? d.label : `${d.label}(${d.description})`}</Option>;
            })}
          </Select>
        </div>
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Statistic
              title={$i18n.get({ id: 'galaxybase.DataManage.DataImport.NodeSize', dm: '节点规模' })}
              value={count.node}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={$i18n.get({ id: 'galaxybase.DataManage.DataImport.EdgeScale', dm: '边规模' })}
              value={count.edge}
            />
          </Col>
        </Row>
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Statistic
              title={$i18n.get({ id: 'galaxybase.DataManage.DataImport.CurrentNode', dm: '当前节点' })}
              value={data.nodes.length}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={$i18n.get({ id: 'galaxybase.DataManage.DataImport.CurrentEdge', dm: '当前边' })}
              value={data.edges.length}
            />
          </Col>
        </Row>
      </CollapseCard>
    </div>
  );
};

export default DataImport;
