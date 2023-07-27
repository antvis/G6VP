import React from 'react';
import './index.less';

const ConciseContainer = props => {
  const { children } = props;
  // const context = useContext();
  // const { config, assets, HAS_GRAPH } = context;

  /**
   * hack start
   *
   * 不应该修改 registerMeta 原有的containers 数据结构
   * 1. 先把追加的 GI_FreeContainer 移除
   * 2. 把 GI_CONTAINER 中的 数组对象 改为字符串
   *
   * TODO：
   * 需要在gi-site层修改这个containers的值
   *
   */
  // const containers = props.containers.slice(0, -1).map(item => {
  //   return {
  //     ...item,
  //     GI_CONTAINER: item.GI_CONTAINER.map(item => item.value),
  //   };
  // });
  /** hack end */

  // const Containers = useContainer(context, containers);

  // const [header, panel] = Containers;
  // console.log('containers', containers, Containers);

  return <div className="gi-xlab">{children}</div>;
};

export default ConciseContainer;
