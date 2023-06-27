// more config: http://gitlab.alibaba-inc.com/parrot/parrot-tool-must/blob/master/doc/config.md
const name = 'advance';
module.exports = {
  extract: {
    name,
    sourcePath: 'src',
    fileType: 'ts',
    prettier: true,
    exclude: (path)=>{
      return path.includes('/pages/') ; // 
    },
    macro: {
      path: 'src/i18n',
      method: '$i18n.get({id:"$key$",dm:"$defaultMessage$"})',
      import: 'import $i18n from "src/i18n"',
      keySplitter: '.',
      placeholder: variable => {
        return `{${variable}}`;
      },
      implement: `import locale from '@aligov/global-locale';
import stringFormat from '@aligov/global-string-format';
import strings from './strings';

let language; // Current language
let intl; // Instance of intl-universal. Create by provideIntl

function update() {
  const { lang } = locale.getLocale();
  language = lang;
  intl = stringFormat.init(lang, strings, { name: '${name}' });
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
      { name: '${name}' }
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
    { name: '${name}' }
  );
}

export default {
  get,
  update,
  change,
  language,
};
      `,
      dependencies: ['@aligov/global-locale', '@aligov/global-string-format'],
    },
    babel: {
      allowImportExportEverywhere: true,
      decoratorsBeforeExport: true,
      plugins: [
        'asyncGenerators',
        'classProperties',
        'decorators-legacy',
        'doExpressions',
        'exportExtensions',
        'exportDefaultFrom',
        'typescript',
        'functionSent',
        'functionBind',
        'jsx',
        'objectRestSpread',
        'dynamicImport',
        'numericSeparator',
        'optionalChaining',
        'optionalCatchBinding',
      ],
    },
    isNeedUploadCopyToMedusa: false,
    sourceLang: 'zh-CN',
  },
};
