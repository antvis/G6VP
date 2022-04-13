import { useContext } from '@alipay/graphinsight';

export const useServiceContext = (serviceId: string | undefined) => {
  if (!serviceId) {
    console.warn('not found serviceId', serviceId);
    return null;
  }
  const { services } = useContext();
  const { service } = services.find(s => s.id === serviceId) || {};
  if (!service) {
    console.warn('Component need a serviceId', serviceId);
    return null;
  }
  return service;
};
