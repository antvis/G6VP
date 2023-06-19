import React from 'react';
import type { DraftFunction } from 'use-immer';
import { GIAssets, GIService, ISourceDataMap, State } from './typing';

interface ContextType<
  G extends {
    nodes: Record<string, any>[];
    edges: Record<string, any>[];
  } = {
    nodes: Record<string, any>[];
    edges: Record<string, any>[];
  },
> extends State<G> {
  updateContext: (fn: DraftFunction<State>) => any;
  updateData: (data: any) => any;
  assets: GIAssets;
  services: GIService[];
  stopForceSimulation: () => void;
  restartForceSimulation: (nodes?: []) => void;
  GISDK_ID: string;
  sourceDataMap: ISourceDataMap;
  /** 用户自己的数据 */
  [userVars: string]: any;
}

//@ts-ignore
const defaultContext = {
  graph: null,
  apis: null,
  theme: null,
  layout: null,
  stopForceSimulation: () => {},
  restartForceSimulation: () => {},
  updateContext: () => {},
  updateData: () => {},
} as ContextType;

export const GraphInsightContext = React.createContext(defaultContext);

export const useContext = <
  G extends {
    nodes: Record<string, any>[];
    edges: Record<string, any>[];
  } = {
    nodes: Record<string, any>[];
    edges: Record<string, any>[];
  },
>() => {
  const context = React.useContext(GraphInsightContext) as ContextType<G>;
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a GraphInsightProvider`);
  }

  return context;
};
