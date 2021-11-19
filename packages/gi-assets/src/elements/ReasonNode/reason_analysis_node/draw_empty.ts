import { ITreeData } from './interface';

// 业务可干预
export default function drawEmpty(group: any, data: ITreeData) {
  const { attrShowingCfg } = data;

  // 条件：组全部的组是关闭的
  const condition_all_group_hide =
    !attrShowingCfg?.bizQuotas.show_group &&
    !attrShowingCfg?.roseCompare.show_group &&
    !attrShowingCfg?.bizIntervene.show_group &&
    !attrShowingCfg?.runningState.show_group &&
    !attrShowingCfg?.degreeState.show_group;

  // 条件：全部的组是关闭的
  const condition_all_group_factor_hide =
    !attrShowingCfg?.bizQuotas.cat_boolean &&
    !attrShowingCfg?.bizQuotas.cat_string &&
    !attrShowingCfg?.bizQuotas.cat_number &&
    !attrShowingCfg?.roseCompare.show_contrast &&
    !attrShowingCfg?.roseCompare.show_experiment_increcement &&
    !attrShowingCfg?.roseCompare.show_experiment_reduce &&
    !attrShowingCfg?.bizIntervene.show_canbe_interupted &&
    !attrShowingCfg?.bizIntervene.show_notbe_interupted &&
    !attrShowingCfg?.runningState.show_finished &&
    !attrShowingCfg?.runningState.show_rnning &&
    !attrShowingCfg?.degreeState.show_contribution &&
    !attrShowingCfg?.degreeState.show_variability;

  // 满足条件 绘制底部轮廓
  if (condition_all_group_hide || condition_all_group_factor_hide) {
    const base_raduis_offset = 55;
    console.log('drawEmpty', condition_all_group_hide, condition_all_group_factor_hide);
    group.addShape('circle', {
      attrs: {
        x: 0,
        y: 0,
        r: base_raduis_offset,
        fill: 'r(0.5, 0.5, 0.95) 0:rgb(26,26,26) 0.5:rgb(26,26,26) 1:#1890ff',
        fillOpacity: 0.3,
      },
    });
  }
}
