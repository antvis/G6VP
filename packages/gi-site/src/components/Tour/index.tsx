// import { AppstoreAddOutlined, ReadOutlined } from '@ant-design/icons';
// import { Tour } from '@ant-design/pro-components';
// import { Button, Typography } from 'antd';
// import React from 'react';
// import { getSearchParams } from '../utils';
// import './index.less';
// const { Text, Paragraph, Link } = Typography;

// const graph = {
//   nodes: [
//     {
//       id: 'node-1',
//     },
//     {
//       id: 'node-2',
//     },
//   ],
//   edges: {
//     source: 'node-1',
//     target: 'node-2',
//   },
// };
// const STEP = {
//   data: [
//     {
//       selector: '.step-button',
//       title: '欢迎使用 GraphInsight 帮助指南',
//       content: () => (
//         <div style={{ width: '500px' }} className="gi-tour-p">
//           您可以在页面的 <Text type="success">任意导航位置</Text>，激活该指引。 此时，您正处于
//           <Text type="success">「数据」</Text>模块,该模块是我们使用 GraphInsight 产品的第一步，让我们一起来看看吧～
//           <Paragraph>
//             <img
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*jDPtSJM0mCsAAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </Paragraph>
//         </div>
//       ),
//     },
//     {
//       selector: '.gi-intro-upload-data',
//       title: 'Step1: 导入你的数据',
//       content: () => (
//         <div style={{ width: '600px' }} className="gi-tour-p">
//           点击「导入」按钮，即可出现倒入数据的弹窗，目前 GraphInsight
//           仅提供「本地数据」导入方式（开放API与GraphScope后续接入）
//           <img
//             width="600px"
//             src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*p_e-QKA8z5EAAAAAAAAAAAAAARQnAQ"
//             alt=""
//           />
//           本地数据的格式为标准的 Graph JSON: <br /> <Text code> {JSON.stringify(graph, null, 2)}</Text> <br />
//           <Text type="danger">红色圈选字段 </Text>为必填字段，
//           <Text type="success">绿色圈选字段</Text> 为指定的节点和边的类型。若您未准备好数据集，可以尝试使用官方提供的
//           MOCK 数据进行体验.
//         </div>
//       ),
//     },
//     {
//       selector: '.gi-sidebar',
//       title: 'Step2: 定制你的图分析工作台',
//       content: () => (
//         <div style={{ width: '700px' }} className="gi-tour-p">
//           导入完数据，我们就进入「定制工作台」的流程，点击侧边栏这些导航，依次设置图的样式，布局，与分析组件。这部分的详细介绍，可以在对应的导航页中开启
//           <Text type="success">「帮助指南」</Text>
//           <img
//             className="gi-tour-image"
//             width="700px"
//             src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*liWgT7nNuyoAAAAAAAAAAAAAARQnAQ"
//             alt=""
//           />
//         </div>
//       ),
//     },

//     {
//       selector: '.gi-intro-save',
//       title: 'Step3: 保存全部操作配置',
//       content: () => (
//         <div style={{ width: '400px' }} className="gi-tour-p">
//           目前 GraphInsight 还没有做 <Text type="success">「自动保存」</Text>
//           的功能，因此需要您手动保存，这样刷新浏览器后，配置才不会丢失。
//         </div>
//       ),
//     },
//     {
//       selector: '.gi-intro-export',
//       title: 'Step4: 导出您的分析画布',
//       content: () => (
//         <div style={{ width: '500px' }} className="gi-tour-p">
//           点击「导出」按钮，即可导出您的分析画布。目前我们提供了HTML文件导出，详情可参考
//           <Link href="https://www.yuque.com/antv/gi/nrptse">《部署指南》 </Link>
//           无需代码开发 即可拥有属于你自己的图分析工作台，快来试试吧～
//           <img
//             width="500px"
//             className="gi-tour-image"
//             src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*qTjSRIEEdEMAAAAAAAAAAAAAARQnAQ"
//             alt=""
//           />
//         </div>
//       ),
//     },
//   ],
//   style: [
//     {
//       selector: '.ant-tabs-nav',
//       title: '元素导航栏',
//       content: () => <div>点击切换元素：分别设置节点和边的样式</div>,
//     },
//     {
//       selector: '.gi-tour-style-add-group',
//       title: '样式分组',
//       content: () => {
//         return (
//           <div className="w-325">
//             初始化阶段，系统根据节点和边的类型，默认给出一个样式分组。
//             您可以根据业务需求，新增分组，为不同的分组，设置不同的样式。
//           </div>
//         );
//       },
//     },
//     {
//       selector: '.gi-tour-style-rule-0',
//       title: '分组规则',
//       content: () => {
//         return (
//           <div style={{ width: '500px' }}>
//             GraphInsight 支持属性规则设置，满足该规则的元素分为一组，规则支持「AND」和「OR」的运算逻辑
//             <img
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*rDKhSpiKeGIAAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </div>
//         );
//       },
//     },
//     {
//       selector: '.gi-assets-selector',
//       title: '元素切换',

