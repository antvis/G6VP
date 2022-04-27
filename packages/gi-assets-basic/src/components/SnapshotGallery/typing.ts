import type { GraphinData } from '@antv/graphin';
export interface IHistoryObj {
  graphData: GraphinData;
  imgURL: string;
  time: number;
}

export type IHistory = Map<string, IHistoryObj>;

export interface IState {
  history: IHistory
}
