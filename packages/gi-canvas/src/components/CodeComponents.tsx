const str = `
const b = ()=>{
  console.log('hello world')
  return 2
}
b()
`;

function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}

// const a = looseJsonParse(str);
// console.log(a, typeof a, { components: a });

const components = {
  legend: {
    component: function DumiDemo() {
      var _interopRequireDefault = require('/Users/pomelo/Desktop/github/temp/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/interopRequireDefault');

      var _react = _interopRequireDefault(require('react'));

      var _default = function _default() {
        return /*#__PURE__*/ _react['default'].createElement('h1', null, 'hello world');
      };

      return _react['default'].createElement(_default);
    },
    previewerProps: {
      sources: { _: { jsx: 'import React from "react";\nexport default () => {\n  return <h1>hello world</h1>;\n};' } },
      dependencies: { react: { version: '16.14.0' } },
      identifier: 'legend',
    },
  },
};
export default components;
