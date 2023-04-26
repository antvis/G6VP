import DataManage from '../components/DataManage';
import DataManageRegisterMeta from '../components/DataManage/registerMeta';
//@ts-ignore
const { getDefaultValues } = window.GISDK.utils;
export const updateAssets = assets => {
  assets.components['GalaxybaseDataSource'] = DataManage;

  return assets;
};

export const updateConfig = config => {
  config.components.forEach(c => {
    return c;
  });

  config.components.push({
    id: 'GalaxybaseDataSource',
    name: '数据',
    //@ts-ignore
    props: getDefaultValues({
      type: 'object',
      properties: DataManageRegisterMeta({}),
    }),
  });

  config.components.forEach(item => {
    // 修改 GremlinQuery 资产的服务
    if (item.id === 'CypherEditor') {
      item.props.serviceId = 'Galaxybase/LanguageQuery';
    }
    if (item.id === 'NeighborsQuery') {
      item.props.serviceId = 'Galaxybase/NeighborsQuery';
    }
    if (item.id === 'Initializer') {
      item.props.serviceId = 'Galaxybase/GI_SERVICE_INTIAL_GRAPH';
      item.props.schemaServiceId = 'Galaxybase/GI_SERVICE_SCHEMA';
    }
  });
  return config;
};
