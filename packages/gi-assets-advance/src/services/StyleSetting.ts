import type { GIConfig } from '@alipay/graphinsight';
import { utils } from '@alipay/graphinsight';

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
    const projectId = utils.getProjectId();
    if (projectId) {
      //@ts-ignore
      const { localforage } = window;
      //  debugger
      const project = await localforage.getItem(projectId);
      project.projectConfig[elementType] = elementConfig;

      localforage.setItem(projectId, {
        ...project,
      });
    }
    return elementConfig;
  },
};
