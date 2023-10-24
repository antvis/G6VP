import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import { extra, IGIAC, useContext } from '@antv/gi-sdk';
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
  highlightColor: string;
  backgroundColor: string;
}

const updateHighlight = Graph => {
  // trigger update of highlighted objects in scene
  Graph.nodeColor(Graph.nodeColor())
    .linkWidth(Graph.linkWidth())
    .linkDirectionalParticles(Graph.linkDirectionalParticles());
};

const LargeGraph: React.FunctionComponent<ILargeGraph> = props => {
  const {
    updateContext,
    source,
    largeGraphData,
    largeGraphLimit,
    data,
    GISDK_ID,
    apis,
    config,
    transform,
    nodeMapper,
    edgeMapper,
  } = useContext();
  const { GIAC, handleClick, maxSize, minSize, placement, offset, highlightColor, backgroundColor } = props;
  const GraphRef = React.useRef<ForceGraph3DInstance>();
  let DATA = source;
  let highlightNodes: string[] = [];
  let highlightLinks: string[] = [];
  if (largeGraphData) {
    // 如果画布为空，且有大图数据，则展示大图数据
    DATA = largeGraphData;
    if (data.nodes.length > 0) {
      highlightNodes = data.nodes.map(c => c.id);
      highlightLinks = data.edges.map(e => e.id);
    }
  }
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
  const hasArrow = true;

  React.useLayoutEffect(() => {
    const elem = document.getElementById('gi-3d-graph') as HTMLElement;
    const width = elem.offsetWidth;
    const height = elem.offsetHeight;

    console.time('cost deepclone');
    let nodes = deepClone(DATA.nodes).map(n => nodeMapper(n));
    let edges = deepClone(DATA.edges).map(n => edgeMapper(n));
    console.timeEnd('cost deepclone');

    const data = { nodes, links: edges };

    try {
      GraphRef.current = ForceGraph3D()(elem)
        .width(width)
        .height(height)
        .graphData(data)
        .enableNodeDrag(false)
        .nodeAutoColorBy('nodeType')
        .nodeLabel((node: any) => {
          if (node.data.labelShape.text) {
            return node.data.labelShape.text;
          }
          return node.id;
        })

        .linkCurvature((edge: any) => {
          // return 0.4;
          if (edge.data && edge.data.keyShape && edge.data.keyShape.poly) {
            return 0.5;
          }
          return 0.1;
        })
        .onNodeClick((node: any) => {
          const distance = 40;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
          if (GraphRef.current) {
            GraphRef.current.cameraPosition(
              {
                x: node.x * distRatio,
                y: node.y * distRatio,
                z: node.z * distRatio,
              }, // new position
              node, // lookAt ({ x, y, z })
              3000, // ms transition duration
            );
          }
        });
    } catch (error) {
      console.log('error', error);
    }

    // Graph.onNodeRightClick(node => {
    //   setToggle(true);
    //   //只要大数据节点的时候才是添加节点
    //   if (data.nodes.length > largeGraphLimit) {
    //     updateContext(draft => {
    //       const dataFrom3D = {
    //         nodes: [
    //           {
    //             //@ts-ignore
    //             id: node.id,
    //             //@ts-ignore
    //             data: node.data,
    //             //@ts-ignore
    //             style: node.style,
    //           },
    //         ],
    //         edges: [],
    //       };
    //       //@ts-ignore
    //       draft.data = dataFrom3D;
    //     });
    //   }

    //   //@ts-ignore
    //   apis.focusNodeById(node.id);
    // });

    return () => {
      if (GraphRef.current) {
        GraphRef.current._destructor();
      }
    };
  }, []);

  React.useEffect(() => {
    const Graph = GraphRef.current;
    if (!Graph) {
      return;
    }

    const getWidth = (link: any) => {
      const eid = `${link.source.id}_${link.target.id}`;
      if (highlightLinks.indexOf(eid) !== -1) {
        return 2;
      } else {
        return 0;
      }
    };
    const MaterialMap = new Map();
    Graph.backgroundColor(backgroundColor)
      .linkWidth(link => {
        return getWidth(link);
      })
      .linkDirectionalParticles(link => {
        return getWidth(link);
      })
      .linkDirectionalParticleWidth(2)
      .linkColor((edge: any) => {
        const eid = edge.id;
        if (highlightLinks.indexOf(eid) !== -1) {
          return highlightColor;
        }
        if (edge.data && edge.data.keyShape) {
          const { stroke } = edge.data.keyShape;
          return stroke;
        }
      })
      .nodeThreeObject((node: any) => {
        //这里按照GraphinNode的规范
        // if (node.style.icon && node.style.icon.type === 'image') {
        //   const image = node.style.icon.value;
        //   const imgTexture = new THREE.TextureLoader().load(image);
        //   const material = new THREE.SpriteMaterial({ map: imgTexture });
        //   const sprite = new THREE.Sprite(material);
        //   sprite.scale.set(24, 24);
        //   return sprite;
        // }

        let { r, fill } = node.data.keyShape || {
          r: 40,
          fill: '#ddd',
        };

        if (highlightNodes.indexOf(node.id) !== -1) {
          fill = highlightColor;
          r = r * 1.5;
        }

        const geometry = new THREE.SphereGeometry(3, r);
        let material = MaterialMap.get(fill);
        if (!material) {
          material = new THREE.MeshLambertMaterial({
            color: fill,
            transparent: true,
            opacity: 0.75,
          });
          MaterialMap.set(fill, material);
        }
        const circle = new THREE.Mesh(geometry, material);
        return circle;
      });

    if (hasArrow) {
      Graph.linkDirectionalArrowLength(1.5).linkDirectionalArrowRelPos(1);
    }

    if (highlightLinks.length > 0 || highlightLinks.length > 0) {
      updateHighlight(Graph);
    }
  }, [highlightLinks, highlightNodes, GraphRef, hasArrow, highlightColor, backgroundColor]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return ReactDOM.createPortal(
    <AnimateContainer toggle={toggle} maxSize={maxSize} minSize={minSize} placement={placement} offset={offset}>
      <Toolbar
        GIAC={GIAC}
        config={config}
        handleSwitchMap={handleClick} // 切换渲染视图
        handleToggleMap={handleToggle} //大小视图
      ></Toolbar>
      <div
        id="gi-3d-graph"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      ></div>
    </AnimateContainer>,
    document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement,
  );
};

export default LargeGraph;
