// import { Tabs } from 'antd';

// const { TabPane } = Tabs;
// // // 组件市场
// //@ts-nocheck
// import * as Babel from '@babel/standalone';
// import { Input } from 'antd';
// const TextArea = Input;

// // import React from 'react';
// // import ReactDOM from 'react-dom';

// const inputStr = `

// import React from 'react';

// const App =()=>{
//   return <div>App</div>
// }

// export default App;

// `;

// const extraStr = `

// ${inputStr}

// `;

// const jsxCodeTransform = input => {
//   console.log(Babel.availablePlugins);
//   return Babel.transform(input, {
//     presets: ['react', 'es2015'],
//     plugins: [Babel.availablePlugins['transform-modules-umd']],
//   }).code;
// };

// const reactStr = jsxCodeTransform(extraStr);

// function looseJsonParse(obj) {
//   return eval(obj); // Function('return (' + obj + ')')();
// }

// const evalString = `
// ()=>{
//  return ()=>{
//   ${reactStr}
// }
// }
// `;
// const A = looseJsonParse(evalString);
// const B = A();

// console.log('string', reactStr);
// console.log('A', A);
// console.log('TypeOf A', typeof A);
// console.log('B', B);

// // window._react = {
// //   default: require('react'),
// // };

// // const C = () => {
// //   var _interopRequireDefault = require('/Users/pomelo/Desktop/github/temp/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/interopRequireDefault');

// //   var _react = _interopRequireDefault(require('react'));

// //   var _default = function _default() {
// //     return /*#__PURE__*/ _react['default'].createElement('h1', null, 'hello world');
// //   };

// //   return _react['default'].createElement(_default);
// // };

// const handleChange = e => {
//   console.log('e', e.target.value);
// };

// const ComponentMarket = () => {
//   return (
//     <div>
//       <Tabs defaultActiveKey="component">
//         <TabPane tab="组件" key="component"></TabPane>
//         <TabPane tab="事件" key="event"></TabPane>
//         <TabPane tab="物料" key="materials"></TabPane>
//       </Tabs>
//     </div>
//   );
// };

// export default ComponentMarket;
