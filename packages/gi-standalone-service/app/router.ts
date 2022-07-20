import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.post('/graphcompute/createGSInstance', controller.graphcompute.createGraphScopeInstance);
  router.get('/graphcompute/closeGSInstance', controller.graphcompute.closeGraphScopeInstance);
  router.post('/graphcompute/uploadFile', controller.graphcompute.uploadFile);
  router.post('/graphcompute/loadData', controller.graphcompute.loadDataToGraphScope);
  router.post('/graphcompute/gremlinQuery', controller.graphcompute.gremlinQuery);
  router.post('/graphcompute/properties', controller.graphcompute.queryElementProperties);
  router.post('/graphcompute/neighbors', controller.graphcompute.queryNeighbors);
  router.get('/graphcompute/schema', controller.graphcompute.getSchema);
  router.get('/graphcompute/instances', controller.graphcompute.getInstance);
};
