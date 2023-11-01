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
    const { GI_SITE_PROJECT_ID } = utils.getProjectContext();
    if (GI_SITE_PROJECT_ID) {
      //@ts-ignore
      const { GI_PROJECT_DB } = window;
      //  debugger
      const project = await GI_PROJECT_DB?.getItem(GI_SITE_PROJECT_ID);
      project.projectConfig[elementType] = elementConfig;

      GI_PROJECT_DB.setItem(GI_SITE_PROJECT_ID, {
        ...project,
      });
    }
    return elementConfig;
  },
};
