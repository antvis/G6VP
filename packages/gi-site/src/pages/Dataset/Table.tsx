import { utils } from '@antv/gi-sdk';
import { Button, Space, Table } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteDataset } from '../../services/dataset';
// import { getUid } from '../Workspace/utils';
import * as ProjectServices from '../../services/project';
import { getConfigByEngineId } from '../Workspace/utils';
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
      title: '所有者',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '引擎ID',
      dataIndex: 'engineId',
      key: 'engineId',
    },
    {
      title: '数据集规模',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '操作',
      render: record => {
        return (
          <Space>
            <Button type="text" onClick={() => handleView(record)}>
              详情
            </Button>
            <Button type="text" onClick={() => handleAnalysis(record)}>
              分析
            </Button>
            <Button type="text" disabled>
              分享
            </Button>
            <Button type="text">复制</Button>
            <Button type="text" onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns}></Table>;
};

export default DatasetTable;
