import { GraphinData } from '@antv/graphin';
export interface IPathMap {
  [key: string]: {
    pathData: GraphinData;
    isHighligh: boolean;
  };
}
export interface IState {
  allNodePath: string[][];
  allEdgePath: string[][];
  pathStatusMap: { [key: string]: boolean };
  highlightPath: Set<number>;
  isAnalysis: boolean;
}
