import { GIConfig } from '@alipay/graphinsight';

export interface ServiceObject {
  name: string;
  service: (
    elementConfig: GIConfig['nodes'] | GIConfig['edges'],
    elementType: string,
  ) => Promise<GIConfig['nodes'] | GIConfig['edges']>;
}

export const StyleSetting: ServiceObject = {
  name: '样式设置',
  service: async (elementConfig: GIConfig['nodes'] | GIConfig['edges'], elementType: string) => {
    const hash = window.location.hash;
    const projectId = hash.split('/')[2].split('?')[0];
    //@ts-ignore
    const { localforage } = window;
    //  debugger
    const project = await localforage.getItem(projectId);
    project.projectConfig[elementType] = elementConfig;

    localforage.setItem(projectId, {
      ...project,
    });

    return elementConfig;
  },
};
