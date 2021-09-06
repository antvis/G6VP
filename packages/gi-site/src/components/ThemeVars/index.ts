import dataVTheme from './datav';
import siteTheme from './site';
const theme = {
  light: {
    ...dataVTheme.light,
    ...siteTheme.light,
  },
  dark: {
    ...dataVTheme.dark,
    ...siteTheme.dark,
  },
};
export default theme;
