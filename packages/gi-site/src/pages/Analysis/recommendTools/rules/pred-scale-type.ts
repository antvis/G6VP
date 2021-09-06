import { RuleModule } from './concepts/rule';
import { IExtendFieldInfo, INodeCfg } from '../types';
import { isConst, isUnique, isNominal, isOrdinal, isInterval, isDiscrete, isContinuous, isTime } from '@antv/dw-analyzer'

// export const continusScaleRule = {}

export const recScaleRule:RuleModule = {
  id: 'pred-scale-type',
  type: 'DESIGN',
  chartTypes: ['graph'],
  docs: {
    detailedText: '',
  },
  optimizer: (fieldInfo: IExtendFieldInfo, userCfg?: any) => {
    let fieldEncodeType;
    if(!fieldInfo) {
      return 'linear'
    }
    if(isOrdinal(fieldInfo) || isNominal(fieldInfo)) {
      fieldEncodeType = 'ordinal';
    } else if (isContinuous(fieldInfo) || fieldInfo.type === 'integer' || fieldInfo.type === 'float') {
      fieldEncodeType = 'linear';
    }
    return fieldEncodeType
  }
}


// let candidates = []
    // if(isNominal(fieldInfo)) {
    //   candidates.push({
    //     item: 'nominal',
    //     score: 4
    //   })
    // } 

export const scaleRules = {
  'pred-scale-type': recScaleRule
}
