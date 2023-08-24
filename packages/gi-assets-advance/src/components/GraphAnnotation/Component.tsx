import { StarFilled } from '@ant-design/icons';
import G6, { Item } from '@antv/g6';
import { icons, useContext } from '@antv/gi-sdk';
import { Menu } from 'antd';
import insertCss from 'insert-css';
import React, { memo, useEffect, useMemo } from 'react';
import { bind } from 'size-sensor';
import $i18n from '../../i18n';
import './index.less';

export interface GraphAnnotationProps {
  contextmenu: any;
  annotationWay: string;
  defaultTitleField?: string;
  defaultContentFields?: string[];
}

const tagColors = [
  {
    key: 'red',
    label: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Red', dm: '红色' }),
    hex: '#ff4d4f',
  },
  {
    key: 'green',
    label: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Green', dm: '绿色' }),
    hex: '#389e0d',
  },
  {
    key: 'blue',
    label: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Blue', dm: '蓝色' }),
    hex: '#1890ff',
  },
  {
    key: 'yellow',
    label: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Yellow', dm: '黄色' }),
    hex: '#ffc53d',
  },
  {
    key: 'black',
    label: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Black', dm: '黑色' }),
    hex: '#000',
  },
];

const cancelColor = {
  key: 'cancel',
  label: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Cancel', dm: '取消' }),
  hex: '#ccc',
};

const BADGE_CLASSNAME = 'gi-graph-annotation';
let unbindSizeSensor;

const GraphAnnotation: React.FunctionComponent<GraphAnnotationProps> = props => {
  const { contextmenu, annotationWay, defaultTitleField, defaultContentFields } = props;
  const { graph, GISDK_ID } = useContext();
  const { item: menuTargetItem, x, y } = contextmenu; // target 为 null 可能是 canvas
  if (menuTargetItem && menuTargetItem.destroyed) {
    return null;
  }
  const itemType = menuTargetItem?.getType?.() || 'canvas';
  const menuItemName = {
    node: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Node', dm: '节点' }),
    edge: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Edge', dm: '边' }),
    combo: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.NodeGrouping', dm: '节点分组' }),
    canvas: $i18n.get({ id: 'advance.components.GraphAnnotation.Component.Canvas', dm: '画布' }),
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
        if (defaultTitleField) return item.getModel()[defaultTitleField];
        const type = item.getType?.() || 'canvas';
        return menuItemName[type];
      },
      getContent: (item => {
        if (defaultContentFields) {
          const model = item.getModel();
          return defaultContentFields
            .map(field => (model.hasOwnProperty(field) ? `${field}: ${model[field]}` : undefined))
            .filter(Boolean)
            .join('\n\r');
        }
        return undefined;
      }) as any,
      getContentPlaceholder: item =>
        $i18n.get({
          id: 'advance.components.GraphAnnotation.Component.DoubleClickHereToStart',
          dm: '双击此处开始编辑',
        }),
    });
    // @ts-ignore
    graph.addPlugin(newAnnotation);
    return newAnnotation;
  }, []);

  useEffect(() => {
    if (!annotationPlugin) {
      unbindSizeSensor?.();
      unbindSizeSensor = undefined;
      return;
    }
    const container = document.getElementById(`${GISDK_ID}-graphin-container`);
    unbindSizeSensor = bind(container, element => {
      const annotationCanvas = annotationPlugin.get('canvas');
      const annotationLinkCanvas = annotationPlugin.get('linkCanvas');
      if (element) {
        const { clientHeight, clientWidth } = element;
        if (annotationCanvas) annotationCanvas.changeSize(clientWidth, clientHeight);
        if (annotationLinkCanvas) annotationLinkCanvas.changeSize(clientWidth, clientHeight);
      }
    });
  }, [annotationPlugin]);

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
    const { badges: styleBadges = [], keyshape } = itemModel.style || {};
    const size = Math.max(Math.round(keyshape.size / 2) || 15, 15);
    const badges = [...styleBadges];
    const currentTag = badges.find(badge => badge.classname === BADGE_CLASSNAME);
    if (currentTag) {
      const idx = badges.indexOf(currentTag);
      badges.splice(idx, 1);
    }
    if (color.key !== 'cancel') {
      badges.push({
        position: 'RB',
        fontFamily: 'iconfont',
        type: 'font',
        value: icons['star-fill'],
        size,
        fontSize: size - 2,
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
    if (!annotationPlugin || annotationPlugin.destroyed) {
      unbindSizeSensor?.();
      unbindSizeSensor = undefined;
      return;
    }
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
          {$i18n.get(
            {
              id: 'advance.components.GraphAnnotation.Component.LabelMenuitemnameitemtype',
              dm: '标注{menuItemNameItemType}',
            },
            { menuItemNameItemType: menuItemName[itemType] },
          )}
        </Menu.Item>
      );
    }
    return (
      <Menu.SubMenu
        key="tag"
        title={$i18n.get(
          {
            id: 'advance.components.GraphAnnotation.Component.MarkMenuitemnameitemtype',
            dm: '标记{menuItemNameItemType}',
          },
          { menuItemNameItemType: menuItemName[itemType] },
        )}
      >
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
            {$i18n.get({ id: 'advance.components.GraphAnnotation.Component.Cancel', dm: '取消' })}
          </div>
        </div>
      </Menu.SubMenu>
    );
  }, [annotationWay, menuTargetItem]);

  return <> {menuItem} </>;
};

export default memo(GraphAnnotation);
