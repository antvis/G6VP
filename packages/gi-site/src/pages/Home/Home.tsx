import React from 'react';
import Navbar from './Navbar';
const Home = () => {
  const analysis = `
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-9Z6Z0NTLFB");
`;

  const css = `
.gi-home {
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  text-transform: uppercase;
}

`;

  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9Z6Z0NTLFB"></script>
        <script>{analysis}</script>
        <style>{css}</style>
      </head>
      <body>
        GraphInsight 首页 正在开发中...
        <a href="/#/workspace">进入工作台</a>
        <Navbar />
      </body>
    </html>
  );
};

const developer = [
  {
    title: '快速验证想法，享受搭积木的乐趣',
    content:
      '数据的多源异构，业务逻辑的复杂性加剧，越来越多的企业面临深度关联分析需求 ，也会涌现相当多的创新产品，这些产品使用图的思维来分析解决问题。对于开发者而言，开发者面临众多创新的图分析产品本身存在很高的创新风险，对于开发者而言，既要快速验证业务想法，同时也要',
  },
  {
    title: '零成本上手开发，专注你所关心的',
  },
  {
    title: '极速部署上线，一切只为开放而生',
  },
];

export default Home;
