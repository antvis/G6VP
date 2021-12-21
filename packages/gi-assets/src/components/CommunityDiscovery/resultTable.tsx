// @ts-nocheck
import React, { Component } from 'react';
import { SheetComponent } from '@antv/s2-react';
import { Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { isEqual } from 'lodash';
import FormattedMessage, { formatMessage } from './locale';
import { exportCSV, formatFileName } from '../utils/csv';
import { PlainObject } from '../types';
import '@antv/s2-react/dist/style.min.css';

const getConfig = data => {
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
  return { dataCfg, resData, properties };
}

interface Props {
  data;
  focusNodeAndHighlightHull: (nodeId: string, clusterId: string) => void;
}
interface State {
  data: PlainObject;
  config: PlainObject;
}

export default class ClustersResultTable extends Component<Props, State> {
  // 交叉表配置项准备
  static options = {
    width: 330,
    height: 400,
    hierarchyType: 'grid',
  };

  state = {
    data: null,
    config: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data: nextData } = nextProps;
    const { data } = prevState;
    if (!isEqual(nextData, data)) {
      const config = getConfig(nextData);
      return {
        data,
        config,
      };
    }
    return null;
  }

  download = () => {
    const { config: { resData, properties } = {} } = this.state;
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

  onRowCellClick = ({ viewMeta }) => {
    const { query, spreadsheet } = viewMeta;
    const rowData = spreadsheet.dataSet.getMultiData(query);
    const { id, clusterId } = rowData?.[0] || {};
    const { focusNodeAndHighlightHull } = this.props;
    if (focusNodeAndHighlightHull) {
      focusNodeAndHighlightHull(id, clusterId);
    }
  };

  render () {
    const { config: { dataCfg } = {} } = this.state;

    return (
      <>
        <Tooltip title={<FormattedMessage id="download-csv" />} placement="topRight">
          <DownloadOutlined style={{float: 'right'}} onClick={this.download} />
        </Tooltip>
        <div className="community-discovery-table-wrapper">
          <SheetComponent
            sheetType="base"
            dataCfg={dataCfg}
            options={this.options}
            onRowCellClick={this.onRowCellClick}
          />
        </div>
      </>
    );
  }
};

