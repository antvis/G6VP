import { utils } from '@antv/gi-sdk';
import type { ITheme } from '../components/ThemeSetting/typing';
import $i18n from '../i18n';
export const AddTheme = {
  name: $i18n.get({ id: 'advance.src.services.ThemeSetting.AddTopic', dm: '添加主题' }),
  service: async (theme: ITheme) => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const themes = project.themes || [];
    //project.themes = [...themes, theme];
    const newThemes = [...themes, theme];
    localforage.setItem(projectId, { ...project, themes: newThemes });
    return {
      success: true,
      msg: $i18n.get({ id: 'advance.src.services.ThemeSetting.TheThemeHasBeenCreated', dm: '主题创建成功！' }),
      data: [...newThemes],
    };
  },
};
export const GetTheme = {
  name: $i18n.get({ id: 'advance.src.services.ThemeSetting.GetTopics', dm: '获取主题' }),
  service: async () => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const themes = project.themes || [];
    return {
      success: true,
      data: themes,
    };
  },
};
export const UpdateTheme = {
  name: $i18n.get({ id: 'advance.src.services.ThemeSetting.UpdateTopic', dm: '更新主题' }),
  service: async (id: string, theme: ITheme) => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const themes = project.themes || [];
    const index = themes.findIndex(item => item.id === id);
    if (index !== -1) {
      themes[index] = theme;
      localforage.setItem(projectId, { ...project, themes });
      return {
        success: true,
        msg: $i18n.get({ id: 'advance.src.services.ThemeSetting.TheTopicHasBeenUpdated', dm: '主题更新成功' }),
        data: [...themes],
      };
    } else {
      return {
        sucess: false,
        msg: $i18n.get({ id: 'advance.src.services.ThemeSetting.TheTopicDoesNotExist', dm: '主题不存在' }),
      };
    }
  },
};
export const RemoveTheme = {
  name: $i18n.get({ id: 'advance.src.services.ThemeSetting.DeleteATopic', dm: '删除主题' }),
  service: async (id: string) => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const themes = project.themes;
    const filterThemes = themes.filter(item => item.id !== id);
    localforage.setItem(projectId, { ...project, themes: filterThemes });
    return {
      success: true,
      msg: $i18n.get({ id: 'advance.src.services.ThemeSetting.DeletedSuccessfully', dm: '删除成功' }),
      data: filterThemes,
    };
  },
};
