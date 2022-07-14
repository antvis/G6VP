import { ADD_THEME, GET_THEMES } from './const';
import { ITheme } from './typing';

const mockServices = () => {
  return [
    {
      id: GET_THEMES,
      service: async () => {
        const hash = window.location.hash;
        const projectId = hash.split('/')[2].split('?')[0];
        //@ts-ignore
        const { localforage } = window;
        const project = await localforage.getItem(projectId);
        console.log('project', project, projectId);
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
        const hash = window.location.hash;
        const projectId = hash.split('/')[2].split('?')[0];
        //@ts-ignore
        const { localforage } = window;
        const project = await localforage.getItem(projectId);
        console.log('project', project, projectId);
        const themes = project.themes || [];
        //project.themes = [...themes, theme];
        const newThemes = [...themes, theme];
        localforage.setItem(projectId, { ...project, themes: newThemes });
        return {
          success: true,
          msg: "主题创建成功！",
          data: newThemes,
        };
      },
    },
    // {
    //   id: SERVICE_ID,
    //   service: () => {
    //     const themes: ITheme[] = window.localStorage.getItem(STORAGE_KEYS)
    //       ? JSON.parse(window.localStorage.getItem(STORAGE_KEYS)!)
    //       : [];

    //     const addTheme = async (theme: ITheme) => {
    //       const newThemes = [...themes, theme]
    //       window.localStorage.setItem(STORAGE_KEYS, JSON.stringify(newThemes));
    //       return {
    //         success: true,
    //         data: newThemes
    //       }
    //     };

    //     const removeTheme = async (id: string) => {
    //       const filterThemes = themes.filter(item => item.id !== id);
    //       window.localStorage.setItem(STORAGE_KEYS, JSON.stringify(JSON.stringify(filterThemes)));
    //       return {
    //         success: true,
    //         data: filterThemes,
    //       }
    //     }

    //     return new Promise(resolve => {
    //       resolve({
    //         themes,
    //         addTheme,
    //         removeTheme,
    //       });
    //     });
    //   },
    // },
  ];
};

export default mockServices;
