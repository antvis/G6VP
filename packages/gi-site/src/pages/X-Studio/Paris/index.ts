import { generatorSchemaByGraphData } from '../../Analysis/utils';
import { GI_LOCAL_DATA, GI_PROJECT_CONFIG, GI_SERVICES_OPTIONS } from './GI_CONFIG';
const activeComponentsKeys = GI_PROJECT_CONFIG.components.map(c => {
  return c.id;
});
const schemaData = generatorSchemaByGraphData(GI_LOCAL_DATA);
const id = 'paris-transport';
const project = {
  id,
  name: '巴黎地铁图',
  type: 'case',
  projectConfig: GI_PROJECT_CONFIG,
  serviceConfig: GI_SERVICES_OPTIONS,
  schemaData,
  data: {
    inputData: [
      {
        data: GI_LOCAL_DATA,
        enable: true,
        transfunc: `data => data`,
        name: `${id}.json`,
      },
    ],
    transData: GI_LOCAL_DATA,
  },
  activeAssetsKeys: {
    components: activeComponentsKeys,
    elements: ['SimpleNode', 'SimpleEdge', 'DonutNode'],
    layouts: ['GraphinForce', 'Concentric', 'Dagre'],
  },
};

export default project;
