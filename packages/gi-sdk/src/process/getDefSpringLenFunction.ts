export const getDefSpringLenFunction = springConfig => {
  const { defaultSpring = 100, maxLimitLength = 500, minLimitDegree = 5 } = springConfig;
  const defSpringLen = (_edge, source, target) => {
    /** 默认返回的是 200 的弹簧长度 */
    /** 如果你要想要产生聚类的效果，可以考虑
    根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
    const Sdegree = source.data.layout.degree;
    const Tdegree = target.data.layout.degree;
    const MinDegree = Math.min(Sdegree, Tdegree);

    let SpringLength = defaultSpring;
    if (MinDegree < minLimitDegree) {
      SpringLength = defaultSpring * MinDegree;
    } else {
      SpringLength = maxLimitLength;
    }
    return SpringLength;
  };
  return defSpringLen;
};
