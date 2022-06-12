// more config: http://gitlab.alibaba-inc.com/parrot/parrot-tool-must/blob/master/doc/config.md
module.exports = {
  extract: {
    name: 'gi-portal',
    sourcePath: 'src',
    fileType: 'ts',
    prettier: true,
    macro: {
      path: 'src/i18n',
      method: '$i18n.get({id:"$key$",dm:"$defaultMessage$"})',
      import: 'import $i18n from "src/i18n"',
      keySplitter: '.',
      placeholder: variable => {
        return `{${variable}}`;
      },
      dependencies: ['@ali/global-locale', '@ali/global-string-format'],
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
    isNeedUploadCopyToMedusa: true,
    sourceLang: 'zh-CN',
  },
  import: {
    type: 'json',
    path: 'src/i18n',
    medusa: {
      appName: 'gi-portal',
      tag: '',
    },
  },
};
