import { produce } from 'immer';
const useTheme = async (context, updateState, themeValue) => {
  const { config, themes, id: projectId } = context;

  if (!themes) {
    if (themeValue === 'dark') {
      const current_light = {
        canvasConfig: config.components.find(item => item.id === 'CanvasSetting').props,
        nodesConfig: config.nodes,
        edgesConfig: config.edges,
        name: '白天模式',
        id: 'light',
      };
      const darkConfig = produce(config, draft => {
        draft.nodes.forEach(itemCfg => {
          if (itemCfg.props.advanced) {
            itemCfg.props.advanced.label.fill = '#fff';
          }
        });
        draft.edges.forEach(itemCfg => {
          if (itemCfg.props.advanced) {
            if (itemCfg.props.advanced.label.backgroundEnable) {
              itemCfg.props.advanced.label.backgroundFill = '#1f1f1f';
              itemCfg.props.advanced.label.backgroundStroke = '#1f1f1f';
            }
          }
        });
        draft.components.forEach(itemCfg => {
          if (itemCfg.id === 'CanvasSetting') {
            itemCfg.props.styleCanvas.backgroundColor = '#1f1f1f';
          }
        });
      });

      const current_dark = {
        //@ts-ignore
        canvasConfig: darkConfig.components.find(item => item.id === 'CanvasSetting').props,
        //@ts-ignore
        nodesConfig: darkConfig.nodes,
        //@ts-ignore
        edgesConfig: darkConfig.edges,
        name: '黑夜模式',
        id: 'dark',
      };

      //@ts-ignore
      const { localforage } = window;
      const project = await localforage.getItem(projectId);
      localforage.setItem(projectId, { ...project, themes: [current_light, current_dark] });
      updateState(draft => {
        draft.themes = [current_light, current_dark];
        draft.config = darkConfig;
      });
    } else {
      console.log('请先恢复到白色主题');
    }
  } else {
    const theme = themes.find(item => item.id === themeValue);
    const newConfig = produce(config, draft => {
      draft.components.forEach(itemCfg => {
        if (itemCfg.id === 'CanvasSetting') {
          itemCfg.props = theme.canvasConfig;
        }
      });
      draft.nodes = theme.nodesConfig;
      draft.edges = theme.edgesConfig;
    });

    updateState(draft => {
      draft.config = newConfig;
    });
  }
};

export default useTheme;
