import { ITreeData } from './interface';

// 业务可干预
export default function drawBizIntervene(group: any, data: ITreeData) {
  const { property = { canBeInterupt: true, runningState: 'running' }} = data;

  const { canBeInterupt } = property;

  // 过滤掉不符合条件的
  // if (
  //   !attrShowingCfg?.bizIntervene?.show_group ||
  //   (!attrShowingCfg?.bizIntervene?.show_canbe_interupted && canBeInterupt) ||
  //   (!attrShowingCfg?.bizIntervene?.show_notbe_interupted && !canBeInterupt)
  // )
  //   return;

  const base_raduis_offset = 55;
  // 轨道

  // 表示业务可干预
  if (canBeInterupt) {
    group.addShape('circle', {
      attrs: {
        x: 0,
        y: 0,
        r: base_raduis_offset,
        stroke: '#aaaaaa',
        fill: '#777777',
        fillOpacity: 0.3,
      },
    });
  } else {
    group.addShape('circle', {
      attrs: {
        x: 0,
        y: 0,
        r: base_raduis_offset,
        stroke: '#aaaaaa',
        lineDash: [4, 5],
      },
    });
  }
}
