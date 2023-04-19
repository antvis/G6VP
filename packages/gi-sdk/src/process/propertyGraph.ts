import { IGraphData } from './schema';

const SPLITTER = '|PGSPLIPTER|';

/**
 * 将图数据转换为属性图，一个属性值为一个节点，边将其连接到对应的 id 属性点上
 * 并统计每个属性值在该属性下的概率，即 （属性 A 值为 '1' 出现次数 / 属性 A 的所有值出现总次数）
 * @param graphData
 * @returns
 */
export const graphData2PropertyGraph = (graphData: IGraphData) => {
  const splitData = (itemType, data) => {
    if (itemType === 'edge') {
      const { id, source, target, ...others } = data;
      return { id, others };
    }
    const { id, ...others } = data;
    return { id, others };
  };

  const propertyLinks: {
    source: string;
    target: string;
  }[] = [];
  const propertyValueMap = {};

  ['node', 'edge'].forEach(itemType => {
    const items = graphData[`${itemType}s`];
    items.forEach(item => {
      const { data } = item;
      const { id, others } = splitData(itemType, data);

      const idKey = `${itemType}${SPLITTER}id${SPLITTER}${id}`;
      propertyValueMap[idKey] = {
        name: 'id',
        value: id,
        count: 1,
      };

      Object.keys(others).forEach(pname => {
        const pvalue = others[pname];
        const key = `${itemType}${SPLITTER}${pname}${SPLITTER}${pvalue}`;
        if (propertyValueMap.hasOwnProperty(key)) {
          propertyValueMap[key].count++;
        } else {
          propertyValueMap[key] = {
            name: pname,
            value: pvalue,
            count: 1,
          };
        }
        propertyLinks.push({
          source: idKey,
          target: key,
        });
      });
    });
  });

  // 计算每一属性值 count 数的个数
  const propertyCountCount: {
    [propertyKey: string]: {
      [count: number]: number;
      numberOfCount: number; // 一个属性值出现「次数」的可能性个数
      total: number; // 总属性值个数
      ave: number;
      hasOrdinary: boolean;
      valueRatios: { id: string; ratio: number }[];
      valueRankMap: { [id: string]: number };
    };
  } = {};
  Object.keys(propertyValueMap).forEach(propertyValueKey => {
    const [itemType, propertyName] = propertyValueKey.split(SPLITTER);

    const { count } = propertyValueMap[propertyValueKey];

    const propertyKey = `${itemType}${SPLITTER}${propertyName}`;
    propertyCountCount[propertyKey] = propertyCountCount[propertyKey] || {
      total: 0,
      numberOfCount: 0,
      valueRatios: [],
      valueRankMap: {},
    };
    propertyCountCount[propertyKey][count] = propertyCountCount[propertyKey][count] || 0;
    propertyCountCount[propertyKey][count]++;
    propertyCountCount[propertyKey].numberOfCount++;
    propertyCountCount[propertyKey].total += count;
  });

  const properties: {
    id: string;
    propertyName: string;
    propertyValue: unknown;
    ratio: number;
    isOrdinary: boolean;
    hasOrdinary?: boolean;
    isOutlier?: boolean;
    rank?: number;
  }[] = Object.keys(propertyValueMap).map(propertyValueKey => {
    const [itemType, propertyName, propertyValue] = propertyValueKey.split(SPLITTER);
    const propertyKey = `${itemType}${SPLITTER}${propertyName}`;

    const { numberOfCount, total } = propertyCountCount[propertyKey];

    const { count } = propertyValueMap[propertyValueKey];

    // 若这个属性值的出现「次数」非常多，大于该属性所有值出现「次数」的 90%，则认为这个值是一平凡的属性值，其余的为异常值
    const isOrdinary = propertyCountCount[propertyKey][count] > numberOfCount * 0.5;
    // 若存在平凡的属性值，这个属性的重要性则参考异常值而非信息量
    propertyCountCount[propertyKey].hasOrdinary = propertyCountCount[propertyKey].hasOrdinary || isOrdinary;

    const ratio = count / total;

    propertyCountCount[propertyKey].valueRatios.push({
      id: propertyValueKey,
      ratio,
    });

    return {
      id: propertyValueKey,
      propertyName,
      propertyValue,
      ratio,
      isOrdinary,
    };
  });

  Object.values(propertyCountCount).forEach(item => {
    const { hasOrdinary, total, valueRankMap } = item;
    if (hasOrdinary) {
      // 存在平凡的值，则需要参考平均数
      item.ave = 1 / total;
    } else {
      // 否则参考信息量，将信息量排序，ratio 越小越重要
      item.valueRatios.sort((a, b) => a.ratio - b.ratio);
      item.valueRatios.forEach((valueRatio, i) => {
        const { id } = valueRatio;
        valueRankMap[id] = i;
      });
    }
  });

  properties.forEach(property => {
    const { id, ratio } = property;
    const [itemType, propertyName] = id.split(SPLITTER);
    const propertyKey = `${itemType}${SPLITTER}${propertyName}`;
    const { hasOrdinary, ave, valueRankMap } = propertyCountCount[propertyKey];
    property.hasOrdinary = hasOrdinary;
    if (hasOrdinary) {
      if (ratio > ave && propertyName !== 'id') property.isOutlier = true;
    } else {
      property.rank = valueRankMap[id];
    }
  });

  return {
    nodes: properties,
    edges: propertyLinks,
  };
};

