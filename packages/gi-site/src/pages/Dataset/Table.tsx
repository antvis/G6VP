import {
  DeleteOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  FileExcelOutlined,
  FundProjectionScreenOutlined,
  SendOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { Button, Table, Tag, Tooltip } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteDataset } from '../../services/dataset';
// import { getUid } from '../Workspace/utils';
import * as ProjectServices from '../../services/project';
import { getConfigByEngineId } from '../Workspace/utils';

const styles = {
  botton: {
    padding: '4px 8px',
  },
};
const TYPE_MAPPING = {
  FILE: {
    id: 'FILE',
    icon: <FileExcelOutlined />,
    name: '本地文件',
    color: 'green',
  },
  GRAPH: {
    id: 'GRAPH',
    icon: <DeploymentUnitOutlined />,
    name: '图数据',
    color: 'blue',
  },
  GEO: {
    id: 'GEO',
    icon: <EnvironmentOutlined />,
    name: '地理数据',
    color: 'orange',
  },
};
const DatasetTable = ({ data }) => {
  const history = useHistory();

  // const handleEncode = record => {
  //   console.log(record);
  //   const { schemaData } = record;
  //   const info = encodeURIComponent(
  //     JSON.stringify({
  //       id: `ds_${getUid()}`,
  //       name: 'GraphScope SubGraph 1',
  //       engineId: record.engineId,
  //       engineContext: record.engineContext,
  //       schemaData: record.schemaData,
  //     }),
  //   );
  //   window.open(`${window.location.origin}/#/dataset/SYSTEM_DIRECT_CONNECT?datasetInfo=${info}`);
  // };
  const handleAnalysis = async record => {
    // handleEncode(record);
    // return;

    const style = utils.generatorStyleConfigBySchema(record.schemaData);
    const { config, activeAssetsKeys } = getConfigByEngineId(record.engineId);
    const GI_SITE_CREATE_PROJECT_INDEX = localStorage.getItem('GI_SITE_CREATE_PROJECT_INDEX') || 1;
    const name = `未命名画布_${GI_SITE_CREATE_PROJECT_INDEX}_数据集_${record.name}`;

    const projectId = await ProjectServices.create({
      datasetId: record.id,
      name,
      status: 1, // 1 正常项目， 0 删除项目
      tag: '',
      members: '',
      projectConfig: {
        ...config,
        ...style,
      },
      activeAssetsKeys,
      type: 'project',
    });
    localStorage.setItem('GI_SITE_CREATE_PROJECT_INDEX', String(Number(GI_SITE_CREATE_PROJECT_INDEX) + 1));
    // console.log('config', config, activeAssetsKeys);
    window.open(`${window.location.origin}/#/workspace/${projectId}`);
  };
  const handleDelete = async record => {
    await deleteDataset(record.id);
  };
  const handleView = record => {
    history.push(`/dataset/list/${record.id}`);
  };
  const columns = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数据集ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '数据源类型',
      dataIndex: 'category',
      key: 'category',
      render: (record, data) => {
        const { category = 'FILE', engineId } = data;
        const { icon, name, color } = TYPE_MAPPING[category];
        const extraInfo = engineId === 'GI' ? '图数据' : '';
        return (
          <div>
            <Tag color={color}>
              {icon} {name} / {extraInfo}
            </Tag>
            {record}
          </div>
        );
      },
    },
    {
      title: '引擎 ID',
      dataIndex: 'engineId',
      key: 'engineId',
      render: (record, data) => {
        let { engineId, category = 'GRAPH' } = data;
        if (engineId === 'GI') {
          category = 'GRAPH';
        }
        const { icon, color } = TYPE_MAPPING[category];

        return (
          <div>
            <Tag color={color}>
              {icon} {record}
            </Tag>
          </div>
        );
      },
    },
    // {
    //   title: '数据集规模',
    //   dataIndex: 'size',
    //   key: 'size',
    // },
    {
      title: '操作',
      render: record => {
        return (
          <span>
            <Tooltip title="创建分析画布" color={'green'}>
              <Button type="text" onClick={() => handleAnalysis(record)} style={styles.botton}>
                <FundProjectionScreenOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="查看数据基详情" color={'blue'}>
              <Button type="text" onClick={() => handleView(record)} style={styles.botton}>
                <TableOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="分享数据集" color={'grey'}>
              <Button type="text" style={styles.botton}>
                <SendOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="删除数据集" color={'red'}>
              <Button type="text" onClick={() => handleDelete(record)} style={{ padding: '4px 4px' }}>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </span>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns}></Table>;
};

export default DatasetTable;
