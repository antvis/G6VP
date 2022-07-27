import { GraphinData } from '@antv/graphin';
export interface ServerComponentProps {
  handleClose: () => void;
  initData: GraphinData;
}



export interface IInputData {
  uid: string;
  name: string;
  data: GraphinData;
  transfunc: string;
  enable: boolean;
}
