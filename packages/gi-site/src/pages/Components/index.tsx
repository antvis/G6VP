// // 组件市场
// import * as Babel from '@babel/standalone';

// const inputStr = `
// import React from 'react';
// import ReactDOM from 'react-dom'
// const App =()=>{
//   return <div>App</div>
// };

// `;

// const jsxCodeTransform = input => {
//   return Babel.transform(input, { presets: ['react', 'es2015'] }).code;
// };

// const reactStr = jsxCodeTransform(inputStr);

// function looseJsonParse(obj) {
//   return Function('"use strict";return (' + obj + ')')();
// }

// const a = looseJsonParse(reactStr);

// export default a;
