// 组件市场
import React, { useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Provider } from 'react-redux';
import { initMarket } from './services/services';
import { defaultConfig } from './services/defaultConfig';
import store from '../Analysis/redux';
import ComponentMetaPanel from './meta/ComponentMeta';
import { getRiddleAppCode } from '../../hooks';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { queryAssetList, updateAssets } from '../../services/assets'
import { useImmer } from 'use-immer'
import JSON5 from 'json5'
import GraphInsightIDE from './GraphInsightIDE'
import GravityDemoSDK from '@alipay/gravity-demo-sdk/dist/gravityDemoSdk/sdk/sdk.js';
import { usePersistFn } from 'ahooks'
import './index.less';

window.React = React

const ComponentMarket = props => {
  const { history } = props;

  const appRef = React.createRef()

  const [state, setState] = useImmer({
    currentSelectAsset: null,
    sourceCode: {},
    metaInfo: null
  });

  const { currentSelectAsset} =state;

  const setCurrentSelectAsset = (value) => {
    setState(draft => {
      draft.currentSelectAsset = value
    })
  }

  const setSourceCode = (value) => {
    setState(draft => {
      draft.sourceCode = value
    })
  }

  // code 源码数据结构，必须是如下结构
  const code = {
    modules: {
      // 以路径为 key，必须以绝对路径来描述
      '/src/index.js': {
        code: 'import less from "./index.module.less";import "./antd.css";import React from "react"; import ReactDOM from "react-dom";import { Button } from "antd"; function App() { return ( <div className={less.header}> <p> 这是一个 component 使用示例 </p> <p>Yeah magic happened!</p><p className={less.footer}>更多使用方式由你发挥</p> <Button type="primary">这是一个 antd 按钮</Button></div>); } const rootElement = document.getElementById("root"); ReactDOM.render(<App />, rootElement);',
        fpath: '/src/index.js',
        // 文件的绝对路径地址
        entry: 1,
        // entry 为 1，即声明该脚本文件为入口文件
      },
      '/package.json': {
        code: '{"name": "demo", "dependencies": {"antd": "4.x"}}',
        // dependencies 申明依赖关系
        fpath: '/package.json',
        packagejson: 1,
        // packagejson 为 1，即声明该 JSON 文件为声明依赖依赖关系的 package.json
      },
      '/src/antd.css': {
        code: '@import "~antd/dist/antd.css";',
        // 如果需要引入 npm 包的样式文件，用 ~ 申明
        fpath: '/src/antd.css',
      },
      // *.module.less 或 *.module.css 即声明使用 css module
      '/src/index.module.less': {
        code: '@import "./child.less";@font-size: 30px; .header { font-size: @font-size;}',
        fpath: '/src/index.module.less',
      },
      '/src/child.less': {
        code: '.footer { color:gray;}',
        fpath: '/src/child.less',
      },
    },
    type: 'demo',
  };

  const updateAssetById = async (options) => {
    const currentId: string = state.currentSelectAsset?.id
    
    const result = await updateAssets(currentId, options)
    const { success } = result
    if (!success) {
      message.error('Meta 信息保存失败')
      return
    }
  }

  const queryList = async () => {
    const result = await queryAssetList()
    console.log('列表', result)
    const { data, success, errorMsg } = result
    if (!success) {
      // 接口执行失败
      message.error('接口请求失败', errorMsg)
      return
    }
    
    // 获取资产列表以后，点击某一项就可以拿到 ID，更新对应的数据即可
    // TODO: 这里 mock 处理一下，我们拿第一条数据测试
    setCurrentSelectAsset(data[0])
  }

  React.useEffect(() => {
    queryList()
  }, []);

  const handleSourceCodeChange = async (type, source: string) => {
    // 如果 type 为 ts，则说明是 meta 信息，需要存储到数据库中
    if (type === 'meta') {
      await updateAssetById({
        name: '测试名称',
        meta: source,
        version: '0.0.1',
        type: 1
      })
    }
    setSourceCode({
      ...state.sourceCode,
      [type]: source
    })
  }

  const codeChangeCallback = usePersistFn(handleSourceCodeChange)

  const handleMetaInfoChange = (value) => {
    console.log(value)
    // TODO: Meta 配置面板，更新了以后，要同步更新图上
  }

  useEffect(() => {
    if (state.currentSelectAsset && state.currentSelectAsset.meta) {
      // 从 Meta 中解析出 Meta 对象
      const metaInfo = state.currentSelectAsset.meta.split('=')
      if (metaInfo[1]) {
        const metaObj = JSON5.parse(metaInfo[1])
        setState(draft => {
          draft.metaInfo = metaObj
        })
      }

      // 源文件需要服务端提供接口，读取 antCode 上的源码
      const testCode = {
        css: "@import '~antd/dist/antd.css';\n\n",
        html: "<div id=\"mountNode\"></div>",
        json: "{\n  \"name\": \"antd-demo\",\n  \"dependencies\": {\n    \"antd\": \"4.16.6\",\n    \"@ant-design/icons\": \"latest\"\n  }\n}",
        tsx: getRiddleAppCode({ ...defaultConfig }),
        meta: state.currentSelectAsset.meta,
        demo1: "import React from 'react' \n import { Button } from 'antd' \n \nconst Demo = () => {\n  return (\n    <Button>测试按钮</Button>\n  )\n}\nexport default Demo\n",
        demo: `import less from "./index.less";
import "./antd.css";
import React from "react"; 
import ReactDOM from "react-dom";
import { Button } from "antd"; 

const App = () => { 
  return ( 
    <div className={less.header}>
      <p>GraphInsight 资产市场</p>
      <p className={less.footer}>更多使用方式由你发挥</p> 
      <Button type="primary">这是一个 antd 按钮</Button>
    </div>); 
  } 
const rootElement = document.getElementById("mountNode"); 
ReactDOM.render(<App />, rootElement);
`
      }
      
      setSourceCode(testCode)
    }
  }, [currentSelectAsset])
  
  return (
    <>
      <BaseNavbar history={history}>
        <h4>物料中心</h4>
      </BaseNavbar>
      <div className="componet-market">
        <div className="gi-ide-wrapper">
          {
            state.sourceCode.meta &&
            <GraphInsightIDE id='test' readOnly={false} code={state.sourceCode} appRef={appRef} mode='tsx' codeChange={codeChangeCallback}  />
          }
        </div>
        <div style={{ marginTop: 20 }} className='gi-config-wrapper'> 
        {
          state.metaInfo &&
          <div className="content config">
            <ComponentMetaPanel
              onChange={handleMetaInfoChange}
              config={state.metaInfo}
            />
          </div>
        }
          <div className="content view">
            <GravityDemoSDK
              code={code}
              width="100%"
              height="300px"
              src="https://gw.alipayobjects.com/as/g/Gravity/gravity/3.10.3/gravityDemoSdk/index.html"/>
          </div>
        </div>
      </div>
    </>
  );
};

const WrapAnalysis = props => {
  return (
    <Provider store={store}>
      <ComponentMarket {...props} />
    </Provider>
  );
};

export default WrapAnalysis;
