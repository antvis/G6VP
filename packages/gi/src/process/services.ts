export interface Service {
  id: string;
  service: (params?: any) => Promise<any>;
}
export const getServiceOptions = (services: Service[], serviceId) => {
  return services
    .filter(c => {
      return c.id.includes(serviceId);
    })
    .map(c => {
      return {
        value: c.id,
        label: c.id,
      };
    });
};
