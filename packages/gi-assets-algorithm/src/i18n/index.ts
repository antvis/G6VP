import locale from '@aligov/global-locale';
import stringFormat from '@aligov/global-string-format';
import strings from './strings';

let language; // Current language
let intl; // Instance of intl-universal. Create by provideIntl
/**
 * update instance of intl universal
 */
function update() {
  const { lang } = locale.getLocale();
  language = lang;
  intl = stringFormat.init(lang, strings);
}

/**
 * change current language
 * @param {string} langTag language tag config above
 */
function change(langTag) {
  locale.setLang(langTag);
  update();
}
/**
 * Format string by key
 * For example:
 * $i18n.get('jsx.home.title'),
 * $i18n.get({
 *    id: 'jsx.home.hello',
 *    defaultMessage: 'Hello {name}' // not required
 * },{
 *  name: 'Alice'
 * })
 * More syntax: https://formatjs.io/guides/message-syntax/
 * @param {string|object} id key or object
 * @param {object} variable variable for id
 * @return {string} format message
 */
function get(id, variable = {}) {
  if (!intl) update();
  if (typeof id === 'string') {
    return stringFormat.format(
      {
        id: id,
      },
      variable,
    );
  } else if (typeof id === 'object' && id.dm) {
    id.defaultMessage = id.dm;
  }
  return stringFormat.format(
    {
      id: id.id,
      defaultString: id.dm,
    },
    variable,
  );
}

export default {
  get,
  update,
  change,
  language,
};
