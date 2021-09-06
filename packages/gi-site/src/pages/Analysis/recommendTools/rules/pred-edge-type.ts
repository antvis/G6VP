import { RuleModule } from './concepts/rule';
import { IEdgeCfg, IExtendFieldInfo } from '../types';

// TODO 
export const lineEdgeRule: RuleModule = {
  id: 'edge-as-line',
  type: 'HARD',
  chartTypes: ['graph'],
  docs: {
    detailedText: '',
  },
  validator: (filed: IExtendFieldInfo):Boolean => {
    return true
  }
}

export const polyLineEdgeRule: RuleModule = {
  id: 'edge-as-polyline',
  type: 'HARD',
  chartTypes: ['graph'],
  docs: {
    detailedText: '',
  },
  validator: (filed: IExtendFieldInfo):Boolean => {
    return true
  }
}

export const edgeTypeRules = {
  'edge-as-line': lineEdgeRule,
  'edge-as-polyline': polyLineEdgeRule
}

