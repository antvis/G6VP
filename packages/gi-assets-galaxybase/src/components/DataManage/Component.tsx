import { extra } from '@antv/gi-sdk';
import * as React from 'react';
import ContainerHeader from '../../components-ui/ContainerHeader';
import DataImport from './DataImport';
import DataSchema from './DataSchema';

const { GIAComponent, deepClone } = extra;

export interface DataManagerProps {}

const DataManager: React.FunctionComponent<DataManagerProps> = props => {
  return (
    <div>
      <ContainerHeader title="数据管理" />
      <DataImport />
      <DataSchema />
    </div>
  );
};

export default DataManager;
