import ForceGraph3D from '3d-force-graph';
import { extra, IGIAC, useContext, utils } from '@alipay/graphinsight';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import AnimateContainer from '../../CommonCmponents/AnimateContainer';
import Toolbar from '../Toolbar';

const { deepClone } = extra;

export interface ILargeGraph {
  GIAC: IGIAC;
  handleClick: () => void;
  minSize: string;
  maxSize: string;
  placement: 'LT' | 'RT' | 'LB' | 'RB';
  offset: number[];
}

const LargeGraph: React.FunctionComponent<ILargeGraph> = props => {
  const { updateContext, source: DATA, GISDK_ID, apis, config, transform } = useContext();
  const { GIAC, handleClick, maxSize, minSize, placement, offset } = props;

  const [state, setState] = React.useState({
    toggle: false,
  });
  const { toggle } = state;

  const setToggle = (isToggle: boolean) => {
    setState(preState => {
      return {
        ...preState,
        toggle: isToggle,
      };
    });
  };

  React.useLayoutEffect(() => {
    const elem = document.getElementById('gi-3d-graph') as HTMLElement;

    let nodes = deepClone(DATA.nodes);
    let edges = deepClone(DATA.edges);

    const hasStyles = utils.isStyles(DATA.nodes);
    if (!hasStyles) {
      const res = transform(DATA);
      nodes = res.nodes;
      edges = res.edges;
    }
    const data = { nodes, links: edges };

    const Graph = ForceGraph3D()(elem)
      .graphData(data)
      .enableNodeDrag(false)
      .nodeThreeObject((node: any) => {
        //这里按照GraphinNode的规范
        if (node.style.icon && node.style.icon.type === 'image') {
          const image = node.style.icon.value;
          const imgTexture = new THREE.TextureLoader().load(image);
          const material = new THREE.SpriteMaterial({ map: imgTexture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(24, 24);
          return sprite;
        }

        const { size, fill } = node.style.keyshape || {
          size: 40,
          fill: '#ddd',
        };
        const geometry = new THREE.SphereGeometry(3, size);
        const material = new THREE.MeshLambertMaterial({
          color: fill,
          transparent: true,
          opacity: 0.75,
        });
        const circle = new THREE.Mesh(geometry, material);
        return circle;
      })
      .linkColor((edge: any) => {
        if (edge.style && edge.style.keyshape) {
          const { fill } = edge.style.keyshape;
          return fill;
        }
      })
      .linkCurvature((edge: any) => {
        // return 0.4;
        if (edge.style && edge.style.keyshape && edge.style.keyshape.poly) {
          return 0.5;
        }
        return 0.1;
      })
      .nodeAutoColorBy('nodeType')
      .nodeLabel((node: any) => {
        if (node?.style.label.value) {
          return node.style.label.value;
        }
        return node.id;
      })
      .onNodeClick((node: any) => {
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        Graph.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
          }, // new position
          node, // lookAt ({ x, y, z })
          3000, // ms transition duration
        );
      });

    Graph.onNodeRightClick(node => {
      setToggle(true);
      //只要大数据节点的时候才是添加节点
      if (data.nodes.length > 1000 || data.links.length > 1000) {
        updateContext(draft => {
          const dataFrom3D = {
            nodes: [
              {
                //@ts-ignore
                id: node.id,
                //@ts-ignore
                data: node.data,
                //@ts-ignore
                style: node.style,
              },
            ],
            edges: [],
          };
          //@ts-ignore
          draft.data = dataFrom3D;
        });
      }

      //@ts-ignore
      apis.focusNodeById(node.id);
    });
  }, []);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return ReactDOM.createPortal(
    <div>
      <AnimateContainer toggle={toggle} maxSize={maxSize} minSize={minSize} placement={placement} offset={offset}>
        <Toolbar
          GIAC={GIAC}
          config={config}
          handleSwitchMap={handleClick} // 切换渲染视图
          handleToggleMap={handleToggle} //大小视图
        ></Toolbar>
        <div id="gi-3d-graph"></div>
      </AnimateContainer>
    </div>,
    document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement,
  );
};

export default LargeGraph;
