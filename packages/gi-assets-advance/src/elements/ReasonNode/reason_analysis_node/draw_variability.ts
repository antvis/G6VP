// import { IGroup } from '@antv/g6';
import { ITreeData } from './interface';
import { getFanPath, getClientRelativPoint } from './util';
import { Tooltip, ISimpleKVTooltipData, getSimpleKVContent } from './tooltip';

// variability 变异度
export default function drawVariability(group: any, data: ITreeData) {
  const bk_color = '#aaaaaa';
  const bk_startAngle = -Math.PI / 2;
  const bk_endAngle = Math.PI / 2;
  const data_startAngle = -Math.PI / 2;
  const bar_width_offset = 3;

  const { property = { variability: 0 }, attrShowingCfg = {} } = data;
  const { variability = 0 } = property;

  // 显示属性
  const { degreeState = {} } = attrShowingCfg as any;
  if (!degreeState.show_group || !degreeState.show_variability) return; // 如果show_group是false就不用绘制了
  // 数值过滤
  // 过滤掉不在范围的
  // if (
  //   variability * 100 < degreeState.range_variability[0] ||
  //   variability * 100 > degreeState.range_variability[1]
  // )
  //   return;

  // 第一个蓝条
  const r = 28;
  const data_endAngle = data_startAngle + Math.PI * variability;

  group.addShape('path', {
    attrs: {
      path: getFanPath({
        cx: 0,
        cy: 0,
        rs: r - 1, // 内圆半径
        re: r, // 外圆半径
        startAngle: bk_startAngle,
        endAngle: bk_endAngle,
      }),
      fill: bk_color,
    },
    name: 'path-shape',
  });

  const fan = group.addShape('path', {
    attrs: {
      path: getFanPath({
        cx: 0,
        cy: 0,
        rs: r - bar_width_offset, // 内圆半径
        re: r + bar_width_offset, // 外圆半径
        startAngle: data_startAngle,
        endAngle: data_endAngle,
      }),
      fill: '#C84D32',
      cursor: 'pointer',
      // stroke: '#C84D32',
    },
    name: 'path-shape',
  });

  const tooltipData: ISimpleKVTooltipData = {
    key: '变异度',
    value: `${variability}`,
    inicatorColor: '#E8684A',
  };

  // 添加tooltip
  fan.on('mouseenter', (e: any) => {
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
        getSimpleKVContent(toAppendDoms, tooltipData);
      })
      ?.show(x, y);
  });

  fan.on('mouseleave', () => {
    const tooltip = Tooltip.getInstance();
    tooltip?.hide();
  });
}
