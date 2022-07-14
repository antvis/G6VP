import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Collapse, message, Modal, Popconfirm, Radio, Space, Table, Tag } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import ActionList from '../../../../components/ActionList';
import CollapseCard from '../../../../components/CollapseCard';
import { updateProjectById } from '../../../../services';
import { findEngineInstanceList } from '../../../../services/engineInstace';
import { closeGraphInstance } from '../../../../services/graphcompute';
import { useContext } from '../../hooks/useContext';
import { edgeColumns, nodeColumns } from '../../uploadData/const';
import { generatorSchemaByGraphData, generatorStyleConfigBySchema } from '../../utils';
import DataSchema from './DataSchema';
import DataService from './DataService';
import DataSource from './DataSource';
import './index.less';

const { Panel } = Collapse;
interface DataPanelProps {}

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

const ServiceHeader = props => {
  const { title } = props;
  return (
    <div>
      {title}
      <Space>
        <TableOutlined />
        <EditOutlined />
        <DeleteOutlined />
      </Space>
    </div>
  );
};

const DataPanel: React.FunctionComponent<DataPanelProps> = props => {
  const { updateContext, context } = useContext();
  const { data, inputData = [], id, serviceConfig, engineInfos } = context;

  const [isVisible, setIsVisible] = useImmer(false);
  //映射后的数据
  const [initData, setInitData] = useImmer(data);

  const [instanceList, setInstanceList] = useImmer(engineInfos || []);

  const [tableType, setTableType] = useImmer('nodes');
  const [columns, setColumns] = useImmer(nodeColumns);
  const [tableData, setTableData] = useImmer(
    initData[tableType]?.map((d, i) => {
      return {
        ...d,
        key: i,
      };
    }),
  );

  const [closeLoading, setCloseLoading] = useImmer(false);

  const Header = props => {
    const { title, uid, enable } = props;
    return (
      <Space>
        {title}
        <TableOutlined onClick={() => viewTable(uid)} />
        {enable ? (
          <EyeOutlined onClick={() => invertVisiable(uid)} />
        ) : (
          <EyeInvisibleOutlined onClick={() => invertVisiable(uid)} />
        )}
        <DeleteOutlined onClick={() => handleDelete(uid)} />
      </Space>
    );
  };

  const viewTable = uid => {
    inputData.map(d => {
      if (d.uid === uid) {
        const data = eval(d.transfunc)(d.data)?.[tableType].map((d, i) => {
          return {
            ...d,
            key: i,
          };
        });
        setInitData(eval(d.transfunc)(d.data));
        setTableData(data);
      }
    });
    setIsVisible(true);
  };

  const handleDelete = uid => {
    Modal.confirm({
      title: '确定删除',
      content: '是否删除该项目？',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        deleteData(uid);
      },
      onCancel() {},
    });
  };

  const deleteData = uid => {
    let mergeData = {
      nodes: [],
      edges: [],
    };
    const filterInputData = inputData.filter(d => d.uid !== uid);
    filterInputData.map(d => {
      if (d.enable) {
        const nodesData = eval(d.transfunc)(d.data)?.nodes.map((d, i) => {
          return {
            ...d,
            key: i,
          };
        });
        const edgesData = eval(d.transfunc)(d.data)?.edges.map((d, i) => {
          return {
            ...d,
            key: i,
          };
        });
        mergeData = {
          nodes: [...mergeData.nodes, ...nodesData],
          edges: [...mergeData.edges, ...edgesData],
        };
      }
    });

    const schemaData = generatorSchemaByGraphData(mergeData);
    const newConfig = generatorStyleConfigBySchema(schemaData, context.config);

    updateProjectById(id, {
      data: JSON.stringify({
        transData: mergeData,
        inputData: filterInputData,
      }),
      projectConfig: JSON.stringify(newConfig),
      schemaData: JSON.stringify(schemaData),
    }).then(res => {
      updateContext(draft => {
        draft.key = Math.random();
      });
    });
  };

  const invertVisiable = uid => {
    let mergeData = {
      nodes: [],
      edges: [],
    };
    const resultData = JSON.parse(JSON.stringify(inputData)).map(d => {
      if (d.uid === uid) {
        d.enable = !d.enable;
      }
      return d;
    });
    resultData.map(d => {
      if (d.enable) {
        const nodesData = eval(d.transfunc)(d.data)?.nodes.map((d, i) => {
          return {
            ...d,
            key: i,
          };
        });
        const edgesData = eval(d.transfunc)(d.data)?.edges.map((d, i) => {
          return {
            ...d,
            key: i,
          };
        });
        mergeData = {
          nodes: [...mergeData.nodes, ...nodesData],
          edges: [...mergeData.edges, ...edgesData],
        };
      }
    });
    updateContext(draft => {
      draft.inputData = resultData;
      draft.data = mergeData;
    });
  };

  const onChange = value => {
    setTableData(
      initData?.[value].map((d, i) => {
        return {
          ...d,
          key: i,
        };
      }),
    );
    setColumns(columnsData[value]);
    setTableType(value);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const clearGraphScopeStorage = () => {
    localStorage.removeItem('graphScopeGraphName');
    localStorage.removeItem('graphScopeFilesMapping');
    localStorage.removeItem('activeEngineInfo');
  };

  const handleCloseGraph = async instance => {
    if (instance && instance.instanceId) {
      setCloseLoading(true);
      // 清空localstorage 中的实例、图名称和Gremlin服务地址
      const result = await closeGraphInstance(id, instance.mode === 1 ? 'LOCAL' : 'ODPS');
      setCloseLoading(false);
      clearGraphScopeStorage();

      const engineInfoResult = await findEngineInstanceList(id);
      if (engineInfoResult.success && engineInfoResult.data.length > 0) {
        setInstanceList(engineInfoResult.data);
      } else {
        setInstanceList([]);
      }

      if (result && result.success) {
        // 提示
        message.success('关闭 GraphScope 实例成功');
      }
    }
  };

  return (
    <>
      <div>
        <div className="gi-config-panel-title">数据</div>
        <CollapseCard title="图数据源" extra={<DataSource data={data} />}>
          {instanceList.map(d => {
            return (
              <ActionList
                key={`graphscope_datasource_${d.instanceId}`}
                // @ts-ignore
                title={
                  <>
                    <span style={{ color: '#08979c', marginRight: 16 }}>GraphScope 数据源</span>
                    <Tag color="red">{d.mode === 1 ? 'LOCAL' : 'ODPS'}</Tag>
                  </>
                }
                extra={
                  <Space>
                    {closeLoading ? (
                      <LoadingOutlined style={{ color: '#08979c' }} />
                    ) : (
                      <Popconfirm
                        title="关闭 GraphScope 实例，就不能使用 Gremlin 查询，请确认关闭是否关闭？"
                        onConfirm={() => handleCloseGraph(d)}
                        okText="确认"
                        cancelText="取消"
                      >
                        <DeleteOutlined style={{ color: '#08979c' }} />
                      </Popconfirm>
                    )}
                  </Space>
                }
              ></ActionList>
            );
          })}

          {inputData.map((d, i) => {
            return (
              <ActionList
                key={i}
                title={d.name}
                extra={
                  <Space>
                    <TableOutlined onClick={() => viewTable(d.uid)} />
                    {/* {d.enable ? (
                      <EyeOutlined onClick={() => invertVisiable(d.uid)} />
                    ) : (
                      <EyeInvisibleOutlined onClick={() => invertVisiable(d.uid)} />
                    )} */}
                    <DeleteOutlined onClick={() => deleteData(d.uid)} />
                  </Space>
                }
              ></ActionList>
            );
          })}
        </CollapseCard>
        <DataService projectId={id} serviceLists={serviceConfig} />
        <DataSchema />
      </div>
      <Modal title="数据预览" visible={isVisible} width={846} footer={null} onCancel={handleClose}>
        <div className={'gi-data-fliter-group'}>
          <span className={'gi-data-title'}>数据预览</span>
          <Radio.Group onChange={e => onChange(e.target.value)} defaultValue={tableType}>
            <Radio.Button value="nodes">Node</Radio.Button>
            <Radio.Button value="edges">Edge</Radio.Button>
          </Radio.Group>
        </div>
        <Table dataSource={tableData} columns={columns} scroll={{ y: 240, x: 1300 }} />
      </Modal>
    </>
  );
};

export default DataPanel;
