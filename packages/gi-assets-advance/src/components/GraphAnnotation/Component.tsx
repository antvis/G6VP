import G6 from '@antv/g6';
import { useContext } from '@antv/gi-sdk';
import { Menu } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useMemo } from 'react';
import './index.less';

export interface GraphAnnotationProps {
  contextmenu: any;
}

const GraphAnnotation: React.FunctionComponent<GraphAnnotationProps> = props => {
  const { contextmenu } = props;
  const { graph } = useContext();
  const { item: targetItem, x, y } = contextmenu; // target 为 null 可能是 canvas
  if (targetItem && targetItem.destroyed) {
    return null;
  }
  const itemType = targetItem?.getType?.() || 'canvas';
  const menuItemName = {
    node: '节点',
    edge: '边',
    combo: '节点分组',
    canvas: '画布',
  };

  const annotationPlugin = useMemo(() => {
    const existAnnotation = graph
      .get('plugins')
      .filter(plugin => plugin.get('pluginType') === 'gi-graph-annoation-component')[0];
    if (existAnnotation) return existAnnotation;
    const newAnnotation = new G6.Annotation({
      // @ts-ignore
      pluginType: 'gi-graph-annoation-component',
      trigger: 'fix',
      cardCfg: {
        borderRadius: 2,
        maxTitleLength: 25,
        maxWidth: 250,
        minWidth: 150,
        collapseType: 'hide',
        closeType: 'remove',
        defaultBegin: { right: 32, top: 100 },
        // TODO: 收起/展开、关闭 icon 的 tooltip 由 G6 支持
        // onMouseEnterIcon: showIconTooltip,
        // onMouseLeaveIcon: hideIconTooltip,
        // onClickIcon: hideIconTooltip,
      },
      getTitle: item => {
        const type = item.getType?.() || 'canvas';
        return menuItemName[type];
      },
      getContent: (item => undefined) as any,
      getContentPlaceholder: item => '双击此处开始编辑',
    });
    graph.addPlugin(newAnnotation);
    return newAnnotation;
  }, []);

  const showAnnotation = () => {
    const item = targetItem || graph.get('canvas');
    const isCanvas = item?.isCanvas?.();
    if (isCanvas) {
      annotationPlugin.toggleAnnotation(item, { x, y });
    } else {
      annotationPlugin.showAnnotation({ item });
    }
    contextmenu.onClose();
  };

  useEffect(() => {
    if (!annotationPlugin || annotationPlugin.destroyed) return;
    insertCss(`
      .g6-annotation-wrapper {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      }
      .g6-annotation-header-wapper {
        background-color: #fff;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      }
    `);
  }, []);
  return (
    <>
      <Menu.Item key="graph-annotation" eventKey="graph-annotation" onClick={showAnnotation}>
        {`标注${menuItemName[itemType]}`}
      </Menu.Item>
    </>
  );
};

export default GraphAnnotation;
