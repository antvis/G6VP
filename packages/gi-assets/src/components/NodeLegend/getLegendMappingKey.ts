/** 根据用户配置的颜色，获取Legend的映射字段 */
const getLegendMappingKey = config => {
  const { components } = config;

  /** 解构配置项 */
  const MathLegendConfig = components.find(cfg => cfg.id === 'Legend');
  const sortkey = MathLegendConfig?.meta?.sortkey || 'type';
  return sortkey;
};

export default getLegendMappingKey;
