import locale from '@aligov/global-locale';
import getCurrentLocales from './getCurrentLocales';
import { GILocaleAssets } from '../typing';

export enum LANGUAGE_KEY_NAME {
  ZhCN = 'zh-CN',
  EnUs = 'en-US'
}

/**
 * get current language
 */
const getCurrentLanguage = () => {
  const { lang = LANGUAGE_KEY_NAME.ZhCN } = locale.getLocale();
  return lang;
}

/**
 * change current language
 * @param {string} langTag language tag config above
 */
const changeLanguage = (langTag: LANGUAGE_KEY_NAME) => {
  locale.setLang(langTag);
}


const formatMessage = ({ id, defaultMessage, variable }: { id: string, defaultMessage?: string, variable?: any }, locales: GILocaleAssets) => {
  if (variable) {
    // todo 变量转换
  }
  let { lang = LANGUAGE_KEY_NAME.ZhCN } = locale.getLocale();
  const currrentLocales = getCurrentLocales(locales, lang);
  return currrentLocales?.[id] || defaultMessage || id;
}

export {
  formatMessage,
  getCurrentLanguage,
  changeLanguage,
};
