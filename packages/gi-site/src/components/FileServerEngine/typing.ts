import { GraphinData } from '@antv/graphin';
export interface ServerComponentProps {
  updateGISite: (params: any) => void;
  giSiteContext: any;
}

export interface IInputData {
  uid: string;
  name: string;
  data: GraphinData;
  transfunc: string;
  enable: boolean;
}

export type ITableType = 'nodes' | 'edges';

export interface IColumns {
  title: string;
  dataIndex: string;
  key: string;
  render?: (data: GraphinData) => any;
}

export interface IState {
  activeKey: number;
  inputData: any;
  data: GraphinData;
  transfunc: string;
  transData: GraphinData;
  tableData: object[];
  transColumns: object[];
}
