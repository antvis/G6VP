/** 根据用户配置的颜色，获取Legend的映射字段 */
const getLegendMappingKey = config => {
  const { node: NodeConfig } = config;

  /** 解构配置项 */
  const MathNodeConfig = NodeConfig.find(cfg => cfg.enable);
  const Color = MathNodeConfig?.color.find(s => s.enable) || null;
  return `data.${Color?.key}`;
};

export default getLegendMappingKey;
