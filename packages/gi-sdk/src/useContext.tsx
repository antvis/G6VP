import type { GraphinData, IGraph } from '@antv/graphin';
import React, { createContext } from 'react';
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
  graph: IGraph;
  apis: any;
  HAS_GRAPH: boolean;
  GISDK_ID: string;
  data: GraphinData;
  schemaData: GraphSchemaData;
  nodes: GINodeConfig[];
  edges: GIEdgeConfig[];
  layout: GILayoutConfig;
  components: GIComponentConfig[];
  pageLayout: any;
  initialized: boolean;
  prepare: boolean;
};

export const StoreMap = new Map();
export const GraphMap = new Map();
export const GlobalStore = {} as IContext<{}>;

export function useContext<T>() {
  const { id: ContextId, assets, services } = React.useContext(IdContext);

  if (ContextId) {
    const prevStore = StoreMap.get(ContextId);

    if (!prevStore) {
      /** 考虑SDK多实例的场景 */
      console.log('prevStore not found....', prevStore);
      StoreMap.set(ContextId, proxy<IContext<T>>(deepClone(GlobalStore)));
    }
  }

  const prevStore = StoreMap.get(ContextId);
  const context = useSnapshot(prevStore);
  const graph = GraphMap.get(ContextId) || null;

  return {
    context,
    assets,
    services,
    GISDK_ID: ContextId,
    id: ContextId,
    //@ts-ignore
    graph: graph,
    updateContext: (fn: (draft: IContext<T>) => void) => {
      return fn(prevStore);
    },
    updateGraph: graph => {
      GraphMap.set(ContextId, graph);
    },
  };
}

export function registerContext<T>(partStore: T): IContext<T> {
  return Object.assign(GlobalStore, partStore);
}
