/** 树结构 */
type ITreeData = {
  id: string /** 唯一id */;

  type?: string /** 类型 */;

  x?: number;

  y?: number;

  contributionRange: { min: number; max: number } /** 贡献度范围（全局） */;

  variabilityRange: { min: number; max: number } /** 异变度范围（全局） */;

  isShowingChildren?: boolean /** 展开自节点状态 */;

  property: IBizProperty /** 业务属性 */;

  children?: Array<ITreeData>;

  edge?: IEdge;

  /** 这个挂了元素是不是需要显示的信息，只挂在root节点*/
  attrShowingCfg?: {
    bizQuotas: {
      show_group: boolean;
      show_description: boolean;
      cat_boolean: boolean;
      cat_string: boolean;
      cat_number: boolean;
    };
    roseCompare: {
      show_group: boolean;
      show_contrast: boolean;
      show_experiment_increcement: boolean;
      show_experiment_reduce: boolean;
    };
    bizIntervene: {
      show_group: boolean;
      show_canbe_interupted: boolean;
      show_notbe_interupted: boolean;
    };
    runningState: {
      show_group: boolean;
      show_finished: boolean;
      show_rnning: boolean;
    };
    degreeState: {
      show_group: boolean;
      show_contribution: boolean;
      show_variability: boolean;
      range_contribute: [number, number];
      range_variability: [number, number];
    };
  };

  [props: string]: any;
};

type IEdge = {
  isManualFlag?: boolean;
  flag?: 'left' | 'right';
};

/** 点业务属性 */
type IBizProperty = {
  // 指标原始配置
  bizIdentifieBucket: IBizIdentifieBucket;
  /** 业务可干预 */
  canBeInterupt: boolean /** 是否可干预 */;

  runningState: 'running' | 'finished' /** 机器运行状态 */;

  contribution: number /** 贡献度 */;

  // explaination: IDegreeData /** 解释度 不要了 */;

  variability: number /** 异变度 */;

  changes: Array<IChangeItem> /** 变化项目，用于绘制南丁格尔玫瑰图 */;

  quotas: Array<IQuotaItem> /** 指标， 用于绘制每个节点最底部的指标元素 */;

  relationTag?: 'right' | 'wrong' | undefined /** 与父节点的边关系 */;

  [key: string]: any /** 其他属性，需要进一步确定 */;
};

export type IBizIdentifieBucket = {
  [qutos: string]: Array<string>;
};

type IChangeItemPropsInfo = {
  name: string;
  value: any;
  unit: string;
};

/** 南丁格尔玫瑰图每一个项目 */
export type IChangeItem = {
  name: string /** 项目类别名 */;

  props: Array<IChangeItemPropsInfo> /** tooltip中展示的项目 */;

  beforeValue: number | undefined | null /** 前后数值  (之前的值不一定有 按照0 处理) */;

  afterValue: number | undefined | null /** 前后数值  (之前的值不一定有 按照0 处理) */;

  [key: string]: any /** 其他属性，需要进一步确定 */;
};

/** 指标 */
export type IQuotaItem = {
  name: string /** 指标名 */;

  value:
    | boolean
    | number
    | string /** 指标值，可能是布尔或者数值 ， 绘制圆形半径的时候按照最大最小之间分成四段映射半径值 */;

  max?: number /** 最大值 */;

  min?: number /** 最小值 */;

  [key: string]: any /** 其他属性，需要进一步确定 */;
};

export { ITreeData };
