//@ts-nocheck
import { DownloadOutlined } from '@ant-design/icons';
import type { GraphinData } from '@antv/graphin';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Tooltip } from 'antd';
import { isEqual } from 'lodash';
import React, { Component } from 'react';
import type { PlainObject } from '../types';
import { exportCSV, formatFileName } from '../utils/csv';
import './index.less';
import FormattedMessage, { formatMessage } from './locale';

const getConfig = (data: GraphinData, clusterTitle) => {
  let properties = [];
  properties.push('id');
  const resData = [];
  data?.nodes?.forEach(node => {
    properties = properties.concat(Object.keys(node.properties));
    resData.push({
      ...node.properties,
      clusterId: node.clusterId,
      id: node.id,
      label: node.label,
    });
  });
  resData.sort((a, b) => Number(a.clusterId) - Number(b.clusterId));
  properties = Array.from(new Set(properties));
  const dataCfg = {
    fields: {
      rows: ['clusterId', 'label'],
      values: properties,
    },
    meta: [
      {
        field: 'clusterId',
        name: clusterTitle,
      },
      {
        field: 'label',
        name: formatMessage({ id: 'node-name' }),
      },
    ],
    data: resData || [],
  };
  return { dataCfg, resData, properties };
};

interface Props {
  data: GraphinData;
  clusterTitle: string;
  focusNodeAndHighlightHull: (nodeId: string, clusterId: string) => void;
}

interface State {
  data: PlainObject;
  config: PlainObject;
}
export default class ClustersTable extends Component<Props, State> {
  // 交叉表配置项准备
  static options = {
    width: 500,
    height: 400,
    hierarchyType: 'grid',
  };

  state = {
    data: null,
    config: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data: nextData, clusterTitle } = nextProps;
    const { data } = prevState;
    if (!isEqual(nextData, data)) {
      const config = getConfig(nextData, clusterTitle);
      return {
        data,
        config,
      };
    }
    return null;
  }

  download = () => {
    const { config: { resData, properties } = {} } = this.state;
    const { clusterTitle } = this.props;
    const fileName = formatFileName('cluster_result');
    exportCSV(
      {
        data: resData,
        title: [clusterTitle, formatMessage({ id: 'node-name' })].concat(properties),
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

  render() {
    const { config: { dataCfg } = {} } = this.state;

    return (
      <>
        <Tooltip title={<FormattedMessage id="download-csv" />} placement="topRight">
          <DownloadOutlined style={{ float: 'right' }} onClick={this.download} />
        </Tooltip>
        <div className="community-cluster-table-wrapper">
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
}
