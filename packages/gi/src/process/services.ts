import { EngineServer, GIService } from '../typing';

export type AssetServices = Record<string, { name: string; service: () => Promise<any> }>;

/**
 * 引擎：一堆服务的集合
 */

export interface CustomServiceConfig {
  id: string;
  name: string;
  /** 自定义服务的实现 */
  content: string;
}

export const getServiceOptions = (services: GIService[], serviceId) => {
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

export const getServiceOptionsByEngineId = (services: GIService[], serviceId: string, engineId: string) => {
  const options = services
    .filter(c => {
      return c.id.includes(serviceId);
    })
    .map(c => {
      return {
        value: c.id,
        label: c.id,
      };
    });
  const defaultValue =
    options.find(c => {
      return c.value.startsWith(engineId);
    }) || options[0];
  return {
    options,
    defaultValue: defaultValue.value,
  };
};

export const getCombineServer = (servers: EngineServer[]) => {
  const serverMap: EngineServer[] = [];
  servers.forEach(server => {
    const { id, services } = server;
    const matchServer = serverMap[id];
    if (matchServer) {
      serverMap[id] = {
        ...matchServer,
        ...server,
        services: {
          ...matchServer.services,
          ...services,
        },
      };
    } else {
      serverMap[id] = server;
    }
  });
  return Object.values(serverMap);
};

/**
 *
 * @param servers 资产包中的引擎
 * @returns
 */
export const getCombineServices = (servers: EngineServer[]) => {
  if (!servers) {
    return [];
  }

  return servers.reduce((acc, curr) => {
    if (!curr.services) {
      return [...acc];
    }
    const { id, services } = curr;
    const sers = Object.keys(services).map(key => {
      const service = services[key];
      return {
        ...service,
        id: `${id}/${key}`, //根据GI平台规范，服务ID 由 引擎ID+服务函数名 唯一标识
      };
    });
    return [...acc, ...sers];
  }, [] as GIService[]);
};
