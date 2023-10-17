import { GIAssets, GIConfig } from '../typing';
import { filterByTopRule } from './filterByRules';

/**
 *
 * @param elementType 元素类型：node or edge
 * @param data 数据
 * @param config GISDK配置
 * @param ElementAssets 元素资产
 * @param reset 是否重置transform
 * @returns nodes or edges
 */

export const getMapperByCfg = (
  config: Partial<GIConfig['edges']> | Partial<GIConfig['nodes']>,
  ElementAssets: GIAssets['elements'],
  reset?: boolean,
) => {
  /** 默认的Mapper */
  const dumpMapper = item => item;
  if (!config) {
    return dumpMapper;
  }
  const mapper = item => {
    // [ruleA,ruleB,ruleC] RuleC 的优先级最高
    const reverseCfg = [...config].reverse();
    for (const cfg of reverseCfg) {
      if (!cfg) {
        return;
      }
      const { id, expressions, logic } = cfg;

      if (!ElementAssets) {
        console.error('ElementAssets not available');
        return [];
      }
      const Element = ElementAssets[id];
      //@ts-ignore
      const isMatch = filterByTopRule(item, { logic, expressions });

      if (isMatch) {
        // console.log(id, cfg, item);
        //@ts-ignore
        const mapper = Element.registerTransform(cfg, reset);
        //@ts-ignore
        const formateNode = mapper(item);
        // console.log(id, formateNode, 'isMatch', isMatch, expressions?.length, item);
        //@ts-ignore
        return formateNode;
      }
    }
  };
  return mapper;
};
