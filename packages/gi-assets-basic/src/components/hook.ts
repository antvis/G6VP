import { GraphinContext } from '@antv/graphin';

export const useServiceContext = (serviceId: string | undefined, hasService?: boolean) => {
  if (!hasService) {
    return null;
  }
  if (!serviceId) {
    console.warn('not found serviceId', serviceId);
    return null;
  }
  //@ts-ignore
  const { services } = GraphinContext;
  const { service } = services.find(s => s.id === serviceId);
  if (!service) {
    console.warn('NodeEdgeAttrs Component need a serviceId', serviceId);
    return null;
  }
  return service;
};
