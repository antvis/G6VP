import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import GISDK, { utils } from '@alipay/graphinsight';
import * as React from 'react';
import Offset from './DataVGui/Offset';
import TagsSelect from './DataVGui/TagsSelect';
import { services as MockServices } from './mock';
import { getAssetsByType, getConfigByType } from './utils';

const extensions = {
  TagsSelect,
  Offset,
};

export interface TestSDKProps {
  asset: any;
  /** 资产类型 */
  type?: 'GICC' | 'GICC_MENU' | 'GIAC' | 'GIAC_CONTENT' | 'GIAC_MENU';
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

const TestSDK: React.FunctionComponent<TestSDKProps> = props => {
  const { asset, type, services = [] } = props;
  const { info, registerMeta, component } = asset;
  const { id, name } = info;

  const [state, setState] = React.useState({
    isReady: false,
    data: {},
    configObj: {},
    valueObj: {},
  });

  const { valueObj, configObj } = state;
  const innerServices = utils.uniqueElementsBy([...services, ...MockServices], (a, b) => {
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

  const { assets, config } = React.useMemo(() => {
    const nextConfig = getConfigByType(type, id, valueObj);
    const nextAssets = getAssetsByType(type, id, asset);
    return {
      config: nextConfig,
      assets: nextAssets,
    };
  }, [valueObj, type]);

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
        <GISDK config={config} assets={assets} services={innerServices} />
      </div>
    </div>
  );
};

export default TestSDK;
