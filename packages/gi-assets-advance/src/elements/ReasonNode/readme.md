节点依赖数据结构

```javascript
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
  attrShowingCfg?: IFilterCfg;

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

```