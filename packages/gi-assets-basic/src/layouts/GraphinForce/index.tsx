import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

const defSpringLen = (_edge, source, target) => {
  /** 默认返回的是 200 的弹簧长度 */
  /** 如果你要想要产生聚类的效果，可以考虑
  根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
  const defaultSpring = 100;
  const Sdegree = source.data.layout.degree;
  const Tdegree = target.data.layout.degree;
  const MinDegree = Math.min(Sdegree, Tdegree);
  const MaxDegree = Math.max(Sdegree, Tdegree);

  let SpringLength = defaultSpring;
  if (MinDegree < 5) {
    SpringLength = defaultSpring * MinDegree;
  } else {
    SpringLength = 450;
  }
  return SpringLength;
};

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GraphinForce',
  options: {
    type: 'graphin-force',
    animation: false,
    preset: {
      type: 'concentric',
    },
    defSpringLen,
  },
  name: '力导布局',
  category: 'basic',
  type: 'LAYOUT',
  desc: '渐进式力导布局，可用于动态布局',
  icon: 'icon-layout-force',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
