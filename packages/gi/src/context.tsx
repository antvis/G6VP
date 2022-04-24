import React from 'react';
import type { Updater } from 'use-immer';
import { GIAssets, GIService, State, IDataMap } from './typing';

interface ContextType extends State {
  updateContext: Updater<State>;
  updateData: (data: any) => any;
  assets: GIAssets;
  services: GIService[];
  GISDK_ID: string;
  dataMap: IDataMap;
  /** 用户自己的数据 */
  [userVars: string]: any;
}

//@ts-ignore
const defaultContext = {
  graph: null,
  apis: null,
  theme: null,
  layout: null,
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
