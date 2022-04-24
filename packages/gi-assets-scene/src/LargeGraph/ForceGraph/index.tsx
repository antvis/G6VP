import ForceGraph3D from '3d-force-graph';
import { extra, useContext } from '@alipay/graphinsight';
import { ExpandOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { animated, useSpring } from 'react-spring';
import * as THREE from 'three';

const { deepClone } = extra;

export interface ILargeGraph {
  serviceId: string;
  visible: boolean;
}

const LargeGraph: React.FunctionComponent<ILargeGraph> = props => {
  const { updateContext, source: DATA, GISDK_ID, apis } = useContext();

  const [state, setState] = React.useState({
    toggle: false,
    isReady: false,
  });
  const { isReady, toggle } = state;

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
    const { nodes, edges } = DATA;
    const data = { nodes: deepClone(nodes), links: deepClone(edges) };

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
      console.log('click node', node);

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

  const { size, background, ...otherStyles } = useSpring({
    from: {
      size: '100%',
      background: 'hotpink',
    },
    to: {
      size: toggle ? '20%' : '100%',
      background: toggle ? '#ddd' : 'hotpink',
    },
  });

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return ReactDOM.createPortal(
    <div>
      <animated.div
        style={{
          right: '0px',
          bottom: '0px',
          width: size,
          height: size,
          position: 'absolute',
          zIndex: 9,
          ...otherStyles,
        }}
      >
        <Button
          shape="circle"
          icon={<ExpandOutlined />}
          onClick={handleToggle}
          style={{
            position: 'absolute',
            right: '12px',
            top: '12px',
            zIndex: 11,
          }}
        />
        <div id="gi-3d-graph"></div>
      </animated.div>
    </div>,
    document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement,
  );
};

export default LargeGraph;
