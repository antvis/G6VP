import type { GraphinData, IGraph } from '@antv/graphin';
import React, { createContext } from 'react';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { proxy, useSnapshot } from 'valtio';
import type {
  GIAssets,
  GIComponentConfig,
  GIEdgeConfig,
  GILayoutConfig,
  GINodeConfig,
  GIService,
  GraphSchemaData,
} from './typing';

export const IdContext = createContext<{ id: string; assets: GIAssets; services: GIService[] }>({
  id: '',
  assets: {},
  services: [],
});

const deepClone = (obj: any) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.log('error');
    return {};
  }
};

export type IContext<T> = T & {
  /** graph */
  graph: IGraph;
  apis: any;
  HAS_GRAPH: boolean;
  GISDK_ID: string;
  isLoading: boolean;
  /** data */
  data: GraphinData;
  source: GraphinData;
  schemaData: GraphSchemaData;
  largeGraphLimit: number;
  largeGraphData: GraphinData;
  largeGraphMode: boolean;
  /** config */
  nodes: GINodeConfig[];
  edges: GIEdgeConfig[];
  layout: GILayoutConfig;
  components: GIComponentConfig[];
  pageLayout: any;
  /** initialize */
  initialized: boolean;
  prepare: boolean;
};

export const StoreMap = new Map();
export const GraphMap = new Map();
export const GlobalStore = {} as IContext<{}>;

type ContextType<T> = {
  context: Snapshot<IContext<T>>;
  assets: GIAssets;
  services: GIService[];
  GISDK_ID: string;
  id: string;
  graph: IGraph;
  updateContext: (fn: (draft: IContext<T>) => void) => void;
  updateGraph: (graph: IGraph) => void;
  updateHistory: (options: any) => void;
  transform: (data: GraphinData) => GraphinData;
};
export function useContext<T>(): ContextType<T> {
  const { id: ContextId, assets, services } = React.useContext(IdContext);

  if (ContextId) {
    const prevStore = StoreMap.get(ContextId);

    if (!prevStore) {
      /** 考虑SDK多实例的场景 */
      console.log('prevStore not found....', prevStore);
      StoreMap.set(ContextId, proxy<IContext<T>>(deepClone(GlobalStore)));
    }
  }

  const prevStore = StoreMap.get(ContextId) as IContext<T>;
  const context = useSnapshot(prevStore);
  const graph = GraphMap.get(ContextId) || null;

  return {
    context,
    assets,
    services,
    GISDK_ID: ContextId,
    id: ContextId,
    graph,
    updateContext: (fn: (draft: IContext<T>) => void) => {
      return fn(prevStore);
    },
    updateGraph: graph => {
      GraphMap.set(ContextId, graph);
    },
    /** 后续处理 */
    updateHistory: (options: any) => {},
    transform: (data: GraphinData) => data,
  };
}

export function registerContext<T>(partStore: T): IContext<T> {
  return Object.assign(GlobalStore, partStore);
}
