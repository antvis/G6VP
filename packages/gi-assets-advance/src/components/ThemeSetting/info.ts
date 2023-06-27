import $i18n from '../../i18n';
const info = {
  id: 'ThemeSetting',
  name: $i18n.get({ id: 'advance.components.ThemeSetting.info.ThemeSettings', dm: '主题设置' }),
  desc: $i18n.get({
    id: 'advance.components.ThemeSetting.info.YouCanConfigureThemeStyles',
    dm: '可以自主配置主题样式',
  }),
  icon: 'icon-theme',
  cover: 'http://xxxx.jpg',
  category: 'workbook',
  type: 'GIAC_CONTENT',
  services: ['AddTheme', 'RemoveTheme', 'GetTheme', 'UpdateTheme'],
  docs: 'https://www.yuque.com/antv/gi/ua0gy9t0clagrygi',
};

export default info;
