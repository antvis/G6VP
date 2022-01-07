import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import GISDK from '@alipay/graphinsight';
import * as React from 'react';
import Offset from './DataVGui/Offset';
import TagsSelect from './DataVGui/TagsSelect';
import { assets as MockAssets, config as MockConfig, services as MockServices } from './mock';
import WrapContainer from './OperatorBar/WrapContainer';
const extensions = {
  TagsSelect,
  Offset,
};

interface TestSDKProps {
  asset: any;
  /** 资产类型 */
  type?: 'GIAC_CONTENT' | 'GIAC';
  /** 自定义数据服务 */
  services: any[];
}
const styles = {
  root: {
    display: 'flex',
  },
  meta: {
    flexBasic: '300px',
    width: '300px',
    border: '2px #1f1b1a dashed',
    minHeight: '500px',
    padding: '4px',
    textAlign: 'center',
    fontSize: '14px',
  },
  content: {
    flex: 1,
  },
};

/** 数组去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);

const TestSDK: React.FunctionComponent<TestSDKProps> = props => {
  const { asset, type, services = [] } = props;
  const { info, registerMeta } = asset;
  const { id, name } = info;

  const [state, setState] = React.useState({
    isReady: false,
    data: {},
    configObj: {},
    valueObj: {},
  });

  const { valueObj, configObj } = state;
  const innerServices = uniqueElementsBy([...services, ...MockServices], (a, b) => {
    return a.id === b.id;
  });

  /** 得到数据信息 */
  React.useMemo(() => {
    const initialServer = innerServices.find(c => {
      return c.id === 'GI_SERVICE_INTIAL_GRAPH';
    });

    initialServer.service().then(res => {
      const meta = registerMeta({
        data: res,
        services: innerServices,
      });
      const configObj = {
        [id]: {
          name: name,
          type: 'group',
          fold: false,
          children: {
            ...meta,
          },
        },
      };
      const valueObj = extractDefault({ config: configObj, value: {} });

      setState(preState => {
        return {
          ...preState,
          data: res,
          isReady: true,
          configObj,
          valueObj,
        };
      });
    });
  }, []);

  const handleChange = e => {
    const { rootValue } = e;
    setState(preState => {
      return {
        ...preState,
        valueObj: rootValue,
      };
    });
  };
  const FinalAsset = React.useMemo(() => {
    if (type === 'GIAC_CONTENT') {
      return {
        ...asset,
        component: WrapContainer(asset.component),
      };
    }

    return asset;
  }, []);

  const assets = {
    ...MockAssets,
    services: [...innerServices],
    components: {
      [id]: FinalAsset,
    },
  };

  const config = {
    ...MockConfig,
    components: [
      {
        id,
        props: valueObj[id],
      },
    ],
  };

  if (!state.isReady) {
    return null;
  }
  return (
    <div style={styles.root}>
      {/* @ts-ignore */}
      <div style={styles.meta}>
        <h3>GraphInsight 属性面板配置</h3>
        <GUI configObj={configObj} valueObj={valueObj} onChange={handleChange} extensions={extensions} />
      </div>
      <div style={styles.content}>
        {/* @ts-ignore */}
        <GISDK config={config} assets={assets} />
      </div>
    </div>
  );
};

export default TestSDK;
