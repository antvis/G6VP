export interface HullOption {
  // 在包裹内部的节点实例或节点 Id 数组
  members: string[];
  // 包裹的 id
  id?: string;
  // 包裹的类型
  type?: 'round-convex' | 'smooth-convex' | 'bubble';
  padding?: number;
  // 轮廓的样式属性
  style?: {
    // 填充颜色
    fill: string;
    stroke: string;
    // 透明度
    opacity: number;
  };
}

// 返回轮廓配置
export const getHullOptions = (option: HullOption) => {
  return {
    id: option.id || `${Math.random().toString(36).substr(2)}`,
    type: option.type || 'bubble',
    members: option.members,
    padding: option.padding || 10,
    style: option.style,
  };
};

// 创建轮廓
export const drawHulls = (hullOptions, hulls, graph) => {
  if (!graph) {
    return;
  }
  hullOptions?.forEach(option => {
    // 过滤传入的members中在画布中实际不存在的nodeId、members中id不能相同
    option.members = [...new Set(option.members)].filter(member => graph.findById(member));
  });
  if (!hulls) {
    hulls = hullOptions
      ?.map(option => {
        const { members } = option;
        // members长度为0的情况，调用hull.updateData(hull.members)会报错
        if (members?.length < 1) {
          return undefined;
        }
        return graph.createHull({ ...option, members });
      })
      .filter(item => !!item);
  } else {
    hulls.forEach(hull => {
      hull.updateData(hull.members);
    });
  }
  return hulls;
};

// 移除轮廓
export const removeHulls = (hulls, graph) => {
  const hullMap = graph?.get('hullMap');
  if (hulls) {
    hulls.forEach(hull => {
      if (hull) {
        graph?.removeHull(hull);
        if (hullMap) {
          delete hullMap[hull.id];
        }
      }
    });
    hulls = null;
  }
};

export default {
  getHullOptions,
  removeHulls,
  drawHulls,
};