//       content: () => {
//         return (
//           <div style={{ width: '500px' }}>
//             GraphInsight 支持不同元素的切换，丰富的元素满足用户的个性化需求，更多元素资产请在「资产中心」查看
//             <img
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*nLmaTp3zLigAAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </div>
//         );
//       },
//     },
//     {
//       selector: '.gi-tour-assets-elements',
//       title: '自选元素资产',

//       content: () => {
//         return (
//           <div>
//             点击 <AppstoreAddOutlined /> 图标，选择更多元素资产
//             <img
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*fD7DQaOn6p0AAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </div>
//         );
//       },
//     },
//   ],
//   layout: [
//     {
//       selector: '.gi-tour-layout-switch',
//       title: '切换布局',
//       placement: 'right',
//       content: () => {
//         return <div className="w-325">下拉选择您所需要的布局，每种布局将对应不同的参数配置</div>;
//       },
//     },
//     {
//       selector: '.gi-tour-assets-layouts',
//       title: '自选布局资产',
//       content: () => {
//         return (
//           <div>
//             点击 <AppstoreAddOutlined /> 图标，选择更多布局资产
//             <img
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*jvKiTZnT5uUAAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </div>
//         );
//       },
//     },
//   ],
//   components: [
//     {
//       selector: '.gi-tour-components-Toolbar',
//       title: '容器组件',
//       content: () => {
//         return (
//           <div style={{ width: '500px' }}>
//             在 GraphInsight
//             产品中，最重要的组件就是「容器组件」，它们可以集成任意「原子组件」,并决定了其何时渲染，何时交互。
//             <blockquote>
//               <Text type="warning" italic>
//                 未被集成到「容器组件」中的「原子组件」将不会被渲染
//               </Text>
//             </blockquote>
//             <img
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*EESeTaGFLQsAAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </div>
//         );
//       },
//     },
//     {
//       selector: '.gi-tour-components-ZoomIn',
//       title: '原子组件',
//       content: () => {
//         return (
//           <div style={{ width: '500px' }}>
//             在 GraphInsight 产品中，「原子组件」负责画布的众多功能实现，它们需要被集成在「容器组件」
//             <Text type="success" italic>
//               原子组件可以决定自己的展示名称，展示图标，展示顺序，触发条件等
//             </Text>
//             <img
//               height="320px"
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*KtWJR7x7avoAAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </div>
//         );
//       },
//     },
//     {
//       selector: '.gi-tour-assets-components',
//       title: '自选分析组件资产',
//       content: () => {
//         return (
//           <div>
//             点击 <AppstoreAddOutlined /> 图标，选择更多元素资产
//             <img
//               className="gi-tour-image"
//               src="https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*jvKiTZnT5uUAAAAAAAAAAAAAARQnAQ"
//               alt=""
//             />
//           </div>
//         );
//       },
//     },
//   ],
// };
// export default () => {
//   const { searchParams } = getSearchParams(window.location);
//   const activeNavbar = searchParams.get('nav') || 'data';
//   const [state, setState] = React.useState({
//     isTourOpen: false,
//     curStep: 0,
//   });

//   const steps = STEP[activeNavbar] || STEP['data'];

//   const { isTourOpen, curStep } = state;
//   React.useEffect(() => {
//     const str = `GI_TOUR_${activeNavbar.toUpperCase()}`;
//     const IS_NEW = localStorage.getItem(str);
//     if (IS_NEW !== 'true') {
//       setState(preState => {
//         return {
//           ...preState,
//           isTourOpen: true,
//         };
//       });
//       localStorage.setItem(str, 'true');
//     }
//   }, [activeNavbar]);

//   return (
//     <div>
//       <div>
//         <Button
//           size="small"
//           onClick={() => {
//             setState(preState => {
//               return {
//                 ...preState,
//                 isTourOpen: true,
//                 curStep: 0,
//               };
//             });
//           }}
//           className="step-button"
//           icon={<ReadOutlined />}
//         >
//           指南
//         </Button>
//       </div>
//       <Tour
//         steps={steps}
//         visible={isTourOpen}
//         defaultCurrent={curStep}
//         onChange={cur => {
//           setState(preState => {
//             return {
//               ...preState,
//               curStep: cur,
//             };
//           });
//         }}
//         onCancel={() => {
//           setState(preState => {
//             return {
//               ...preState,
//               isTourOpen: false,
//               curStep: 0,
//             };
//           });
//         }}
//       />
//     </div>
//   );
// };
