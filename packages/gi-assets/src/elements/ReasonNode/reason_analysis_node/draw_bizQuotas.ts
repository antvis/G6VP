import { isBoolean, isNumber, isString } from 'lodash';
import { ITreeData, IQuotaItem } from './interface';
import { getValueInRange_linear, getClientRelativPoint } from './util';
import BizIdentifiedMapping from './bizQuotasMapping';
import { ellipseText } from './util';
import { ColorPicker, IColorPair } from './colors';
import { Tooltip, getTextContent } from './tooltip';

// 业务指标
export default function drawBizQuotas(group: any, data: ITreeData) {

  console.log('drawBizQuotas',data);
  const { property = { quotas: [] }, attrShowingCfg = {} } = data;

  const { quotas = [] } = property;

  const base_raduis_offset = 55;
  // 指标轨道
  // 为了美观就算显示属性没有也加上轨道
  // 轨道后面用来表示业务可干预了
  // group.addShape('circle', {
  //   attrs: {
  //     x: 0,
  //     y: 0,
  //     r: base_raduis_offset,
  //     stroke: '#aaaaaa',
  //     lineDash: [4, 5],
  //   },
  // });

  // 显示属性
  const { bizQuotas = {} } = attrShowingCfg as any;
  if (!bizQuotas.show_group) return; // 如果show_group是false就不用绘制了

  const colorPicker = new ColorPicker();

  // const positions: Array<{x: number; y: number}> = [];
  // 根据显示设置过滤数据
  const filteredQuotas = quotas.filter(quota => {
    const { value, isBranchData = false } = quota;
    if ((isBoolean(value) || value === '是' || value === '否') && bizQuotas.cat_boolean)
      return true;
    if (isBranchData && bizQuotas.cat_number) return true;
    if (
      isString(value) &&
      value !== '是' &&
      value !== '否' &&
      !isBranchData &&
      bizQuotas.cat_string
    )
      return true;
    return false;
  });

  let angle = 0;
  if (filteredQuotas.length % 2 === 0) {
    // 偶数
    angle -= Math.PI / 6 / 2;
  }

  const perAngle = Math.PI / 6;

  filteredQuotas.forEach((quota, index) => {
    const colorPair = colorPicker.pickColorPair();

    const x = Math.cos(angle) * base_raduis_offset;
    const y = Math.sin(angle) * base_raduis_offset;

    drawQuotaItem(group, quota, { x, y }, colorPair, bizQuotas);

    const curAngle = angle + perAngle * (index + 1) * (index % 2 === 0 ? 1 : -1);

    angle = curAngle;
  });
}

function drawQuotaItem(
  group: any,
  quota: IQuotaItem,
  position: { x: number; y: number },
  colorPair: IColorPair,
  bizQuotas: any, // 显示的配置设置
) {
  const { value, name, isBranchData = false } = quota;
  const bizIdentifiedMap = BizIdentifiedMapping.getInstance().getMappingData();
  const identifiedArr = bizIdentifiedMap.get(name);

  if (identifiedArr) {
    // 是预设值
    addIdentifiedShape(group, value, identifiedArr, position, colorPair);
  } else if (isBoolean(value) || value === '是' || value === '否') {
    // 添加正方形
    const rect_width = 12;
    const rect1 = group.addShape('rect', {
      attrs: {
        x: -rect_width / 2,
        y: -rect_width / 2,
        width: rect_width,
        height: rect_width,
        fill: colorPair.primary,
        stroke: colorPair.secondary,
        lineWidth: 1.5,
        fillOpacity: value ? 0.8 : 0,
      },
    });

    rect1.rotate(Math.PI / 4);
    rect1.translate(position.x, position.y);
  } else if (isBranchData) {
    const radius_base = 10;
    const { min = 0, max = 0 } = quota;
    const radius = getValueInRange_linear(
      { current: value as number, min, max },
      { min: 5, max: 8 },
    );

    group.addShape('circle', {
      attrs: {
        x: position.x,
        y: position.y,
        r: radius,
        fill: colorPair.primary,
        // stroke: 'limegreen',
        fillOpacity: 0.8,
      },
    });
    group.addShape('circle', {
      attrs: {
        x: position.x,
        y: position.y,
        r: radius_base,
        stroke: colorPair.secondary,
      },
    });
  } else {
    const radius_base = 10;
    const symbol = 'triangle';
    group.addShape('marker', {
      attrs: {
        symbol,
        x: position.x,
        y: position.y,
        r: radius_base,
        fill: '#65789b',
        stroke: '#65789b',
        lineWidth: 1.5,
        fillOpacity: 0.5,
      },
    });
  }

  // 添加文字
  if (bizQuotas.show_description) addDescription(group, quota, position);
}

