import { ITreeData } from './interface';
import drawKeyShape from './draw_keyShape';
import drawContribution from './draw_contribution';
// import drawButton from './draw_button';
import drawRose from './draw_rose';
import drawVariability from './draw_variability';
import drawBizIntervene from './draw_bizIntervene';
// import drawRunningState from './draw_runningState';
import drawBizQuotas from './draw_bizQuotas';
import drawEmpty from './draw_empty';

import { statistics_data } from './preprocess';

export type IGroup = any;
export type ModelConfig = any;
export type Item = any;

export const registerNode = Graphin => {
  Graphin.registerNode(
    'reason_analysis_node',
    {
      draw(cfg: ModelConfig | undefined, group: IGroup | undefined) {
        const data = cfg as ITreeData;

        console.log('registerNode', data, Graphin)
        
        data.data.attrShowingCfg = {
          bizQuotas: {
            show_group: true,
            show_description: true,
            cat_boolean: true,
            cat_string: true,
            cat_number: true,
          },
          roseCompare: {
            show_group: true,
            show_contrast: true,
            show_experiment_increcement: true,
            show_experiment_reduce: true,
          },
          bizIntervene: {
            show_group: true,
            show_canbe_interupted: true,
            show_notbe_interupted: true,
          },
          runningState: {
            show_group: true,
            show_finished: true,
            show_rnning: true,
          },
          degreeState: {
            show_group: true,
            show_contribution: true,
            show_variability: true,
            range_contribute: [0, 1],
            range_variability: [0, 1],
          },
        };
        console.log('registerNode', data)

        // key shape 背景
        const keyShape = drawKeyShape(group!);

        // 添加元素
        drawElements(group!, data.data);

        return keyShape!;
      },
      update(cfg: ModelConfig, item: Item) {
        const data = cfg as ITreeData;

        // 得到边的keyShape
        const keyShape = item.getKeyShape();

        // 通过keyShape得到group
        const group = keyShape.getParent() as IGroup;

        // 删除所有元素除了keyshape
        clearElementsButKeyShape(group);

        // 添加元素
        drawElements(group, data);
      },
    },
    'circle',
  );
};

// 根据业务数据添加各种元素
function drawElements(group: IGroup, data: ITreeData) {
  // 业务可干预
  drawBizIntervene(group!, data);

  // 贡献度
  drawContribution(group!, data);

  // 类目条形图
  drawVariability(group!, data);

  // 运行状态
  // drawRunningState(group!, data);

  // 玫瑰图
  drawRose(group!, data);

  // 业务指标
  drawBizQuotas(group!, data);

  // 小按钮
  // drawButton(group!);

  // 是不是需要绘制垫底元素
  // 就是当所有元素被隐藏了的时候
  drawEmpty(group!, data);

  //透明度降低
  const { property, attrShowingCfg, max = false} = data;
  const { canBeInterupt, variability = 0} = property;
  let contributionFlag = true
  let variabilityFlag = true;
  let hideNonMaxFlag = true;
  if (attrShowingCfg) {
    const { degreeState = {}, test } = attrShowingCfg as any;
    const { contribution } = property;
    contributionFlag = contribution < degreeState.range_contribute[0] || contribution > degreeState.range_contribute[1];
    variabilityFlag = variability * 100 < degreeState.range_variability[0] || variability * 100 > degreeState.range_variability[1];
    hideNonMaxFlag = test && !max
  }
  if (
    !attrShowingCfg?.bizIntervene?.show_group ||
    (!attrShowingCfg?.bizIntervene?.show_canbe_interupted && canBeInterupt) ||
    (!attrShowingCfg?.bizIntervene?.show_notbe_interupted && !canBeInterupt) ||
    contributionFlag || variabilityFlag|| hideNonMaxFlag
  ) {
    hideShape(group)
  }
}

// 在更新阶段移除所有不是keyShape的元素
function clearElementsButKeyShape(group: IGroup) {
  group?.getChildren().forEach(c => {
    // keyShape将还在
    if (!c?.cfg?.isKeyShape && c?.cfg?.name !== 'keyShape') {
      c.destroy();
      c.remove();
    }
  });
}

function hideShape(group: IGroup) {
  const shape = group.get('children'); // 按照添加的顺序
  shape.forEach((item:any) => {
    const style = {
      opacity: 0.3
    };
    item.attr(style)
  })
}
