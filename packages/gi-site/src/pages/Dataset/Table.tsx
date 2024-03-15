import {
  DeleteOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  FileExcelOutlined,
  FundProjectionScreenOutlined,
  RollbackOutlined,
  SendOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { Button, Input, Table, Tag, Tooltip } from 'antd';
import * as React from 'react';
import { history } from 'umi';
import { recoverDataset, recycleDataset, updateDataset } from '../../services/dataset';
import { isNil } from '@antv/util';
// import { getUid } from '../Workspace/utils';
import $i18n from '../../i18n';
const styles = {
  botton: {
    padding: '4px 8px',
  },
};
export const TYPE_MAPPING = {
  FILE: {
    id: 'FILE',
    icon: <FileExcelOutlined />,
    name: $i18n.get({ id: 'gi-site.pages.Dataset.Table.LocalFile', dm: '本地文件' }),
    color: 'green',
  },
  GRAPH: {
    id: 'GRAPH',
    icon: <DeploymentUnitOutlined />,
    name: $i18n.get({ id: 'gi-site.pages.Dataset.Table.GraphData', dm: '图数据' }),
    color: 'blue',
  },
  GEO: {
    id: 'GEO',
    icon: <EnvironmentOutlined />,
    name: $i18n.get({ id: 'gi-site.pages.Dataset.Table.GeographicData', dm: '地理数据' }),
    color: 'orange',
  },
};
const DatasetTable = ({ data, queryData, recoverable = false, deletable = true }) => {

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
    // const style = utils.generatorStyleConfigBySchema(record.schemaData);
    // const { nodes, edges, layout, activeAssetsKeys, components } = getConfigByEngineId(
    //   record.engineId,
    //   TEMPLATE_SIMPLE,
    // );
    // const GI_SITE_CREATE_PROJECT_INDEX = localStorage.getItem('GI_SITE_CREATE_PROJECT_INDEX') || 1;
    // const name = `未命名画布_${GI_SITE_CREATE_PROJECT_INDEX}_数据集_${record.name}`;
    // const projectId = await ProjectServices.create({
    //   datasetId: record.id,
    //   name,
    //   status: 1, // 1 正常项目， 0 删除项目
    //   tag: '',
    //   members: '',
    //   projectConfig: {
    //     nodes,
    //     edges,
    //     layout,
    //     components,
    //     ...style,
    //   },
    //   activeAssetsKeys,
    //   type: 'project',
    // });
    // localStorage.setItem('GI_SITE_CREATE_PROJECT_INDEX', String(Number(GI_SITE_CREATE_PROJECT_INDEX) + 1));
    // window.open(`${window.location.origin}/#/workspace/${projectId}`);
    history.push(`/workbook/create?datasetId=${record.id}&templateId=TP_SIMPLE`);
  };

  const handleRename = async (id: string, name: string) => {
    const res = await updateDataset({ id, name });
    if (res) queryData();
  };

  const handleDelete = async record => {
    const res = await recycleDataset(record.id);
    if (res) queryData();
  };

  const handleView = record => {
    history.push(`/dataset/list/${record.id}`);
  };

  const handleRecover = record => {
    (async () => {
      const res = await recoverDataset(record);
      if (res) queryData();
    })();
  };
  const columns = [
    {
      title: $i18n.get({ id: 'gi-site.pages.Dataset.Table.DatasetName', dm: '数据集名称' }),
      dataIndex: 'name',
      key: 'name',
      render: (record, data) => {
        const { type } = data;
        let tag =
          type === 'case' ? (
            <Tag color="var(--primary-color)">
              {$i18n.get({ id: 'gi-site.pages.Dataset.Table.OfficialCase', dm: '官方案例' })}
            </Tag>
          ) : (
            ''
          );
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {tag}
            <Input
              defaultValue={record}
              onBlur={e => {
                const value = e.target.value;
                if (!isNil(value) && value !== record) {
                  handleRename(data.id, value);
                }
              }}
              bordered={false}
            />
          </div>
        );
      },
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Dataset.Table.DatasetId', dm: '数据集ID' }),
      dataIndex: 'id',
      width: 400,
      key: 'id',
    },

    {
      title: $i18n.get({ id: 'gi-site.pages.Dataset.Table.EngineId', dm: '引擎 ID' }),
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
            <Tag color="var(--primary-color)">
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
      title: $i18n.get({ id: 'gi-site.pages.Dataset.Table.CreationTime', dm: '创建时间' }),
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 180,
      render: (record, data) => {
        if (record) return utils.time(record);
        else return '-';
      },
      sorter: (a, b) => a.gmtCreate - b.gmtCreate,
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Dataset.Table.Operation', dm: '操作' }),
      width: 160,
      render: record => {
        return (
          <span>
            <Tooltip
              title={$i18n.get({ id: 'gi-site.pages.Dataset.Table.CreateAnAnalysisCanvas', dm: '创建分析画布' })}
              color={'var(--primary-color)'}
            >
              <Button
                type="text"
                onClick={() => handleAnalysis(record)}
                // 地图和关系图的分析画布不一样，分别为 gi-workbook 和 li-workbook
                style={{ ...styles.botton, color: 'var(--primary-color)' }}
              >
                <FundProjectionScreenOutlined />
              </Button>
            </Tooltip>
            <Tooltip
              title={$i18n.get({ id: 'gi-site.pages.Dataset.Table.ViewBasicDataInformation', dm: '查看数据基本信息' })}
            >
              <Button type="text" onClick={() => handleView(record)} style={styles.botton}>
                <TableOutlined />
              </Button>
            </Tooltip>
            <Tooltip title={$i18n.get({ id: 'gi-site.pages.Dataset.Table.ShareDatasets', dm: '分享数据集' })}>
              <Button type="text" style={styles.botton}>
                <SendOutlined />
              </Button>
            </Tooltip>
            {deletable && (
              <Tooltip
                title={$i18n.get({ id: 'gi-site.pages.Dataset.Table.DeleteADataset', dm: '删除数据集' })}
                color={'red'}
              >
                <Button type="text" onClick={() => handleDelete(record)} style={{ padding: '4px 4px' }}>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            )}

            {recoverable && (
              <Tooltip
                title={$i18n.get({ id: 'gi-site.pages.Dataset.Table.RestoreADataset', dm: '恢复数据集' })}
                color={'red'}
              >
                <Button type="text" onClick={() => handleRecover(record)} style={{ padding: '4px 4px' }}>
                  <RollbackOutlined />
                </Button>
              </Tooltip>
            )}
          </span>
        );
      },
    },
  ];

  if (recoverable) {
    columns.splice(4, 0, {
      title: $i18n.get({ id: 'gi-site.pages.Dataset.Table.ExpirationTime', dm: '过期时间' }),
      dataIndex: 'recycleTime',
      key: 'expiredTime',
      render: record => {
        const expiredDate = new Date(record + 604800000);
        const expiredStr = `${expiredDate.toLocaleDateString()} ${expiredDate.toLocaleTimeString()}`;
        return <div>{expiredStr}</div>;
      },
    });
  }
  return <Table dataSource={data} columns={columns}></Table>;
};

export default DatasetTable;
