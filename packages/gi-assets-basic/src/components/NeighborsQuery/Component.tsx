import { useContext, utils } from '@alipay/graphinsight';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import '@antv/graphin-icons/dist/index.css';
import { Menu } from 'antd';
import React from 'react';

const icons = Graphin.registerFontFamily(iconLoader);

const defSpringLen = (_edge, source, target) => {
  // NOTE: 固定200还是效果好
  // return 200;
  /** 默认返回的是 200 的弹簧长度 */
  /** 如果你要想要产生聚类的效果，可以考虑 根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
  const defaultSpring = 100;
  const Sdegree = source.data.layout.degree;
  const Tdegree = target.data.layout.degree;
  const MinDegree = Math.min(Sdegree, Tdegree);
  const MaxDegree = Math.max(Sdegree, Tdegree);

  let SpringLength = defaultSpring;
  if (MinDegree < 5) {
    SpringLength = defaultSpring * MinDegree;
  } else {
    SpringLength = 500;
  }
  // console.log(Sdegree, Tdegree, MinDegree, MaxDegree, "SpringLength", SpringLength);

  return SpringLength;
};

const { SubMenu } = Menu;
export interface QueryNeighborsProps {
  serviceId: '';
  contextmenu: any;
  degree: number;
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const QueryNeighbors: React.FunctionComponent<QueryNeighborsProps> = props => {
  const { contextmenu, serviceId, degree } = props;
  const { data, updateContext, transform, graph, config, apis, services } = useContext();
  const service = utils.getService(services, serviceId);
  console.log('props', props);
  if (!service) {
    return null;
  }

  const handleClick = async e => {
    const { key } = e;
    const sep = key.replace('expand-', '');
    const value = contextmenu.item.getModel();
    graph.setItemState(value.id, 'selected', true);

    updateContext(draft => {
      draft.isLoading = true;
    });
    const result = await service({ ...value, sep });
    const newData = utils.handleExpand(data, result);

    contextmenu.onClose();

    updateContext(draft => {
      const res = transform(newData);
      res.nodes.forEach(node => {
        if (!node.style.badges) {
          node.style.badges = [];
        }
        // 保留其他位置的 badges，例如锁定和标签
        node.style.badges = node.style.badges.filter(({ position }) => position !== 'LB') || [];

        const expandIds = result.nodes.map(n => n.id);
        if (expandIds.indexOf(node.id) !== -1) {
          node.style.badges.push({
            position: 'LB',
            type: 'font',
            fontFamily: 'graphin',
            value: icons['plus-circle'],
            size: [12, 12],
            color: '#fff',
            fill: '#4DB6AC',
            stroke: '#4DB6AC',
          });
          // node.status = {
          //   highlight: true
          // };
        }
        if (node.id === value.id) {
          node.style.badges.push({
            position: 'LB',
            type: 'font',
            fontFamily: 'graphin',
            value: icons.fullscreen,
            size: [15, 15],
            color: '#fff',
            fill: '#FF6D00',
            stroke: '#FF6D00',
          });
          // node.status = {
          //   selected: true
          // };
        }
      });

      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
      draft.layout = {
        type: 'graphin-force',
        animation: false,
        preset: {
          type: 'concentric',
        },
        defSpringLen,
      };
    });
  };

  return (
    // @ts-ignore
    <SubMenu key="expand" eventKey="expand" title="扩展查询">
      <Menu.Item key="expand-1" eventKey="expand-1" onClick={handleClick}>
        一度扩展
      </Menu.Item>
      <Menu.Item key="expand-2" eventKey="expand-2" onClick={handleClick}>
        二度扩展
      </Menu.Item>
      <Menu.Item key="expand-3" eventKey="expand-3" onClick={handleClick}>
        三度扩展
      </Menu.Item>
    </SubMenu>
  );
};

export default QueryNeighbors;
