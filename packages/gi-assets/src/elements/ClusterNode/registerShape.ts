import { isEmpty } from 'lodash';

type NodeConfig = any;
const getPaletteByColor = (colorType: string) => {
  return ['red', 'blue', 'green', 'yellow', 'lightgreen', '#ddd', 'red', 'blue', 'orange'];
};
/**
 *
 * @param color
 * @returns
 */

const removeHash = hex => (hex.charAt(0) === '#' ? hex.slice(1) : hex);

const parseHex = nakedHex => {
  const isShort = nakedHex.length === 3 || nakedHex.length === 4;

  const twoDigitHexR = isShort ? `${nakedHex.slice(0, 1)}${nakedHex.slice(0, 1)}` : nakedHex.slice(0, 2);
  const twoDigitHexG = isShort ? `${nakedHex.slice(1, 2)}${nakedHex.slice(1, 2)}` : nakedHex.slice(2, 4);
  const twoDigitHexB = isShort ? `${nakedHex.slice(2, 3)}${nakedHex.slice(2, 3)}` : nakedHex.slice(4, 6);
  const twoDigitHexA = (isShort ? `${nakedHex.slice(3, 4)}${nakedHex.slice(3, 4)}` : nakedHex.slice(6, 8)) || 'ff';

  // const numericA = +((parseInt(a, 16) / 255).toFixed(2));

  return {
    r: twoDigitHexR,
    g: twoDigitHexG,
    b: twoDigitHexB,
    a: twoDigitHexA,
  };
};

const hexToDecimal = hex => parseInt(hex, 16);

const hexesToDecimals = ({ r, g, b, a }) => ({
  r: hexToDecimal(r),
  g: hexToDecimal(g),
  b: hexToDecimal(b),
  a: +(hexToDecimal(a) / 255).toFixed(2),
});

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n); // eslint-disable-line no-restricted-globals, max-len

