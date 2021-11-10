import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  TableOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useDispatch, Provider, useSelector } from 'react-redux';
import { Button, Card, Collapse, Space, Modal, Radio, Table } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { nodeColumns, edgeColumns } from '../../uploadData/const';
import store, { StateType } from '../../redux';
import { updateProjectById } from '../../../../services';
import styles from './index.less';

const { Panel } = Collapse;
interface DataPanelProps {}

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

const ServiceHeader = props => {
  const { title } = props;
  return (
    <Space>
      {title}
      <TableOutlined />
      <EditOutlined />
      <DeleteOutlined />
    </Space>
  );
};

const DataPanel: React.FunctionComponent<DataPanelProps> = props => {
  const dispatch = useDispatch();
  const state = useSelector((state: StateType) => state);
  const { data, inputData, id } = state;
  const [isVisible, setIsVisible] = useImmer(false);
  //映射后的数据
  const [initData, setInitData] = useImmer(data);

  const [tableType, setTableType] = useImmer('nodes');
  const [columns, setColumns] = useImmer(nodeColumns);
  const [tableData, setTableData] = useImmer(
    initData?.[tableType].map((d, i) => {
      return {
        ...d,
        key: i,
      };
    }),
  );

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
        <DeleteOutlined onClick={() => deleteData(uid)} />
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

    updateProjectById(id, {
      data: JSON.stringify({
        transData: mergeData,
        inputData: filterInputData,
      }),
    }).then(res => {
      dispatch({
        type: 'update:key',
        key: Math.random(),
      });
    });
  };

  const invertVisiable = uid => {
    let mergeData = {
      nodes: [],
      edges: [],
    };
    const resultData = inputData.map(d => {
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

    dispatch({
      type: 'update',
      inputData: resultData,
      data: mergeData,
    });
  };

  const uploadData = () => {
    dispatch({
      type: 'update',
      isModalVisible: true,
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

  return (
    <>
      <div>
        <Card
          title="数据源"
          extra={
            <Button type="dashed" style={{ width: '100%' }} onClick={uploadData}>
              <UploadOutlined /> 导入数据
            </Button>
          }
        >
          <Collapse defaultActiveKey={['1']}>
            {inputData.map((d, i) => (
              <Panel header={<Header title={d.name} uid={d.uid} enable={d.enable} />} key={i}>
                Nodes:{d.data.nodes.length} Edges:{d.data.edges.length}
              </Panel>
            ))}
          </Collapse>
        </Card>
        <Card
          title="数据服务"
          extra={
            <Button
              type="dashed"
              style={{ width: '100%' }}
              onClick={() => {
                // window.open(`#/market/services/${projectId}`);
                window.open(`#/market/services`);
              }}
            >
              <PlusOutlined />
              新建服务
            </Button>
          }
        >
          <Collapse>
            <Panel header={<ServiceHeader title="GI_INIT_SERVICE" />} key="1"></Panel>
          </Collapse>
        </Card>
        <Card title="网络分析"></Card>
      </div>
      <Modal title="数据预览" visible={isVisible} width={846} footer={null} onCancel={handleClose}>
        <div className={styles.fliterGroup}>
          <span className={styles.title}>数据预览</span>
          <Radio.Group onChange={e => onChange(e.target.value)} defaultValue={tableType}>
            <Radio.Button value="nodes">Node</Radio.Button>
            <Radio.Button value="edges">Edge</Radio.Button>
          </Radio.Group>
        </div>
        <Table dataSource={tableData} columns={columns} />
      </Modal>
    </>
  );
};

const WrapDataPanel = props => {
  return (
    <Provider store={store}>
      <DataPanel {...props} />
    </Provider>
  );
};

export default WrapDataPanel;
