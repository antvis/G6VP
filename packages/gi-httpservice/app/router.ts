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

  // GraphScope
  router.post('/graphscope/connect', controller.graphscope.connectGraphScope);
  router.post('/graphscope/gremlinQuery', controller.graphscope.gremlinQuery);
  router.get('/graphscope/listSubgraph', controller.graphscope.listSubgraph);
  router.post('/graphscope/neighbors', controller.graphscope.queryNeighbors);
  router.get('/graphscope/execAlgorithm', controller.graphscope.execAlgorithm);
  router.post('/graphscope/properties', controller.graphscope.queryElementProperties);

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

  // TuGraph
  router.post('/api/hugegraph/connect', controller.hugegraph.connect);
  router.get('/api/hugegraph/disconnect', controller.hugegraph.disConnect);
  router.get('/api/hugegraph/schema', controller.hugegraph.getSchema);
  router.post('/api/hugegraph/languagequery', controller.hugegraph.queryByGraphLanguage);
  router.post('/api/hugegraph/neighbors', controller.hugegraph.queryNeighbors);

  // GraphInsight website service
  // dataset 数据集
  router.get('/dataset/list', controller.dataset.list);
  router.get('/dataset/listRecycles', controller.dataset.listRecycles);
  router.post('/dataset/create', controller.dataset.create);
  router.get('/dataset/case', controller.dataset.findCase);
  router.post('/dataset/delete', controller.dataset.removeById);
  router.post('/dataset/recycle', controller.dataset.recycleById);
  router.post('/dataset/recover', controller.dataset.recoverById);
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
