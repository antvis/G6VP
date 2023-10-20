//@ts-nocheck
import G6 from '@antv/g6';

/**
 * 检查节点中是否有已参数化、未配置的参数
 * @param model 节点数据
 * @returns
 */
const hasUnconfiguredParam = model => {
  const { parameterized = {}, configured = {}, content = {}, params = {} } = model;
  const unconfigureParam = Object.keys(parameterized).find(fieldName => {
    const value = params[fieldName];
    const isPart = ((content as any).type === 'query' && fieldName === 'value') || typeof value === 'object';
    if (isPart) {
      const unconfiguredValue = parameterized[fieldName].find(
        item => !configured[`${fieldName}-${item.parameterName}`],
      );
      return unconfiguredValue;
    }
    return !configured[`${fieldName}-${fieldName}`];
  });
  return !!unconfigureParam;
};

/**
 * 绘制未配置的红点提示
 * @param model
 * @param group
 * @returns
 */
const addUnconfiguredTag = (model, group) => {
  const { size = [102, 33] } = model;
  return group.addShape('circle', {
    attrs: {
      x: size[0] / 2 - 1,
      y: -size[1] / 2 + 2,
      r: 4,
      fill: '#f5222d',
      stroke: '#fff',
      lineWidth: 1,
    },
    name: 'unconfigure-tag',
  });
};

/**
 * 绘制运行成功或失败的标志
 * @param keyShapeStyle
 * @param shapeType
 * @param group
 * @param type
 */
const addIcon = (keyShapeStyle, shapeType, group, type) => {
  const { width, r } = keyShapeStyle;
  const iconCenter = { x: shapeType === 'rect' ? width / 2 + 14 : r + 14, y: 0 };
  group
    .addShape('circle', {
      attrs: {
        ...iconCenter,
        r: 8,
        fill: type === 'success' ? '#52c41a' : '#f5222d',
        lineWidth: 0,
        opacity: 0,
      },
      name: `${type}-icon`,
    })
    .animate({ opacity: 1 }, { duration: 300 });
  group.addShape('path', {
    attrs: {
      path:
        type === 'success'
          ? [
              ['M', iconCenter.x - 4, 0],
              ['L', iconCenter.x, 3],
              ['L', iconCenter.x + 4, -2],
            ]
          : [
              ['M', iconCenter.x - 3, -3],
              ['L', iconCenter.x + 3, 3],
              ['M', iconCenter.x - 3, 3],
              ['L', iconCenter.x + 3, -3],
            ],
      stroke: '#fff',
      lineWidth: 2,
    },
    name: `${type}-content`,
  });
};

/**
 * 移除成功或失败的标志
 * @param group
 * @param type
 */
const removeIcon = (group, type) => {
  const icon = group.find(child => child.get('name') === `${type}-icon`);
  const content = group.find(child => child.get('name') === `${type}-content`);
  icon?.remove(true);
  content?.remove(true);
};

/**
 * 状态变化的样式响应
 * @param name
 * @param value
 * @param item
 * @param shapeType
 */
const setState = (name, value, item, shapeType) => {
  const group = item.getContainer();
  const keyShape = item.getKeyShape();
  const keyShapeStyle = keyShape.attr();
  const { width, r } = keyShapeStyle;
  if (name === 'running') {
    if (value) {
      if (shapeType === 'circle') {
        group.addShape('text', {
          attrs: {
            x: r + 4,
            y: 0,
            text: 'Ready',
            textAlign: 'left',
            textBaseline: 'middle',
            fontSize: 12,
            fill: '#52c41a',
          },
          name: 'running-icon',
        });
      } else {
        const matrix = G6.Util.transform(
          [1, 0, 0, 0, 1, 0, 0, 0, 1],
          [
            ['t', -(width / 2 + 14), 0],
            ['r', Math.PI + 0.9],
            ['t', width / 2 + 14, 0],
          ],
        );
        group
          .addShape('circle', {
            attrs: {
              x: width / 2 + 14,
              y: 0,
              r: 6,
              lineWidth: 2,
              fill: '#fff',
              stroke: '#52c41a',
              lineDash: [4, 16 * Math.PI],
              matrix,
            },
            name: 'running-icon',
          })
          .animate(
            {
              lineDash: [4, 0],
            },
            {
              duration: 1000,
              easing: 'easeLinear',
              repeat: true,
            },
          );
      }
    } else {
      const backShape = group.find(child => child.get('name') === 'running-icon');
      if (backShape) {
        backShape.stopAnimate();
        backShape.remove(true);
      }
    }
  }
  if (name === 'success') {
    if (value) {
      if (shapeType === 'circle') {
        group.addShape('text', {
          attrs: {
            x: r + 4,
            y: 0,
            text: 'Ready',
            textAlign: 'left',
            textBaseline: 'middle',
            fontSize: 12,
            fill: '#52c41a',
          },
          name: 'success-icon',
        });
      } else {
        addIcon(keyShapeStyle, shapeType, group, 'success');
      }
    } else {
      removeIcon(group, 'success');
    }
  } else if (name === 'configuring') {
    if (value) {
      const style = { ...keyShape.attr(), stroke: '#fff', lineWidth: 1, fillOpacity: 0 };
      keyShape.attr({
        lineWidth: 4,
        stroke: style.fill,
      });
      delete style.fill;
      group.addShape(shapeType, {
        attrs: style,
        name: 'border',
      });
      const dot = group.find(child => child.get('name') === 'unconfigure-tag');
      dot?.toFront();
    } else {
      const border = group.find(child => child.get('name') === 'border');
      if (border) border.remove(true);
      keyShape.attr({
        lineWidth: 0,
      });
    }
  } else if (name === 'error') {
    if (value) {
      addIcon(keyShapeStyle, shapeType, group, 'error');
    } else {
      removeIcon(group, 'error');
    }
  }
};

export const registerNodes = () => {
  /**
   * 历史记录节点的自定义节点
   */
  G6.registerNode(
    'gi-history-rect',
    {
      afterDraw(model, group) {
        if (model?.isConfigure && hasUnconfiguredParam(model)) addUnconfiguredTag(model, group);
      },
      afterUpdate(model, item) {
        if (!model || !item) return;
        const group = item.getContainer();
        const tag = group.find(ele => ele.get('name') === 'unconfigure-tag');
        if (model.isConfigure && hasUnconfiguredParam(model)) {
          if (!tag) addUnconfiguredTag(model, group);
        } else {
          if (tag) tag.remove();
        }
      },
      setState: (name, value, item) => setState(name, value, item, 'rect'),
    },
    'rect',
  );

  /**
   * 起点和终点的自定义节点
   */
  G6.registerNode(
    'gi-history-circle',
    {
      setState: (name, value, item) => setState(name, value, item, 'circle'),
    },
    'circle',
  );
};
