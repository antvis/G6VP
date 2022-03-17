import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  TableOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Collapse, Modal, Radio, Space, Table } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import ActionList from '../../../../components/ActionList';
import BreathIndicator from '../../../../components/BreathIndicator';
import CollapseCard from '../../../../components/CollapseCard';
import { updateProjectById } from '../../../../services';
import { useContext } from '../../hooks/useContext';
import { edgeColumns, nodeColumns } from '../../uploadData/const';
import DataService from './DataService';
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
  const { data, inputData, id, serviceConfig } = context;

  const [state, updateState] = useImmer({
    isVisible: false,
    initData: data,
    tableType: 'nodes',
    columns: nodeColumns,
    tableData: data?.['nodes'].map((d, i) => {
      return {
        ...d,
        key: i,
      };
    }),
  });

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

    updateProjectById(id, {
      data: JSON.stringify({
        transData: mergeData,
        inputData: filterInputData,
      }),
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
    updateContext(draft => {
      draft.inputData = resultData;
      draft.data = mergeData;
    });
  };

  const uploadData = () => {
    updateContext(draft => {
      draft.isModalVisible = true;
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
        <div className="gi-config-panel-title">数据</div>
        <CollapseCard
          title="数据源"
          extra={
            <BreathIndicator title="导入数据" status="running">
              <Button type="dashed" style={{ width: '100%' }} size="small" onClick={uploadData}>
                <UploadOutlined /> 导入
              </Button>
            </BreathIndicator>
          }
        >
          {inputData.map((d, i) => {
            return (
              <ActionList
                key={i}
                title={d.name}
                extra={
                  <Space>
                    <TableOutlined onClick={() => viewTable(d.uid)} />
                    {d.enable ? (
                      <EyeOutlined onClick={() => invertVisiable(d.uid)} />
                    ) : (
                      <EyeInvisibleOutlined onClick={() => invertVisiable(d.uid)} />
                    )}
                    <DeleteOutlined onClick={() => deleteData(d.uid)} />
                  </Space>
                }
              ></ActionList>
            );
          })}
        </CollapseCard>
        <DataService projectId={id} serviceLists={serviceConfig} />
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
