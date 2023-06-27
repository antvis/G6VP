import type { GIConfig } from '@antv/gi-sdk';
import { utils } from '@antv/gi-sdk';
import $i18n from '../i18n';

export interface ServiceObject {
  name: string;
  service: (
    elementConfig: GIConfig['nodes'] | GIConfig['edges'],
    elementType: string,
  ) => Promise<GIConfig['nodes'] | GIConfig['edges']>;
}

export const StyleSetting: ServiceObject = {
  name: $i18n.get({ id: 'advance.src.services.StyleSetting.StyleSettings', dm: '样式设置' }),
  service: async (elementConfig: GIConfig['nodes'] | GIConfig['edges'], elementType: string) => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    if (projectId) {
      //@ts-ignore
      const { localforage } = window;
      //  debugger
      const project = await localforage?.getItem(projectId);
      project.projectConfig[elementType] = elementConfig;

      localforage.setItem(projectId, {
        ...project,
      });
    }
    return elementConfig;
  },
};
