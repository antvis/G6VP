import React from 'react';
import type { Updater } from 'use-immer';
import { StateType } from '../typing';
export interface ContextType {
  updateContext: Updater<any>;
  context: StateType;
  updateGISite: (params: any) => void;
}

//@ts-ignore
const defaultContext = {
  updateContext: () => {},
  context: {} as StateType,
  updateGISite: () => {},
} as ContextType;

export const AnalysisContext = React.createContext(defaultContext);

export const useContext = () => {
  const context = React.useContext(AnalysisContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a AnalysisContext.Provider`);
  }

  return context;
};
