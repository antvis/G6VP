import React from 'react';
import { GIContext } from '../../index';
import { getSourcesByNode, getTargetsByNode, highlightNodeById, uniqueElementsBy } from './utils';
/** 点击实体节点的交互 */
const handleClickEntity = (graph, e) => {
  /** 递归遍历下游节点 */
  const targets = getTargetsByNode(e.item, target => {
    return target.data.type === 'EVENT';
  });
  const targetEntitys = targets
    .map((target: any) => {
      return getTargetsByNode(target, item => {
        return item.data.type === 'ENTITY';
      });
    })
    .reduce((acc: any, curr: any) => {
      return [...acc, ...curr];
    }, []);

  /** 遍历上游一度节点 */
  const sources = getSourcesByNode(e.item, source => {
    return source.data.type === 'EVENT'; // 事件
  });
  const sourceEntitys = sources
    .map((source: any) => {
      return getSourcesByNode(source, item => {
        return item.data.type === 'ENTITY'; //实体
      });
    })
    .reduce((acc: any, curr: any) => {
      return [...acc, ...curr];
    }, []);

  //数组去重

  const entitys = uniqueElementsBy([...sourceEntitys, ...targetEntitys], (source, target) => {
    return source.getModel().id === target.getModel().id;
  });

  const result = [e.item, ...sources, ...targets, ...entitys];
  console.log(
    result.map(n => {
      return n.getModel().data.name;
    }),
    entitys.map((n: any) => {
      return n.getModel().data.name;
    }),
  );
  const highlightIds = result.map(n => {
    return n.getModel().id;
  });
  highlightNodeById(graph)(highlightIds);
};

const ClickEntity = () => {
  const { graph } = React.useContext(GIContext);
  React.useEffect(() => {
    const handleClick = (e: any) => {
      if (e.item.getModel().data.type !== 'EVENT') {
        handleClickEntity(graph, e);
        return;
      }
    };

    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, [graph]);
  return null;
};

export default ClickEntity;
