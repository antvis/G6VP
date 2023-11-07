import React, { useMemo } from 'react';
import Canvas from './Canvas';
import Components from './Components';
import { IdContext } from './Context';
import Prepare from './Prepare';
import './index.less';
import type { GIAssets, GIConfig, GIService } from './typing';

export type SDKProps = {
  /**
   * @description GISDK的ID，用于多实例管理，缺失会默认生成一个
   */
  id?: string;
  /**
   * @description 配置信息
   */
  config: GIConfig;
  /**
   * @description 资产实例
   */
  assets: GIAssets;
  /** 注册的全局数据服务 */
  services: GIService[];
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode[];
};

const GISDK = (props: SDKProps) => {
  const { assets, id, services } = props;
  /** get gisdk id */
  const GISDK_ID = useMemo(() => {
    if (!id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.warn(`⚠️: props.id 缺失，默认生成 GISDK_ID : ${defaultId} 用于多实例管理`);
      return defaultId;
    }
    return id;
  }, []);

  console.log('%c GISDK RENDER....', 'color:rgba(255,87,34,1)');
  const contextValue = {
    id: GISDK_ID,
    assets,
    services,
  };
  return (
    <div id={`${id}-container`} style={{ width: '100%', height: '100%', position: 'relative', ...props.style }}>
      {/* @ts-ignore */}
      <IdContext.Provider value={contextValue}>
        <Prepare config={props.config}>
          <Components>
            <Canvas />
          </Components>
        </Prepare>
      </IdContext.Provider>
    </div>
  );
};

export default React.memo(GISDK);
