import { IGroup } from '@antv/g6';
import { ITreeData } from './interface';
import { getValueInRange_linear, getClientRelativPoint } from './util';
import { Tooltip, ISimpleKVTooltipData, getSimpleKVContent } from './tooltip';

const Cfg = {
  Radius_Min: 25,
  Radius_Max: 55,
};

// 得到key shape
export default function drawContribution(group: IGroup, data: ITreeData) {

  console.log('drawContribution', data);
  const {
    contributionRange = { min: 0, max: 0 },
    property = { contribution: 0 },
    attrShowingCfg = {},
  } = data;
  // 显示属性
  const { degreeState = {} } = attrShowingCfg as any;

  let { min, max } = contributionRange;
  const { contribution } = property;

  min = min ?? 0;
  max = max ?? 1;

  // 控制显示
  if (!degreeState.show_group || !degreeState.show_contribution) return; // 如果show_group是false就不用绘制了
  // 数值过滤
  // 过滤掉不在范围的
  // if (
  //   contribution < degreeState.range_contribute[0] ||
  //   contribution > degreeState.range_contribute[1]
  // )
  //   return;

  const valueSpace = {
    min,
    max,
    current: contribution,
  };
  const mappingSpace = {
    min: Cfg.Radius_Min,
    max: Cfg.Radius_Max,
  };

  const radius = getValueInRange_linear(valueSpace, mappingSpace);

  const shape = group?.addShape('circle', {
    attrs: {
      x: 0,
      y: 0,
      r: radius,
      fill: `l(90) 0:#1890ff00  0.8:#1890ffcc 1:#1890ff`,
      stroke: '#3D76DD',
      cursor: 'pointer',
    },
    name: 'contribution-shape',
  });

  const tooltipData: ISimpleKVTooltipData = {
    key: '贡献度',
    value: `${contribution}`,
    inicatorColor: '#3D76DD',
  };

  // 添加tooltip
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
        getSimpleKVContent(toAppendDoms, tooltipData);
      })
      ?.show(x, y);
  });

  shape.on('mouseleave', () => {
    const tooltip = Tooltip.getInstance();
    tooltip?.hide();
  });
}
