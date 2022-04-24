import { GraphinData } from '@antv/graphin';
export interface IFilterRule{
  type: string;
  weightPropertyName?: string,
  expressions?: any[]
}

export interface IState {
  allNodePath: string[][];
  allEdgePath: string[][];
  nodePath: string[][];
  edgePath: string[][];
  pathStatusMap: { [key: string]: boolean };
  highlightPath: Set<number>;
  isAnalysis: boolean;
  filterRule: IFilterRule;
}

export interface IHighlightElement{
  nodes: Set<string>;
  edges: Set<string>;
}