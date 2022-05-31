import G6 from '@antv/g6';
import { mix } from '@antv/util';

const ascendCompare = p => {
  // 这是比较函数
  return function (m, n) {
    const keys = p.split('.');
    let a = 0,
      b = 0;
    if (keys.length === 1) {
      a = m[p];
      b = n[p];
    } else {
      // 最多两层
      a = m[keys[0]][keys[1]];
      b = n[keys[0]][keys[1]];
    }
    return a - b; // 升序
  };
};

const clusteringDagreLayout = Graphin => {
  Graphin.registerLayout('clusteringDagre', {
    init(data) {
      const self = this;
      self.nodes = data.nodes;
      self.edges = data.edges;
    },
    /**
     * 执行布局
     */
    execute() {
      const self = this;
      const { nodes, edges } = self;
      const groupNodes = {};
      const nodeMap = {};

      // 默认使用dataType排序
      let clusterAttr = 'nodeType';

      if (self.clusterAttr) {
        // 新的属性选取方案，格式是 `attribute@@type`
        clusterAttr = self.clusterAttr;
      }
      nodes.forEach(node => {
        node.clusterAttr = node.data.properties
          ? node.data.properties[clusterAttr]
          : node.data[clusterAttr] || node.nodeType;

        if (!groupNodes[node.clusterAttr])
          groupNodes[node.clusterAttr] = {
            count: 1,
            indegree: 0,
            outdegree: 0,
            innerdegree: 0,
            targetNeighbors: {}, // 存储该 group 指向的 group 的 clusterAttr
            sourceNeighbors: {}, // 存储该 group 指向的 group 的 clusterAttr
            nodes: [node],
            nodeType: node.nodeType,
            clusterAttr: node.clusterAttr,
          };
        else {
          groupNodes[node.clusterAttr].count++;
          groupNodes[node.clusterAttr].nodes.push(node);
        }
        nodeMap[node.id] = node;
      });
      const groupAdjMap = {};
      const nodeNeighborMap = {};
      edges.forEach(edge => {
        if (!nodeNeighborMap[edge.source]) nodeNeighborMap[edge.source] = [edge.target];
        else nodeNeighborMap[edge.source].push(edge.target);
        if (!nodeNeighborMap[edge.target]) nodeNeighborMap[edge.target] = [edge.source];
        else nodeNeighborMap[edge.target].push(edge.source);

        const sourceNode = nodeMap[edge.source];
        const targetNode = nodeMap[edge.target];
        if (!sourceNode || !targetNode) return;
        if (sourceNode.clusterAttr === targetNode.clusterAttr) {
          groupNodes[sourceNode.clusterAttr].innerdegree++;
          return;
        }
        const sourceGroup = groupNodes[sourceNode.clusterAttr];
        const targetGroup = groupNodes[targetNode.clusterAttr];
        sourceGroup.outdegree++;
        sourceGroup.targetNeighbors[targetNode.clusterAttr] = 1;
        targetGroup.indegree++;
        targetGroup.sourceNeighbors[sourceNode.clusterAttr] = 1;
        const adjKey = `${sourceNode.clusterAttr}|||${targetNode.clusterAttr}`;
        if (!groupAdjMap[adjKey]) groupAdjMap[adjKey] = 1;
        else groupAdjMap[adjKey]++;
      });

      // NOTE: 保留原来的，没有指定attr的时候，用原来的实现
      if (!clusterAttr) {
        // 找出最小 indegree 的一组作为第一层
        let minInDegree = Infinity,
          firstLevel = [] as any,
          minInDegreeDataType;
        Object.keys(groupNodes).forEach(clusterAttr => {
          if (groupNodes[clusterAttr].indegree === 0 && groupNodes[clusterAttr].outdegree === 0) {
            firstLevel.push(clusterAttr);
            groupNodes[clusterAttr].rank = 0;
          } else if (groupNodes[clusterAttr].indegree < minInDegree) {
            minInDegree = groupNodes[clusterAttr].indegree;
            minInDegreeDataType = clusterAttr;
          }
        });
        firstLevel.push(minInDegreeDataType);
        // 找到同样小的组共同作为第一层
        Object.keys(groupNodes).forEach(clusterAttr => {
          if (groupNodes[clusterAttr].indegree === minInDegree) {
            if (clusterAttr !== minInDegreeDataType) firstLevel.push(clusterAttr);
            groupNodes[clusterAttr].rank = 0;
          }
        });

        self.calcLevels(firstLevel, 0, groupNodes, firstLevel.length);
      } else {
        const attrValues = Object.keys(groupNodes);
        const compFunc = (a, b) => {
          // 因为一些缺省值的缘故，需要把没有对应属性的放到最后边
          if (a !== groupNodes[a].nodeType && b === groupNodes[b].nodeType) return -1;
          if (a === groupNodes[a].nodeType && b !== groupNodes[b].nodeType) return 1;
          return !isNaN(a) && !isNaN(b)
            ? Number(a) - Number(b) // 数值型的，按从大到小排列
            : groupNodes[a].nodes.length - groupNodes[b].nodes.length; // 类别型的，按数量从小到大排序
        };
        attrValues.sort(compFunc);
        attrValues.forEach((attr, idx) => {
          groupNodes[attr].rank = idx;
        });
      }

      // 按照层级将 groupNodes 放入 levelNodes
      // 每一层中的每个 groupNode 先按照 groupNodes 的邻接关系进行 sugiyama 排序
      // 同时考虑每个 groupNode 所占据的范围
      const levelNodes = [] as any;
      Object.keys(groupNodes).forEach(clusterAttr => {
        const group = groupNodes[clusterAttr];
        if (!levelNodes[group.rank]) levelNodes[group.rank] = [group];
        else levelNodes[group.rank].push(group);
        group.nodes.forEach(node => {
          node.cDagreLayoutInfo = {
            rank: group.rank,
          };
        });
      });
      self.sugiyamaGroup(levelNodes, groupAdjMap);

      // 计算每个 groupNode 中每个真实节点的 posIdx，范围 [groupNode.beginIdx, groupNode.endIdx]
      self.sugiyamaNode(levelNodes, groupNodes, nodeNeighborMap, nodeMap);

      // 此时，所有节点中 cDagreLayoutInfo 中都存有 rank 和 posIdx
      // 根据 rank 决定每个 node 的 y，posIdx 决定 x
      const width = self.width || 500;
      const height = self.height || 500;
      let maxNodeNumInLevel = -Infinity;
      levelNodes.forEach(groups => {
        let nodeNum = 0;
        groups.forEach(group => {
          nodeNum += group.nodes.length;
        });
        if (maxNodeNumInLevel < nodeNum) maxNodeNumInLevel = nodeNum;
      });

      // 根据限制的换行数量，添加节点的line和linePosIdx

      nodes.forEach(node => {
        const { posIdx } = node.cDagreLayoutInfo;
        node.cDagreLayoutInfo.line = Math.floor(posIdx / self.wrapThreshold); // 处在当前层的第几行
        node.cDagreLayoutInfo.linePosIdx = posIdx % self.wrapThreshold; // 行内的index
      });

      if (self.radial) {
        // 同心圆化
        const center = [width / 2, height / 2];
        const ranksep = self.ranksep // 半径
          ? self.ranksep
          : (Math.min(width, height) * 0.4) / levelNodes.length || 50;
        nodes.forEach(node => {
          const { rank, posIdx } = node.cDagreLayoutInfo;
          const radius = (rank + 1) * ranksep;
          const angle = (Math.PI * 2 * posIdx) / maxNodeNumInLevel;
          node.x = radius * Math.cos(angle) + center[0];
          node.y = radius * Math.sin(angle) + center[1];
        });
      } else {
        // 正常分层
        const begin = self.begin || [50, 50];
        const rankdir = self.rankdir ? self.rankdir : 'TB';
        let ranksep = self.ranksep,
          nodesep = self.nodesep;
        if (rankdir === 'TB' || rankdir === 'BT') {
          if (!ranksep) ranksep = (height * 0.8) / levelNodes.length || 150;
          if (!nodesep) nodesep = (width * 0.8) / maxNodeNumInLevel || 150;
        } else if (rankdir === 'LR' || rankdir === 'RL') {
          if (!ranksep) ranksep = (width * 0.8) / levelNodes.length || 150;
          if (!nodesep) nodesep = (height * 0.8) / maxNodeNumInLevel || 150;
        }
        const wrapLineHeight = self.wrapLineHeight;

        nodes.forEach(node => {
          switch (rankdir) {
            case 'TB':
              node.x = begin[0] + nodesep * node.cDagreLayoutInfo.linePosIdx;
              node.y = begin[1] + ranksep * node.cDagreLayoutInfo.rank + wrapLineHeight * node.cDagreLayoutInfo.line;
              break;
            case 'BT':
              node.x = begin[0] + nodesep * node.cDagreLayoutInfo.linePosIdx;
              node.y =
                height -
                (begin[1] + ranksep * node.cDagreLayoutInfo.rank + wrapLineHeight * node.cDagreLayoutInfo.line);
              break;
            case 'LR':
              node.x = begin[0] + ranksep * node.cDagreLayoutInfo.rank + wrapLineHeight * node.cDagreLayoutInfo.line;
              node.y = begin[1] + nodesep * node.cDagreLayoutInfo.linePosIdx;
              break;
            case 'RL':
              node.x =
                width - (begin[0] + ranksep * node.cDagreLayoutInfo.rank + wrapLineHeight * node.cDagreLayoutInfo.line);
              node.y = begin[1] + nodesep * node.cDagreLayoutInfo.linePosIdx;
              break;
          }
        });
      }

      // 结束后使用 force 进行微调
      if (self.postForce) {
        const postForce = new G6.Layout.forceAtlas2({
          center: [width / 2, height / 2],
          preventOverlap: true,
          kr: 15,
          maxIteration: 50,
        });
        postForce.init({
          nodes,
          edges,
        });
        postForce.execute();
      }
    },
    sugiyamaNode(levelNodes, groupNodes, nodeNeighborMap, nodeMap) {
      // 初始化，给定每个 groupNode 中的每个真实节点 posIdx，范围 [groupNode.beginIdx, groupNode.endIdx]
      Object.keys(groupNodes).forEach(clusterAttr => {
        const group = groupNodes[clusterAttr];
        const nodes = groupNodes[clusterAttr].nodes;
        nodes.forEach((node, i) => {
          node.cDagreLayoutInfo.posIdx = group.beginIdx + i;
        });
      });

      // 自上而下，给定每个真实节点 posIdx
      levelNodes.forEach((groups, idx) => {
        // 若正在遍历最后一层
        if (idx === levelNodes.length - 1) return;
        // 若正在遍历非最后一层
        groups.forEach(group => {
          const nodes = group.nodes;
          nodes.forEach((node, i) => {
            const neighbors = nodeNeighborMap[node.id];
            let posIdx = 0,
              nxtNeighborNum = 0;
            neighbors &&
              neighbors.forEach(neighborId => {
                // 只有是下一层的节点才进行
                const neighborNode = nodeMap[neighborId];
                if (neighborNode.cDagreLayoutInfo.rank === group.rank + 1) {
                  posIdx += neighborNode.cDagreLayoutInfo.posIdx;
                  nxtNeighborNum++;
                }
              });
            node.cDagreLayoutInfo.posIdx = posIdx / nxtNeighborNum || i;
          });
        });
      });

      // 自下而上，修正每个 groupNode posIdx
      for (let idx = levelNodes.length - 1; idx >= 0; idx--) {
        // 若正在遍历第一层
        if (idx === 0) continue;
        const groups = levelNodes[idx];
        // 若正在遍历非第一层
        groups.forEach(group => {
          const nodes = group.nodes;
          nodes.forEach((node, i) => {
            const neighbors = nodeNeighborMap[node.id];
            let posIdx = 0,
              preNeighborNum = 0;
            neighbors &&
              neighbors.forEach(neighborId => {
                // 只有是上一层的节点才进行
                const neighborNode = nodeMap[neighborId];
                if (neighborNode.cDagreLayoutInfo.rank === group.rank - 1) {
                  posIdx += neighborNode.cDagreLayoutInfo.posIdx;
                  preNeighborNum++;
                }
              });
            node.cDagreLayoutInfo.posIdx = posIdx / preNeighborNum || i;
          });
        });
      }

      // 对于同组节点，根据上面计算出的 posIdx 大小进行排序，重新给定整数 posIdx
      Object.keys(groupNodes).forEach(clusterAttr => {
        const nodes = groupNodes[clusterAttr].nodes;
        nodes.sort(ascendCompare('cDagreLayoutInfo.posIdx'));
        const begin = groupNodes[clusterAttr].beginIdx;
        nodes.forEach((node, i) => {
          node.cDagreLayoutInfo.posIdx = begin + i;
        });
      });
    },
    sugiyamaGroup(levelNodes, groupAdjMap) {
      const levelNums = levelNodes.length;
      // 自上而下，给定每个 groupNode posIdx
      levelNodes.forEach((groups, idx) => {
        // 若正在遍历最后一层
        if (idx === levelNums - 1) {
        } else {
          // 若正在遍历非最后一层，找到下一层，根据下一层的顺序决定本层 group 的 posIdx
          const nextLevelGroups = levelNodes[idx + 1];
          groups.forEach((group, i) => {
            let nxtAdjNum = 0,
              posIdx = 1;
            nextLevelGroups.forEach((nxtGroup, nxtIdx) => {
              const adjKey = `${group.clusterAttr}|||${nxtGroup.clusterAttr}`;
              if (!groupAdjMap[adjKey]) return;
              posIdx += nxtGroup.posIdx || nxtIdx;
              nxtAdjNum++;
            });
            posIdx /= nxtAdjNum * 2; // * 2 使得边数量多的更靠近
            group.posIdx = posIdx || i;
          });
        }
      });
      // 自下而上，修正每个 groupNode posIdx
      for (let idx = levelNums - 1; idx >= 0; idx--) {
        // 若正在遍历第一层
        if (idx === 0) continue;

        // 若正在遍历非第一层
        const groups = levelNodes[idx];
        const preLevelGroups = levelNodes[idx - 1];
        groups.forEach((group, i) => {
          let nxtAdjNum = 0,
            posIdx = 1;
          preLevelGroups.forEach((preGroup, preIdx) => {
            const adjKey = `${group.clusterAttr}|||${preGroup.clusterAttr}`;
            if (!groupAdjMap[adjKey]) return;
            posIdx += preGroup.posIdx || preIdx;
            nxtAdjNum++;
          });
          posIdx /= nxtAdjNum * 2; // * 2 使得边数量多的更靠近
          group.posIdx = posIdx || i;
        });
      }

      // 对于同层的 groupNodes，根据上面计算出的 posIdx 大小进行排序，并考虑腾出（内部真实节点数量）空间
      levelNodes.forEach(groups => {
        groups.sort(ascendCompare('posIdx'));
        let preEndPos = 0;
        groups.forEach(group => {
          const groupLength = group.nodes.length;
          group.posIdx = Math.round(preEndPos + groupLength / 2);
          group.beginIdx = preEndPos;
          group.endIdx = preEndPos + groupLength;
          preEndPos = group.endIdx + 1;
        });
      });
    },
    calcLevels(preLevel, preRank, groupNodes, taggedLevelNum) {
      const self = this;

      // 递归的终止条件，所有 groupNodes 都有 rank
      if (taggedLevelNum >= Object.keys(groupNodes).length) return;

      let nextLevel = [];

      // 找出前一层的所有 neighbors 作为下一层
      preLevel.forEach(pre => {
        nextLevel = nextLevel.concat(
          // @ts-ignore
          Object.keys(groupNodes[pre].sourceNeighbors).concat(Object.keys(groupNodes[pre].targetNeighbors)),
        );
      });
      // 排除已经有过层级的 group
      for (let i = nextLevel.length - 1; i >= 0; i--) {
        if (!isNaN(groupNodes[nextLevel[i]].rank)) nextLevel.splice(i, 1);
        else groupNodes[nextLevel[i]].rank = preRank + 1;
      }

      // 递归直到所有 groupNodes 都已经有 rank
      self.calcLevels(
        nextLevel,
        preRank + 1,
        groupNodes,
        nextLevel.length ? taggedLevelNum + nextLevel.length : Infinity,
      );
    },
    /**
     * 根据传入的数据进行布局
     * @param {Object} data 数据
     */
    layout(data) {
      const self = this;
      self.init(data);
      self.execute();
    },
    /**
     * 更新布局配置，但不执行布局
     * @param {Object} cfg 需要更新的配置项
     */
    updateCfg(cfg) {
      const self = this;
      mix(self, cfg);
    },
    /**
     * 销毁
     */
    destroy() {
      const self = this;
      self.positions = null;
      self.nodes = null;
      self.edges = null;
      self.destroyed = true;
    },
  });
};

export default clusteringDagreLayout;
