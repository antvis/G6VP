import React from 'react';
import { GIService } from '../typing';

export type AssetServices = Record<string, { name: string; service: () => Promise<any> }>;

/**
 * 引擎：一堆服务的集合
 */
export interface EngineServer {
  /** 引擎的ID */
  id: 'GI' | 'AKG' | 'SHASENG';
  /** 引擎的名称 */
  name: string;
  /** 引擎的配套组件 */
  component?: React.ReactNode;
  /** 引擎的实现 */
  services: {
    [key: string]: GIService;
  };
}

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
