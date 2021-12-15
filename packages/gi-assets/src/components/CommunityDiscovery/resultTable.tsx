// @ts-nocheck
import React from 'react';
import { SheetComponent } from '@antv/s2-react';
import 'antd/dist/antd.css';
import '@antv/s2-react/dist/style.min.css';
import { Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import FormattedMessage, { formatMessage } from './locale';
import { exportCSV, formatFileName } from '../utils/csv';

interface Props {
  data;
}

const ClustersResultTable: React.FC<Props> = ({ data }) => {
  let properties: any[] = [];
  const resData: any[] = [];
  data?.nodes?.forEach(node => {
    properties = properties.concat(Object.keys(node.properties || {}));
    resData.push({
      clusterId: node.clusterId,
      id: node.id,
      label: node.label,
      ...(node.properties || {}),
    });
  });
  resData.sort((a, b) => Number(a.clusterId) - Number(b.clusterId));
  properties.push('id');
  properties = Array.from(new Set(properties));

  const dataCfg = {
    fields: {
      rows: ['clusterId', 'label'],
      values: properties,
    },
    meta: [
      {
        field: 'clusterId',
        name: formatMessage({ id: 'community-index' }),
      },
      {
        field: 'label',
        name: formatMessage({ id: 'node-name' }),
      },
    ],
    data: resData || [],
  };

  // 交叉表配置项准备
  const options = {
    width: 330,
    height: 400,
    hierarchyType: 'grid',
  };

  const download = () => {
    const fileName = formatFileName('cluster_result');
    exportCSV(
      {
        data: resData,
        title: [
          formatMessage({ id: 'community-index' }),
          formatMessage({ id: 'node-name' }),
        ].concat(properties),
        titleForKey: ['clusterId', 'label'].concat(properties),
      },
      fileName,
    );
  };

  return (
    <>
      <Tooltip title={<FormattedMessage id="download-csv" />} placement="topRight">
        <DownloadOutlined style={{float: 'right'}} onClick={download} />
      </Tooltip>
      <div className="community-discovery-table-wrapper">
        <SheetComponent sheetType="base" dataCfg={dataCfg} options={options} />
      </div>
    </>
  );
};

export default ClustersResultTable;
