import React from 'react';
import type { Updater } from 'use-immer';

export interface ContextType {
  updateContext: Updater<any>;
  context: any;
}

//@ts-ignore
const defaultContext = {
  updateContext: () => {},
  context: {},
} as ContextType;

export const AnalysisContext = React.createContext(defaultContext);

export const useContext = () => {
  const context = React.useContext(AnalysisContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a AnalysisContext.Provider`);
  }

  return context;
};