const formatRgb = (decimalObject, parameterA) => {
  const { r, g, b, a: parsedA } = decimalObject;
  const a = isNumeric(parameterA) ? parameterA : parsedA;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/**
 * Turns an old-fashioned css hex color value into a rgb color value.
 *
 * If you specify an alpha value, you'll get a rgba() value instead.
 *
 * @param The hex value to convert. ('123456'. '#123456', ''123', '#123')
 * @param An alpha value to apply. (optional) ('0.5', '0.25')
 * @return An rgb or rgba value. ('rgb(11, 22, 33)'. 'rgba(11, 22, 33, 0.5)')
 */
const hexToRgba = (hex, a) => {
  const hashlessHex = removeHash(hex);
  const hexObject = parseHex(hashlessHex);
  const decimalObject = hexesToDecimals(hexObject);

  return formatRgb(decimalObject, a);
};

const darkOpacity: number = 0.15;

export const getDarkColor = (color: string) => hexToRgba(color, darkOpacity);

export const getDarkStyle = shapes => {
  const dark = {};
  const needDarkKey = ['fill', 'stroke'];
  shapes.forEach(shape => {
    const styles = {};
    const shapeStyles = shape.get('attrs') || {};
    const shapeName = shape.get('name');
    needDarkKey.forEach(darkKey => {
      styles[darkKey] = shapeStyles[darkKey] && getDarkColor(shapeStyles[darkKey]);
    });
    dark[shapeName] = styles;
  });
  dark['labelShape'] = {
    fill: 'rgba(0, 0, 0, 0.3)',
  };
  return dark;
};

export const getLabelPosition = (r: number, position: string = 'bottom') => {
  let textAlign: 'center';
  let textBaseline: 'middle' | 'bottom' | 'top';
  let textY: number;

  switch (position) {
    case 'center':
      textAlign = 'center';
      textBaseline = 'middle';
      textY = 0;
      break;
    case 'top':
      textAlign = 'center';
      textBaseline = 'bottom';
      textY = -r - 6;
      break;
    case 'bottom':
    default:
      textAlign = 'center';
      textBaseline = 'top';
      textY = r + 6;
      break;
  }
  return {
    textAlign,
    textBaseline,
    textY,
  };
};

// 获取label shape
export const getLabelStyle = config => {
  const {
    r = 12,
    position = 'bottom',
    fontSize = 12,
    label = '',
    fill = '#262626',
    fontWeight = 'lighter',
    fontFamily = 'Microsoft YaHei',
  } = config;
  const { textAlign, textBaseline, textY } = getLabelPosition(r, position);
  return {
    fill,
    text: label,
    fontSize,
    fontWeight,
    fontFamily,
    textAlign,
    textBaseline,
    y: textY,
    x: 0,
    cursor: 'pointer',
  };
};

export enum ITEM_STATE {
  Active = 'active',
  Default = 'default',
  Selected = 'selected',
  Disable = 'disable',
  Highlight = 'highlight',
  Inactive = 'inactive',
}

const registerShape = Graphin => {
  const getCircle = circle => {
    return Array.from({ length: 7 }).map((pos, i) => ({
      id: `circle-${i + 1}`,
      y: i === 6 ? 0 : Math.cos((60 * i * Math.PI * 2) / 360) * 2 * (circle.spacing + circle.borderWidth),
      x: i === 6 ? 0 : Math.sin((60 * i * Math.PI * 2) / 360) * 2 * (circle.spacing + circle.borderWidth),
      r: circle.r,
      stroke: circle.stroke || circle.fill,
      fill: circle.fill,
      cursor: 'pointer',
      lineWidth: circle.lineWidth,
      lineDash: circle.lineDash,
    }));
  };

  const getCircleBorder = (circle, state, colors) => {
    return Array.from({ length: 7 }).map((pos, i) => ({
      id: `border-${i + 1}`,
      y: i === 6 ? 0 : Math.cos((60 * i * Math.PI * 2) / 360) * 2 * (circle.spacing + circle.borderWidth),
      x: i === 6 ? 0 : Math.sin((60 * i * Math.PI * 2) / 360) * 2 * (circle.spacing + circle.borderWidth),
      r: circle.r + circle.borderWidth,
      fill: state === ITEM_STATE.Selected && colors[3],
      cursor: 'pointer',
    }));
  };

  const getCircleStateStyle = (colors, state) => {
    const circlrStateStyle = {
      [ITEM_STATE.Default]: {
        r: 4,
        lineWidth: 1,
        borderWidth: 0,
        spacing: 4,
        stroke: colors[3],
        fill: colors[8],
      },
      [ITEM_STATE.Selected]: {
        r: 4,
        lineWidth: 1,
        spacing: 5,
        borderWidth: 2,
        stroke: '#fff',
        fill: '#fff',
      },
      [ITEM_STATE.Active]: {
        stroke: colors[3],
        fill: colors[8],
        lineWidth: 1,
        r: 4,
        spacing: 6,
        borderWidth: 0,
      },
    };
    return circlrStateStyle[state];
  };
  const getCircleStyles = (colors, state) => {
    const circlrStyle = getCircleStateStyle(colors, state);
    let circleMap = {};
    let borderMap = {};
    if (circlrStyle) {
      circleMap = getCircle(circlrStyle).reduce(
        (circle, nextCricle) => ({
          ...circle,
          [nextCricle.id]: nextCricle,
        }),
        {},
      );

      borderMap = getCircleBorder(circlrStyle, state, colors).reduce(
        (circle, nextCricle) => ({
          ...circle,
          [nextCricle.id]: nextCricle,
        }),
        {},
      );
    }
    return {
      circleMap,
      borderMap,
    };
  };

  Graphin.registerNode('cluster-node', {
    draw(model: NodeConfig, group) {
      const { label, custom: { colorType = '' } = {} } = model;
      const colors = getPaletteByColor(colorType);
      const circlrStyle = getCircleStateStyle(colors, ITEM_STATE.Default);
      const keyShape = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          fill: '#fff',
          r: 3 * (circlrStyle?.spacing + circlrStyle?.borderWidth),
        },
        name: 'keyShape',
      });
      group.addShape('text', {
        attrs: {
          ...getLabelStyle({
            label,
            r: 3 * (circlrStyle?.spacing + circlrStyle?.borderWidth),
          }),
        },
        name: 'name',
        draggable: true,
      });

      const { circleMap, borderMap } = getCircleStyles(colors, ITEM_STATE.Default);
      Object.keys(borderMap).forEach(key => {
        const border = circleMap[key];
        group.addShape('circle', {
          attrs: border,
          name: key,
          draggable: true,
        });
      });

      Object.keys(circleMap).forEach(key => {
        const circle = circleMap[key];
        group.addShape('circle', {
          attrs: circle,
          name: key,
          draggable: true,
        });
      });
      return keyShape;
    },

    setState(name, value, node) {
      const model = node.getModel();
      //@ts-ignore
      const { custom: { virtual } = {} } = model;
      if (virtual) {
        return;
      }
      const states = node.getStates();
      if (states?.length) {
        const state = states[states.length - 1];
        const { custom: { colorType = '' } = {} } = model;
        const colors = getPaletteByColor(colorType);
        const shapes = node.getContainer()?.get('children');
        // inactive态全量置灰
        if (state === ITEM_STATE.Inactive) {
          const style = getDarkStyle(shapes);
          shapes.forEach(shape => {
            const shapeName = shape.get('name');
            if (!isEmpty(style)) {
              shape.attr(style[shapeName]);
            }
          });
          return;
        }

        const circlrStyle = getCircleStateStyle(colors, state);
        const keyShape = shapes.find(shape => shape.get('name') === 'keyShape');
        keyShape.attr({
          r: 3 * (circlrStyle?.spacing + circlrStyle?.borderWidth),
        });

        const nameShape = shapes.find(shape => shape.get('name') === 'name');
        nameShape.attr({
          r: 3 * (circlrStyle?.spacing + circlrStyle?.borderWidth),
        });

        const { circleMap, borderMap } = getCircleStyles(colors, state);
        if (!isEmpty(borderMap)) {
          Object.keys(borderMap).forEach(key => {
            const border = borderMap[key];
            const currentShape = shapes.find(shape => shape.get('name') === border.id);
            currentShape.attr(border);
          });
        }
        if (!isEmpty(circleMap)) {
          Object.keys(circleMap).forEach(key => {
            const circle = circleMap[key];
            const currentShape = shapes.find(shape => shape.get('name') === circle.id);
            currentShape.attr(circle);
          });
        }
      }
    },
  });
};
export default registerShape;
