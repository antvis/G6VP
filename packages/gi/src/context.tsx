import { GraphinContextType } from '@antv/graphin';
import React from 'react';
import type { Updater } from 'use-immer';

interface Content extends GraphinContextType {
  GiState: {};
  GiProps: {};
}
interface ContextType extends Content {
  updateContext: Updater<Content>;
  /** 用户自己的数据 */
  [userVars: string]: any;
}

type Include<T> = {
  [P in keyof T]: T[P];
};

//@ts-ignore
const defaultContext = {
  graph: null,
  apis: null,
  theme: null,
  layout: null,
  GiState: {},
  GiProps: {},
  updateContext: () => {},
} as ContextType;

export const GraphInsightContext = React.createContext(defaultContext);

interface ProviderProps {
  children: React.ReactChildren | JSX.Element | JSX.Element[];
}

export const useContext = () => {
  const context = React.useContext(GraphInsightContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a GraphInsightProvider`);
  }

  return context;
};