/**
 * 计算一个图节点/边所有属性的重要性，并排序，重要的在前面
 * @param propertyGraphData 属性图数据
 * @param itemType 图节点/边
 * @param itemId 图节点/边的 id
 * @returns
 */
export const getNodePropertyImportance = (
  propertyGraphData,
  itemType,
  itemId,
  findTop = 5,
  findOutlier = true,
): { propertyName: string; ratio: number; rank: number; isOuterlier?: boolean }[] => {
  const propertyNodeMap = {};
  propertyGraphData.nodes?.forEach(pnode => (propertyNodeMap[pnode.id] = pnode));
  const idPropertyNode = propertyNodeMap[`${itemType}${SPLITTER}id${SPLITTER}${itemId}`];
  const propertyNodes: { propertyName: string; ratio: number; rank: number; isOutlier?: boolean }[] = [];

  if (idPropertyNode) {
    const getProperty = propertyNode => {
      const { propertyName, ratio, rank, hasOrdinary, isOutlier } = propertyNode;
      if (!hasOrdinary && rank < findTop) {
        propertyNodes.push({
          propertyName,
          ratio,
          rank,
        });
      } else if (findOutlier && isOutlier) {
        propertyNodes.push({
          propertyName,
          ratio,
          rank,
          isOutlier: true,
        });
      }
    };

    propertyGraphData.edges?.forEach(edge => {
      const { source, target } = edge;
      if (source === idPropertyNode.id) {
        getProperty(propertyNodeMap[target]);
      } else if (target === idPropertyNode.id) {
        getProperty(propertyNodeMap[source]);
      }
    });
  }
  return propertyNodes;
};

/**
 * 计算每一种属性的熵，并按照从大到小排序
 * @param propertyGraphData 属性图数据
 * @param itemType 图元素类型，节点或边
 * @returns
 */
export const getPropertyRanks = (
  propertyGraphData: IGraphData,
  itemType: 'node' | 'edge',
): {
  propertyName: string;
  entropy: number;
}[] => {
  if (!propertyGraphData) return [];
  const properyEntropyMap = {};
  propertyGraphData.nodes.forEach(propertyValueNode => {
    const { id, ratio } = propertyValueNode;
    const [iType, propertyName] = id.split(SPLITTER);
    if (propertyName === 'id' || (itemType && iType !== itemType)) return [];
    const propertyKey = `${iType}${SPLITTER}${propertyName}`;
    properyEntropyMap[propertyKey] = properyEntropyMap[propertyKey] || 0;
    properyEntropyMap[propertyKey] += ratio * Math.log2(ratio);
  });
  return Object.keys(properyEntropyMap)
    .map(propertyKey => ({
      propertyName: propertyKey.split(SPLITTER)[1],
      entropy: properyEntropyMap[propertyKey],
    }))
    .sort((a, b) => b.entropy - b.entropy); // 按照从大到小排序，熵越大的越重要
};

/**
 * 筛选出计算一个属性的所有属性值的排序，若一个属性值是 outlier，则 rank 为 0，即最重要
 * @param propertyGraphData 属性图数据
 * @param itemType 图元素类型，节点或边
 * @param propertyName 属性名称
 * @returns
 */
export const getPropertyValueRanks = (
  propertyGraphData: IGraphData,
  itemType: 'node' | 'edge',
  propertyName: string,
): {
  propertyValue: unknown;
  rank: number;
  isOutlier?: boolean;
}[] => {
  if (!propertyGraphData) return [];
  const valueRanks: { propertyValue: unknown; rank: number; isOutlier?: boolean }[] = [];
  propertyGraphData.nodes.forEach(propertyValueNode => {
    const { id, rank, isOutlier } = propertyValueNode;
    const [iType, pName, pValue] = id.split(SPLITTER);
    if (propertyName === 'id' || iType !== itemType || pName !== propertyName) return [];
    valueRanks.push({
      propertyValue: pValue,
      rank: isOutlier ? 0 : rank,
      isOutlier,
    });
  });
  return valueRanks;
};
