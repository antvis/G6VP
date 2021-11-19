// import { IGroup, IShape } from '@antv/g6';
import { ITreeData, IChangeItem } from './interface';
import { getFanPath, getClientRelativPoint } from './util';
import { ColorPicker, IColorPair } from './colors';
import RoseChangeMapping from './roseChangeMapping';

import { Tooltip, IKVAttrs, getContentMoreDemensions } from './tooltip';

const Cfg = {
  Radius_Min: 20,
  Radius_Max: 54,
  Start_Angle: -((Math.PI * 3) / 2),  
};
// 绘制玫瑰图
export default function drawRose(group: any, data: ITreeData) {
  if (!group) return;

  const { property = { changes: [] }, attrShowingCfg = {} } = data;

  const { changes = [] } = property;

  // 显示属性
  const { roseCompare = {} } = attrShowingCfg as any;
  // 玫瑰图先注释下，数据处理上有些问题
  return;
  if (!roseCompare.show_group) return; // 如果show_group是false就不用绘制了

  // 扇形角度
  let startAngle = Cfg.Start_Angle;
  const everyAngle = Math.PI / changes.length;
  let endAngle = startAngle + everyAngle;
  const colorPicker = new ColorPicker('reverse');

  // 为了控制绘制层次的
  const afterDrawingFuncs: Function[] = [];
  const beforeDrawingFuncs: Function[] = [];

  changes.forEach(change => {
    const colorPair = colorPicker.pickColorPair();
    const { drawAfer, drawBefore } = addFan(
      group,
      change,
      startAngle,
      endAngle,
      colorPair,
      roseCompare,
    );

    afterDrawingFuncs.push(drawAfer);
    beforeDrawingFuncs.push(drawBefore);

    startAngle += everyAngle;
    endAngle += everyAngle;
  });

  // 执行添加
  [...afterDrawingFuncs, ...beforeDrawingFuncs].forEach(func => func.call(null));
}

// 通过change的值得到绘制属性
function getDrawingValueByUnit(change: IChangeItem) {
  const beforeValue_maybe = change.beforeValue ?? 0;
  const afterValue_maybe = change.afterValue ?? 0;

  const { props, name } = change;

  // 检查下默认单位
  const { unit } = props[0] ?? {};
  const max =
    RoseChangeMapping.getInstance()
      .getMappingData()
      .get(name) ?? 1;
  const before = Math.log10(Math.abs(beforeValue_maybe / (max === 0 ? 1 : max))) || 0;
  const after = Math.log10(Math.abs(afterValue_maybe / (max === 0 ? 1 : max)));

  console.log('before after',before,beforeValue_maybe, after, afterValue_maybe)
  return {
    beforeValue: Number(Number(before).toFixed(2)),
    afterValue: Number(Number(after).toFixed(2)),
  };
}

// 添加一个
function addFan(
  group: any,
  change: IChangeItem,
  startAngle: number,
  endAngle: number,
  colorPair: IColorPair,
  roseCompare: any, // 显示配置
) {
  // value都先按照‘率’处理
  // const { beforeValue = 0, afterValue = 0 } = change;
  // const beforeValue_maybe = change.beforeValue ?? 0;
  // const afterValue_maybe = change.afterValue ?? 0;

  // const { props } = change;

  const { beforeValue, afterValue } = getDrawingValueByUnit(change);

  let dashCfg = {};
  if (beforeValue < afterValue) {
    dashCfg = {
      lineDash: [2, 2],
    };
  }

  const { primary, secondary } = colorPair;
  // after
  const drawAfer = roseCompare.show_contrast
    ? () => {
        const shape = group.addShape('path', {
          attrs: {
            path: getFanPath({
              cx: 0,
              cy: 0,
              rs: 0, // 内圆半径
              re: Cfg.Radius_Max * Math.abs(afterValue) + Cfg.Radius_Min, // 外圆半径
              startAngle,
              endAngle,
            }),
            fill: primary,
            stroke: primary,
            cursor: 'pointer',
          },
          name: 'path-shape',
        });
        addInteraction(shape, change, colorPair);
      }
    : () => {};

  let drawBefore = () => {};
  if (
    (afterValue >= beforeValue && roseCompare.show_experiment_increcement) ||
    (afterValue <= beforeValue && roseCompare.show_experiment_reduce)
  ) {
    drawBefore = () => {
      group.addShape('path', {
        attrs: {
          path: getFanPath({
            cx: 0,
            cy: 0,
            rs: 0, // 内圆半径
            re: Cfg.Radius_Max * beforeValue, // 外圆半径
            startAngle,
            endAngle,
            cursor: 'pointer',
          }),
          stroke: secondary,
          ...dashCfg,
        },
        name: secondary,
      });
    };
  }

  return { drawAfer, drawBefore };
}

