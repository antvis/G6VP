import React from 'react';
import type { DraftFunction } from 'use-immer';
import { GIAssets, GIService, ISourceDataMap, State } from './typing';

interface ContextType extends State {
  updateContext: (fn: DraftFunction<State>)=> any;
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

export const useContext = () => {
  const context = React.useContext(GraphInsightContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a GraphInsightProvider`);
  }

  return context;
};
