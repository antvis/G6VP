import { StarFilled } from '@ant-design/icons';
import G6, { Item } from '@antv/g6';
import { useContext } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import { Menu } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useMemo, useState } from 'react';
import './index.less';

const icons = Graphin.registerFontFamily(iconLoader);

export interface GraphAnnotationProps {
  contextmenu: any;
  annotationWay: string;
}

const tagColors = [
  {
    key: 'red',
    label: '红色',
    hex: '#ff4d4f',
  },
  {
    key: 'green',
    label: '绿色',
    hex: '#389e0d',
  },
  {
    key: 'blue',
    label: '蓝色',
    hex: '#1890ff',
  },
  {
    key: 'yellow',
    label: '黄色',
    hex: '#ffc53d',
  },
  {
    key: 'black',
    label: '黑色',
    hex: '#000',
  },
];

const cancelColor = {
  key: 'cancel',
  label: '取消',
  hex: '#ccc',
};

const BADGE_CLASSNAME = 'gi-graph-annotation';

const GraphAnnotation: React.FunctionComponent<GraphAnnotationProps> = props => {
  const { contextmenu, annotationWay } = props;
  const { graph } = useContext();
  const { item: menuTargetItem, x, y } = contextmenu; // target 为 null 可能是 canvas
  if (menuTargetItem && menuTargetItem.destroyed) {
    return null;
  }
  const itemType = menuTargetItem?.getType?.() || 'canvas';
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
      onAnnotationChange: () => {},
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

  const handleAnnotate = color => {
    switch (annotationWay) {
      case 'tag':
        showAnnotation();
        tag(color);
        break;
      case 'click':
        tag(color);
        break;
      case 'annotateOnly':
        showAnnotation();
        break;
      case 'tagOnly':
      default:
        tag(color);
        break;
    }
    contextmenu.onClose();
  };

  const showAnnotation = (propsItem?: Item) => {
    const item = propsItem || menuTargetItem || graph.get('canvas');
    const isCanvas = item?.isCanvas?.();
    if (isCanvas) {
      annotationPlugin.toggleAnnotation(item, { x, y });
    } else {
      annotationPlugin.showAnnotation({ item });
    }
  };

  const tag = color => {
    if (!menuTargetItem) return;
    const itemModel = menuTargetItem.getModel();
    const badges = [...(itemModel.style?.badges || [])];
    const currentTag = badges.find(badge => badge.classname === BADGE_CLASSNAME);
    if (currentTag) {
      const idx = badges.indexOf(currentTag);
      badges.splice(idx, 1);
    }
    if (color.key !== 'cancel') {
      badges.push({
        position: 'RB',
        fontFamily: 'graphin',
        type: 'font',
        value: icons['star-fill'],
        size: [15, 15],
        color: color.hex,
        fill: '#fff',
        stroke: color.hex,
        classname: BADGE_CLASSNAME,
      });
    } else {
      annotationPlugin.removeCard(itemModel.id);
    }
    // update style
    graph.updateItem(menuTargetItem, {
      pinned: true,
      style: {
        badges,
      },
    });
  };

  const handleClickBadge = evt => {
    const { target, item } = evt;
    if (target.get('name') === 'badges-circle') {
      const hasTag = item?.getModel().style?.badges?.find(badge => badge.classname === BADGE_CLASSNAME);
      if (!hasTag) return;
      showAnnotation(item);
    }
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

  useEffect(() => {
    if (annotationWay === 'click') {
      graph.on('node:click', handleClickBadge);
    }
    return () => {
      graph.off('node:click', handleClickBadge);
    };
  }, [annotationWay]);

  const menuItem = useMemo(() => {
    const item = menuTargetItem || graph.get('canvas');
    if (annotationWay === 'annotateOnly' || (item?.isCanvas?.() && annotationWay !== 'tagOnly')) {
      return (
        <Menu.Item key="graph-annotation" eventKey="graph-annotation" onClick={handleAnnotate}>
          {`标注${menuItemName[itemType]}`}
        </Menu.Item>
      );
    }
    return (
      <Menu.SubMenu key="tag" title={`标记${menuItemName[itemType]}`}>
        <div className="gi-annotation-tag-color-container">
          {tagColors.map(color => (
            <div
              className="gi-annotation-tag-color"
              style={{ border: `1px solid ${color.hex}` }}
              onClick={() => handleAnnotate(color)}
            >
              <StarFilled style={{ color: color.hex, fontSize: 12, padding: '1px' }} />
            </div>
          ))}
          <div style={{ marginLeft: '8px', lineHeight: '24px' }} onClick={() => handleAnnotate(cancelColor)}>
            取消
          </div>
        </div>
      </Menu.SubMenu>
    );
  }, [annotationWay, menuTargetItem]);

  return <> {menuItem} </>;
};

export default GraphAnnotation;