// getToolTipDatasByProps
function getToolTipDatas(change: IChangeItem, mainColorPair: IColorPair) {
  const { props, beforeValue } = change;
  const mainDatas: any = { title: '', colorPair: mainColorPair, attrs: [] };

  const otherDatas: Array<IKVAttrs> = [];

  const colorPair = new ColorPicker();

  props.forEach((propItem, index) => {
    let { name, unit, value } = propItem;
    let unitValue = `${value}${unit}`;

    if (value) {
      if (Math.abs(value) < 10000) {
        unitValue = unit === '%' ? value * 100 + unit : `${value}${unit}`;
      } else {
        if (Math.abs(value) >= 10000) {
          unitValue = `${Math.round(value / 10000)}万${unit}`;
        }
        if (Math.abs(value) >= 100000000) {
          unitValue = `${Math.round(value / 100000000)}亿${unit}`;
        }
      }
    }


    if (index === 0) {
      // 如果是0，就构造 main datas
      mainDatas.title = name;
      const before = beforeValue ?? 0;
      const bValue = (before / 100).toFixed(2) + '%';
      mainDatas.attrs = [
        {
          key: '先前值',
          value: before === 0 ? '0' : bValue,
          color: mainColorPair.primary,
          needIcon: true,
        },
        {
          key: '变化后',
          value: value,
          color: mainColorPair.secondary,
          isCurrent: true,
          needIcon: true,
        },
      ];
    } else {
      const { primary } = colorPair.pickColorPair();
      otherDatas.push({
        key: name,
        value: value + unit,
        inicatorColor: primary,
      });
    }


    // 临时逻辑
    // const { primary } = mainColorPair;
    // otherDatas.push({
    //   key: name,
    //   value: unitValue,
    //   inicatorColor: primary,
    // });
  });

  return { mainDatas, otherDatas };
}

// 增加交互行为
function addInteraction(shape: any, change: IChangeItem, colorPair: IColorPair) {
  const { mainDatas, otherDatas } = getToolTipDatas(change, colorPair);

  shape.on('mouseenter', (e: any) => {
    // 视口位置
    const { clientX, clientY } = e;
    // 偏移
    const offSet = 20;
    // 容器中相对位置
    const { x, y } = getClientRelativPoint(clientX + offSet, clientY + offSet);

    // tooltip
    const tooltip = Tooltip.getInstance();
    tooltip
      ?.buildContent(toAppendDoms => {
        // 构造tooltip的展示内容
        // 数据格式按照，IShowingCommonData
        // makeTooltipContent(toAppendDoms, { title: name, colorPair, attrs: showingTooltipAttrs });
        getContentMoreDemensions(toAppendDoms, mainDatas, otherDatas);
      })
      ?.show(x, y);
  });
  shape.on('mouseleave', () => {
    const tooltip = Tooltip.getInstance();
    tooltip?.hide();
  });
}

// 构造tooltip的展示内容
// function makeTooltipContent(toAppendDoms: HTMLElement[], data: IShowingCommonData) {
//   getCommonContent(toAppendDoms, data);
// }
