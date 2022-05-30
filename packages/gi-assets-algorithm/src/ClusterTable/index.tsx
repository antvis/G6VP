//@ts-nocheck
import { DownloadOutlined } from '@ant-design/icons';
import type { GraphinData } from '@antv/graphin';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Tooltip, Select } from 'antd';
import { isEqual } from 'lodash';
import React, { Component } from 'react';
import type { PlainObject } from '../types';
import { exportCSV, formatFileName } from '../utils/csv';
import './index.less';
import FormattedMessage, { formatMessage } from './locale';

const getConfig = (data: GraphinData, clusterTitle, properties) => {
  const resData = [];
  data?.nodes?.forEach(node => {
    resData.push({
      ...(node.properties || {}),
      propertyId: node.properties?.id,
      ...node
    });
  });
  resData.sort((a, b) => Number(a.clusterId) - Number(b.clusterId));
  const dataCfg = {
    fields: {
      rows: ['clusterId', 'id'],
      values: properties,
    },
    meta: [
      {
        field: 'clusterId',
        name: clusterTitle,
      },
      {
        field: 'id',
        name: 'id',
      },
    ],
    data: resData || [],
  };
  return { dataCfg, resData, properties };
};

interface Props {
  data: GraphinData;
  clusterTitle: string;
  properties?: string[];
  focusNodeAndHighlightHull: (nodeId: string, clusterId: string) => void;
}

interface State {
  data: PlainObject;
  config: PlainObject;
}
export default class ClustersTable extends Component<Props, State> {
  // 交叉表配置项准备
  options = {
    width: 500,
    height: 400,
    hierarchyType: 'grid',
    showDefaultHeaderActionIcon: false,
    style: {
      layoutWidthType: 'colAdaptive',
      colCfg: {
        width: 20
      }
    }
  };

  state = {
    data: null,
    config: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data: nextData, clusterTitle, properties } = nextProps;
    const { data } = prevState;
    if (!isEqual(nextData, data)) {
      const config = getConfig(nextData, clusterTitle, properties);
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
            options={this.options || {}}
            onRowCellClick={this.onRowCellClick}
          />
        </div>
      </>
    );
  }
}
