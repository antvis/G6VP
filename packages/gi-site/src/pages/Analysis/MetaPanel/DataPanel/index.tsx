import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Icon } from '@antv/gi-sdk';
import { Collapse, Space } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import ActionList from '../../../../components/ActionList';
import CollapseCard from '../../../../components/CollapseCard';
import { edgeColumns, nodeColumns } from '../../../../components/FileServerEngine/const';
import { useContext } from '../../hooks/useContext';
import DataSchema from './DataSchema';
import DataSource from './DataSource';
import $i18n from '../../../../i18n';
import './index.less';

const { Panel } = Collapse;
interface DataPanelProps {}

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

/** 临时方案 */
const ENGINE_TYPE = {
  GI: { icon: 'icon-file-excel', name: $i18n.get({ id: 'gi-site.MetaPanel.DataPanel.LocalFile', dm: '本地文件' }) },
  GS: {
    icon: 'icon-file-database',
    name: $i18n.get({ id: 'gi-site.MetaPanel.DataPanel.GraphDatabase', dm: '图数据库' }),
  },
  TuGraph: {
    icon: 'icon-file-database',
    name: $i18n.get({ id: 'gi-site.MetaPanel.DataPanel.GraphDatabase', dm: '图数据库' }),
  },
  Neo4j: {
    icon: 'icon-file-database',
    name: $i18n.get({ id: 'gi-site.MetaPanel.DataPanel.GraphDatabase', dm: '图数据库' }),
  },
  AKG: {
    icon: 'icon-file-api',
    name: $i18n.get({ id: 'gi-site.MetaPanel.DataPanel.OnlineInterface', dm: '在线接口' }),
  },
  SHASENG: {
    icon: 'icon-file-api',
    name: $i18n.get({ id: 'gi-site.MetaPanel.DataPanel.OnlineInterface', dm: '在线接口' }),
  },
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
        title={$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.ClickImportToSelectA', dm: '请点击「导入」，选择数据源' })}
        extra={
          <Space>
            <ExclamationCircleOutlined style={{ color: 'orangered' }} />
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
  } else {
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

  return (
    <>
      <div>
        <div className="gi-config-panel-title">{$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.Data', dm: '数据' })}</div>
        <CollapseCard
          title={$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.GraphDataSource', dm: '图数据源' })}
          extra={<DataSource data={data} engineId={engineId} />}
        >
          {EngineView}
        </CollapseCard>
        <DataSchema />
        {/* <DataService projectId={id} serviceLists={serviceConfig} /> */}
      </div>
    </>
  );
};

export default DataPanel;
