// more config: http://gitlab.alibaba-inc.com/parrot/parrot-tool-must/blob/master/doc/config.md
module.exports = {
  extract: {
    name: 'gi-site',
    sourcePath: 'src',
    fileType: 'ts',
    prettier: true,
    exclude: (path)=>{
      return path.includes('useHtml') || path.includes('useCodeSandbox') || path.includes('useNodeModule'); // 
    },
    matchCopy: (text, path) => {
      const isConsoleLog = /^console\.(log|warn|error|info)\(/gi.test(path.parentPath.toString());
      // 简单正则先处理 匹配是否是注释字符串
      const isCodeComment = /\/\/.*|\/*[sS]*?\*\//gi.test(path.parentPath.toString());
      // ^\x00-\xff 表示匹配中文字符
      const isChinese = /[^\x00-\xff]/.test(text);
      return isChinese && !isConsoleLog && !isCodeComment;
    },
    macro: {
      path: 'src/i18n',
      method: '$i18n.get({id:"$key$",dm:"$defaultMessage$"})',
      import: 'import $i18n from "src/i18n"',
      keySplitter: '.',
      placeholder: variable => {
        return `{${variable}}`;
      },
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
    isNeedUploadCopyToMedusa: true,
    sourceLang: 'zh-CN',
  },
};