function addIdentifiedShape(
  group: any,
  dataValue: any,
  identifiedArr: string[],
  position: { x: number; y: number },
  colorPair: IColorPair,
) {
  const index = identifiedArr.filter(item => item !== '其他').findIndex(item => item === dataValue);
  const radius_base = 10;
  const indexRadius = [3, 5, 8, 10];

  if (index === -1 || index > indexRadius.length - 1) {
    // 其他
    group.addShape('circle', {
      attrs: {
        x: position.x,
        y: position.y,
        r: radius_base,
        stroke: colorPair.secondary,
      },
    });
    [0, -1, 1].forEach(i => {
      group.addShape('circle', {
        attrs: {
          x: position.x - i * 3,
          y: position.y,
          r: 1,
          fill: colorPair.secondary,
        },
      });
    });
    return;
  }
  group.addShape('circle', {
    attrs: {
      x: position.x,
      y: position.y,
      r: indexRadius[index],
      fill: colorPair.primary,
      // stroke: 'limegreen',
      fillOpacity: 0.8,
    },
  });
  group.addShape('circle', {
    attrs: {
      x: position.x,
      y: position.y,
      r: radius_base,
      stroke: colorPair.secondary,
    },
  });
}

// 每一个指标的说明文字
function addDescription(group: any, quota: IQuotaItem, basePostion: { x: number; y: number }) {
  const { name, value } = quota;
  const labelMargin = 16;
  const labelPosition = {
    x: basePostion.x + labelMargin,
    y: basePostion.y,
  };
  // label
  let label = name;
  const labelLengthLimit = 10; // 最大长度
  const labelLength = label.length;
  let ellipseLabel = false;
  let cursorCfg = {};
  if (labelLength > labelLengthLimit) {
    ellipseLabel = true;
    cursorCfg = { cursor: 'pointer' };
    label = ellipseText(name, labelLengthLimit);
  }

  /**
   * 下面注释是设计逻辑
   * 但是后来业务方同学要求修改
   */
  // const labelShape = group.addShape('text', {
  //   attrs: {
  //     text: label,
  //     x: labelPosition.x,
  //     y: labelPosition.y,
  //     fill: '#FFFFFF',
  //     textBaseline: 'middle',
  //     opacity: 0.65,
  //     ...cursorCfg,
  //   },
  // });

  // // value
  // const valueMargin = 152;
  // const valuePosition = {
  //   x: basePostion.x + valueMargin,
  //   y: basePostion.y,
  // };
  // let valueStr = value;
  // if (isBoolean(value)) {
  //   valueStr = value ? '是' : '否';
  // }

  // group.addShape('text', {
  //   attrs: {
  //     text: valueStr,
  //     x: valuePosition.x,
  //     y: valuePosition.y,
  //     fill: '#FFFFFF',
  //     textBaseline: 'middle',
  //     opacity: 0.85,
  //   },
  // });
  // // 如果 ellipseLabel
  // // 显示 tooltip
  // if (ellipseLabel) {
  //   labelShape.on('mouseenter', (e: any) => {
  //     // 视口位置
  //     const { clientX, clientY } = e;
  //     // 偏移
  //     const offSet = 20;
  //     // 容器中相对位置
  //     const { x, y } = getClientRelativPoint(clientX + offSet, clientY + offSet);
  //     const tooltip = Tooltip.getInstance();
  //     tooltip
  //       ?.buildContent(toAppendDoms => {
  //         // 构造tooltip的展示内容
  //         getTextContent(toAppendDoms, name);
  //       })
  //       ?.show(x, y);
  //   });

  //   labelShape.on('mouseleave', () => {
  //     const tooltip = Tooltip.getInstance();
  //     tooltip?.hide();
  //   });
  // }

  /**
   * 业务方要求修改的非设计逻辑
   */
  let valueStr = value;
  if (isBoolean(value)) {
    valueStr = value ? '是' : '否';
  }
  const showText = `${label}:  ${valueStr}`;
  const fullText = `${name}:  ${valueStr}`;
  const labelShape = group.addShape('text', {
    attrs: {
      text: valueStr ? showText : label,
      x: labelPosition.x,
      y: labelPosition.y,
      fill: '#FFFFFF',
      textBaseline: 'middle',
      opacity: 0.85,
      ...cursorCfg,
    },
  });

  // 如果 ellipseLabel
  // 显示 tooltip
  if (ellipseLabel) {
    labelShape.on('mouseenter', (e: any) => {
      // 视口位置
      const { clientX, clientY } = e;
      // 偏移
      const offSet = 20;
      // 容器中相对位置
      const { x, y } = getClientRelativPoint(clientX + offSet, clientY + offSet);
      const tooltip = Tooltip.getInstance();
      tooltip
        ?.buildContent(toAppendDoms => {
          // 构造tooltip的展示内容
          getTextContent(toAppendDoms, fullText);
        })
        ?.show(x, y);
    });

    labelShape.on('mouseleave', () => {
      const tooltip = Tooltip.getInstance();
      tooltip?.hide();
    });
  }
}
