import { GILocaleAssets } from '../typing';

const getCurrentLocales = (locales: GILocaleAssets = {}, lang: string) => {
  let currentLocales = {
    language: lang
  };
  if (locales[lang]) {
    currentLocales = locales[lang];
  } else {
    Object.keys(locales).forEach(key => {
      if (locales[key].language === lang) {
        currentLocales = locales[key];
      }
    })
  }
  return currentLocales;
}

export default getCurrentLocales;
