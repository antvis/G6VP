import { utils } from '@antv/gi-sdk';
import { ADD_THEME, GET_THEMES, REMOVE_THEME, UPDATE_THEME } from './const';
import { ITheme } from './typing';
import $i18n from '../../i18n';

const mockServices = () => {
  return [
    {
      id: GET_THEMES,
      service: async () => {
        const { GI_SITE_PROJECT_ID } = utils.getServerEngineContext();
        //@ts-ignore
        const { GI_PROJECT_DB } = window;
        const project = await GI_PROJECT_DB.getItem(GI_SITE_PROJECT_ID);

        const themes = project.themes || [];
        return {
          success: true,
          data: themes,
        };
      },
    },
    {
      id: ADD_THEME,
      service: async (theme: ITheme) => {
        const { GI_SITE_PROJECT_ID } = utils.getServerEngineContext();
        //@ts-ignore
        const { GI_PROJECT_DB } = window;
        const project = await GI_PROJECT_DB.getItem(GI_SITE_PROJECT_ID);

        const themes = project.themes || [];
        //project.themes = [...themes, theme];
        const newThemes = [...themes, theme];
        GI_PROJECT_DB.setItem(GI_SITE_PROJECT_ID, { ...project, themes: newThemes });
        return {
          success: true,
          msg: $i18n.get({
            id: 'advance.components.ThemeSetting.mockServices.TheThemeHasBeenCreated',
            dm: '主题创建成功！',
          }),
          data: [...newThemes],
        };
      },
    },
    {
      id: UPDATE_THEME,
      service: async (id: string, theme: ITheme) => {
        const { GI_SITE_PROJECT_ID } = utils.getServerEngineContext();
        //@ts-ignore
        const { GI_PROJECT_DB } = window;
        const project = await GI_PROJECT_DB.getItem(GI_SITE_PROJECT_ID);

        const themes = project.themes || [];
        const index = themes.findIndex(item => item.id === id);
        if (index !== -1) {
          themes[index] = theme;
          GI_PROJECT_DB.setItem(GI_SITE_PROJECT_ID, { ...project, themes });
          return {
            success: true,
            msg: $i18n.get({
              id: 'advance.components.ThemeSetting.mockServices.TheTopicHasBeenUpdated',
              dm: '主题更新成功',
            }),
            data: [...themes],
          };
        } else {
          return {
            sucess: false,
            msg: $i18n.get({
              id: 'advance.components.ThemeSetting.mockServices.TheTopicDoesNotExist',
              dm: '主题不存在',
            }),
          };
        }
      },
    },
    {
      id: REMOVE_THEME,
      service: async (id: string) => {
        const { GI_SITE_PROJECT_ID } = utils.getServerEngineContext();
        //@ts-ignore
        const { GI_PROJECT_DB } = window;
        const project = await GI_PROJECT_DB.getItem(GI_SITE_PROJECT_ID);

        const themes = project.themes;
        const filterThemes = themes.filter(item => item.id !== id);
        GI_PROJECT_DB.setItem(GI_SITE_PROJECT_ID, { ...project, themes: filterThemes });
        return {
          success: true,
          msg: $i18n.get({ id: 'advance.components.ThemeSetting.mockServices.DeletedSuccessfully', dm: '删除成功' }),
          data: filterThemes,
        };
      },
    },
  ];
};

export default mockServices;
