// import { IGroup } from '@antv/g6';
import { ITreeData } from './interface';
import { getClientRelativPoint } from './util';
import { Tooltip, ISimpleKVTooltipData, getSimpleKVContent } from './tooltip';

// 业务可干预
export default function drawRunningState(group: any, data: ITreeData) {
  const { property = { canBeInterupt: true, runningState: 'running' }, attrShowingCfg } = data;

  const { canBeInterupt, runningState } = property;

  // 过滤掉不符合条件的
  if (
    !attrShowingCfg?.runningState?.show_group ||
    (!attrShowingCfg?.runningState?.show_rnning && runningState === 'running') ||
    (!attrShowingCfg?.runningState?.show_finished && runningState === 'finished')
  )
    return;

  const color = runningState === 'running' ? 'rgb(215, 161, 0)' : 'rgb(0, 138, 93)';

  const shape = group?.addShape('circle', {
    attrs: {
      x: 0,
      y: 0,
      r: 12,
      stroke: color,
      fill: color,
      lineWidth: 1.5,
      cursor: 'pointer',
      // ...fillProps,
    },
  });

  const key = runningState === 'running' ? '运行中，' : '已完成，';
  const value = canBeInterupt ? '业务可干预' : '业务不可干预';
  const tooltipData: ISimpleKVTooltipData = {
    key,
    value,
    inicatorColor: color,
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
