import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.graphinsight.index);

  router.post('/graphcompute/connect', controller.graphcompute.connectGraphScope);
  router.post('/graphcompute/createGSInstance', controller.graphcompute.createGraphScopeInstance);
  router.get('/graphcompute/closeGSInstance', controller.graphcompute.closeGraphScopeInstance);
  router.post('/graphcompute/uploadFile', controller.graphcompute.uploadFile);
  router.post('/graphcompute/loadData', controller.graphcompute.loadDataToGraphScope);
  router.post('/graphcompute/gremlinQuery', controller.graphcompute.gremlinQuery);
  router.post('/graphcompute/properties', controller.graphcompute.queryElementProperties);
  router.post('/graphcompute/neighbors', controller.graphcompute.queryNeighbors);
  router.get('/graphcompute/schema', controller.graphcompute.getSchema);
  router.get('/graphcompute/instances', controller.graphcompute.getInstance);
  router.get('/graphcompute/execAlgorithm', controller.graphcompute.execAlgorithm);

  // Neo4j
  router.post('/api/neo4j/connect', controller.neo4j.connect);
  router.get('/api/neo4j/disconnect', controller.neo4j.disConnect);
  router.get('/api/neo4j/schema', controller.neo4j.getSchema);
  router.post('/api/neo4j/languagequery', controller.neo4j.queryByGraphLanguage);
  router.post('/api/neo4j/neighbors', controller.neo4j.queryNeighbors);

  // TuGraph
  router.get('/tugraph/explore.html', controller.tugraph.index);
  router.post('/api/tugraph/connect', controller.tugraph.connect);
  router.post('/api/tugraph/languagequery', controller.tugraph.queryByGraphLanguage);
  router.post('/api/tugraph/neighbors', controller.tugraph.queryNeighbors);
  router.get('/api/tugraph/schema', controller.tugraph.getSchema);
  router.get('/api/tugraph/list', controller.tugraph.getSubGraphList);
  router.get('/api/tugraph/count', controller.tugraph.getVertexEdgeCount);

  // GraphInsight website service
  // dataset 数据集
  router.get('/dataset/list', controller.dataset.list);
  router.post('/dataset/create', controller.dataset.create);
  router.get('/dataset/case', controller.dataset.findCase);
  router.post('/dataset/delete', controller.dataset.removeById);
  router.get('/dataset/:id', controller.dataset.getById);

  // router.post('/dataset/delete', controller.graphinsight.removeProjectById);
  // router.post('/dataset/update', controller.graphinsight.updateProjectById);

  // project 工作薄
  router.post('/project/create', controller.graphinsight.createProject);
  router.post('/project/list', controller.graphinsight.listProject);
  router.post('/project/delete', controller.graphinsight.removeProjectById);
  router.post('/project/update', controller.graphinsight.updateProjectById);
  router.get('/project/case', controller.graphinsight.findCase);
  router.get('/project/:id', controller.graphinsight.getProjectById);
};
