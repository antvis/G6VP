import { Icon } from '@alipay/graphinsight';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Collapse, Space } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import ActionList from '../../../../components/ActionList';
import CollapseCard from '../../../../components/CollapseCard';
import { useContext } from '../../hooks/useContext';
import { edgeColumns, nodeColumns } from '../../uploadData/const';
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

/** 临时方案 */
const ENGINE_TYPE = {
  GI: { icon: 'icon-file-excel', name: '本地文件' },
  AKG: { icon: 'icon-file-api', name: '在线接口' },
  SHASENG: { icon: 'icon-file-api', name: '在线接口' },
  GS: { icon: 'icon-file-database', name: '图数据库' },
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
  const { context } = useContext();
  const { data, inputData = [], id, serviceConfig, engineId } = context;
  const [state, updateState] = useImmer({
    visible: false,
  });

  const { icon, name } = ENGINE_TYPE[engineId] || { icon: '', name: '' };

  let EngineView;
  if (!engineId && context.data.nodes.length === 0) {
    EngineView = (
      <ActionList
        title={`请点击「导入」，选择数据源`}
        extra={
          <Space>
            <ExclamationCircleOutlined style={{ color: 'orangered' }} />
          </Space>
        }
      ></ActionList>
    );
  }
  if (engineId === 'AKG' || engineId === 'SHASENG') {
    EngineView = (
      <ActionList
        title={`${name}: ${engineId}`}
        extra={
          <Space>
            <Icon type={icon} style={{ fontSize: '16px' }} />
            <CheckCircleOutlined style={{ color: 'green' }} />
          </Space>
        }
      ></ActionList>
    );
  }
  if (engineId === 'GI' || (!engineId && context.data.nodes.length > 0)) {
    EngineView = inputData.map((d, i) => {
      return (
        <ActionList
          key={i}
          title={`${name}: ${d.name}`}
          extra={
            <Space>
              <Icon type={icon} style={{ fontSize: '16px' }} />
              <CheckCircleOutlined style={{ color: 'green' }} />
            </Space>
          }
        ></ActionList>
      );
    });
  }

  return (
    <>
      <div>
        <div className="gi-config-panel-title">数据</div>
        <CollapseCard title={'图数据源'} extra={<DataSource data={data} engineId={engineId} />}>
          {EngineView}
        </CollapseCard>
        <DataSchema />
        <DataService projectId={id} serviceLists={serviceConfig} />
      </div>
    </>
  );
};

export default DataPanel;
