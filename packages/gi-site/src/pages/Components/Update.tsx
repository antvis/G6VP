// 组件市场
import React, { useEffect } from 'react';
import { message } from 'antd';
import { Provider } from 'react-redux';
import store from '../Analysis/redux';
import ComponentMetaPanel from './meta/ComponentMeta';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { queryAssetList, updateAssets, updateFileContent, getFileSourceCode, createNewBranch, queryAssetById } from '../../services/assets'
import { useImmer } from 'use-immer'
import { Project, ScriptTarget } from 'ts-morph'
import moment from 'moment'
import JSON5 from 'json5'
import GraphInsightIDE from './GraphInsightIDE'
import GravityDemoSDK from '@alipay/gravity-demo-sdk/dist/gravityDemoSdk/sdk/sdk.js';
import { usePersistFn } from 'ahooks'
import queryString from 'querystring'
import './index.less';

window.React = React

const ComponentMarket = props => {
  const { history } = props;

  const appRef = React.createRef()

  const [state, setState] = useImmer({
    currentSelectAsset: null,
    sourceCode: null,
    metaInfo: null,
    previewCode: null
  });

  const { currentSelectAsset} =state;

  const queryParams = queryString.parse(location.hash.split('?')[1])
  const projectName = queryParams.project as string
  const branchName = queryParams.branch as string
  const assetId = queryParams.assetId as string
  

  const setSourceCode = (value) => {
    setState(draft => {
      draft.sourceCode = value
    })
  }

  const updateAssetById = async (options) => {
    debugger
    const currentId: string = state.currentSelectAsset?.id
    
    const result = await updateAssets(currentId, options)
    const { success } = result
    if (!success) {
      message.error('Meta 信息保存失败')
      return
    }
  }

  const queryAssetDetailById = async () => {
    const result = await queryAssetById(assetId)
    const { data, success, errorMsg } = result
    if (!success) {
      // 接口执行失败
      message.error('接口请求失败', errorMsg)
      return
    }
    
    setState(draft => {
      draft.currentSelectAsset = data
    })
  }

  /**
   * 将源代码对象转成实时预览需要的数据格式
   * @param isc 源代码数据
   */
  const fileMapToModules = (isc) => {
    // 将初始化转换为预览的数据格式
    const previewCodeMap = Object.keys(isc).reduce((prev, file) => {
      let pervObj: any = prev
      if (typeof prev === 'string') {
        if (prev === 'demo.tsx') {
          pervObj = {
            [`/index.js`]: {
              code: isc[prev],
              fpath: `/index.js`,
              entry: 1
            }
          }
        } else {
          pervObj = {
            [`/${prev}`]: {
              code: isc[prev],
              fpath: `/${prev}`
            }
          }
        }
      }

      const fileObj = {
        code: isc[file],
        fpath: `/${file}`
      }
      
      if (file === 'demo.tsx') {
        // @ts-ignore
        fileObj.entry = 1
      }

      if (file === 'package.json') {
        // @ts-ignore
        fileObj.packagejson = 1
        fileObj.fpath = `/${file}`
        return {
          ...pervObj,
          [`/${file}`]: fileObj
        }
      }
      
      return {
        ...pervObj,
        [`/${file}`]: fileObj
      }
    })

    return previewCodeMap
  }

  /**
   * 初始查询文件内容，做实时预览使用
   */
  const queryInitSourceCode = async () => {
    // 加载所有的源文件，构造实时预览需要的初始数据
    const demoFile = await getFileSourceCode({
      projectName,
      branchName,
      path: 'demo.tsx'
    })

    const styleFile = await getFileSourceCode({
      projectName,
      branchName,
      path: 'index.module.less'
    })

    const componentFile = await getFileSourceCode({
      projectName,
      branchName,
      path: 'component.tsx'
    })

    const packageFile = await getFileSourceCode({
      projectName,
      branchName,
      path: 'package.json'
    })

    const initSourceCode = {
      'demo.tsx': demoFile.data,
      'index.module.less': styleFile.data,
      'component.tsx': componentFile.data,
      'package.json': packageFile.data
    }

    const previewCodeModules = fileMapToModules(initSourceCode)
    setState(draft => {
      draft.sourceCode = initSourceCode
      draft.previewCode = {
        modules: previewCodeModules,
        type: 'demo'
      }
    })
  }

  React.useEffect(() => {
    queryAssetDetailById()
    // 查询 preview 所需要的 code
    
    queryInitSourceCode()
    // TODO: 查询构建状态，如果有在构建中的组件，进行提示
  }, []);

  const projectBuild = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      target: ScriptTarget.ES3,
  },
  });

  const handleSourceCodeChange = async (filepath: string, source: string) => {
    // 如果修改的是 meta 信息，需要存储到数据库中
    const result = await updateFileContent({
      projectName,
      branchName,
      path: filepath,
      content: source,
      commitMsg: '测试修改文件'
    })
    
    const { success, errorMsg } = result
    if (!success) {
      // 保存失败，提示用户
      message.warn(`更改的内容未保存成功，错误原因: ${errorMsg}，请再次尝试`)
    }

    // 更新 gitlab 上文件成功，且为 meta 时候需要存储到数据库中
    if (success && filepath === 'meta.ts') {
      await updateAssetById({
        meta: source,
        // version: '0.0.1',
        // type: 1
      })

      // 更新 metainfo，触发右侧面板重新渲染
      // TODO: 临时处理，meta 信息需要换成 function

      const filesystem = projectBuild.getFileSystem()
      const sourceFile = projectBuild.createSourceFile('metaInfo.ts', source.split('export default')[0])
      sourceFile.saveSync()
      
      console.log('xxx', filesystem.readFileSync('metaInfo.ts'))
      // const metaInfo = source.replace(/\;/g, '').split('=')
      // if (metaInfo[1]) {
      //   const metaObj = JSON5.parse(metaInfo[1])
      //   setState(draft => {
      //     draft.metaInfo = metaObj
      //   })
      // }
    }
    setSourceCode({
      ...state.sourceCode,
      [filepath]: source
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
      // TODO: 临时处理，meta 信息需要换成 function
      // const metaInfo = state.currentSelectAsset.meta.replace(/\;/g, '').split('=')
      // if (metaInfo[1]) {
      //   const metaObj = JSON5.parse(metaInfo[1])
      //   setState(draft => {
      //     draft.metaInfo = metaObj
      //   })
      // }
    }
  }, [currentSelectAsset])

  
  useEffect(() => {
    if (state.sourceCode) {
      const previewCodeModules = fileMapToModules(state.sourceCode)
      setState(draft => {
        draft.sourceCode = state.sourceCode
        draft.previewCode = {
          modules: previewCodeModules,
          type: 'demo'
        }
      })
    }
  }, [state.sourceCode])

  // 发布组件，需要先创建分支，然后构建
  const handlePublish = async () => {
    const uuid = `${Math.random()
      .toString(36)
      .substr(2)}`;
    const currentDate = moment(new Date()).format('YYYYMMDD')
    const newBranchName = `sprint_${projectName}_${uuid}_${currentDate}`
    
    // step1: 创建新的分支
    const result = await createNewBranch({
      projectName,
      branchName: newBranchName,
      refBranchName: 'master'
    })
    
    // step2: 构建
    console.log('页面创建分支', result)
  }
  
  return (
    <>
      <BaseNavbar history={history} hasPublish={true} handlePublish={handlePublish}>
        <h4>物料中心</h4>
      </BaseNavbar>
      <div className="componet-market">
        <div className="gi-ide-wrapper">
          <GraphInsightIDE id='test' readOnly={false} appRef={appRef} mode='demo.tsx' codeChange={codeChangeCallback}  />
        </div>
        <div style={{ marginTop: 20 }} className='gi-config-wrapper'> 
        <div className="content config">
          {
            state.metaInfo
            ?
            <ComponentMetaPanel
              onChange={handleMetaInfoChange}
              config={state.metaInfo}
            />
            :
            '暂无 Meta 信息'
          }
        </div>
          <div className="content view">
          {
            state.previewCode &&
            <GravityDemoSDK
              code={state.previewCode}
              width="100%"
              height="300px"
              src="https://gw.alipayobjects.com/as/g/Gravity/gravity/3.10.3/gravityDemoSdk/index.html"/>
          }
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
