import { GI_LOCAL_DATA, GI_PROJECT_CONFIG, GI_SCHEMA_DATA, GI_SERVICES_OPTIONS } from './GI_CONFIG';
const activeComponentsKeys = GI_PROJECT_CONFIG.components.map(c => {
  return c.id;
});

const project = {
  id: 'demo-bank',
  name: '银行案例',
  type: 'case',
  projectConfig: GI_PROJECT_CONFIG,
  serviceConfig: GI_SERVICES_OPTIONS,
  schemaData: GI_SCHEMA_DATA,
  data: {
    inputData: [
      {
        data: GI_LOCAL_DATA,
        enable: true,
        transfunc: `data => data`,
        name: 'bank.json',
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
