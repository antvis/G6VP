import { extra } from '@antv/gi-sdk';
import * as React from 'react';
import ContainerHeader from '../../components-ui/ContainerHeader';
import DataImport from './DataImport';
import DataSchema from './DataSchema';
import $i18n from '../../i18n';

const { GIAComponent, deepClone } = extra;

export interface DataManagerProps {}

const DataManager: React.FunctionComponent<DataManagerProps> = props => {
  return (
    <div>
      <ContainerHeader
        title={$i18n.get({ id: 'galaxybase.components.DataManage.Component.DataManagement', dm: '数据管理' })}
      />
      <DataImport />
      <DataSchema />
    </div>
  );
};

export default DataManager;
