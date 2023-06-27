import locale from '@aligov/global-locale';
import stringFormat from '@aligov/global-string-format';
import strings from './strings';

let language; // Current language
let intl; // Instance of intl-universal. Create by provideIntl

function update() {
  const { lang } = locale.getLocale();
  language = lang;
  intl = stringFormat.init(lang, strings, { name: 'common-components' });
}

function change(langTag) {
  locale.setLang(langTag);
  update();
}

function get(id, variable = {}) {
  if (!intl) update();
  if (typeof id === 'string') {
    return stringFormat.format(
      {
        id: id,
      },
      variable,
      { name: 'common-components' }
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
    { name: 'common-components' }
  );
}

export default {
  get,
  update,
  change,
  language,
};
      