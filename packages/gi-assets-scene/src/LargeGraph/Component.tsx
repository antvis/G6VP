import ForceGraph3D from '3d-force-graph';
import { ExpandOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Button } from 'antd';
import * as React from 'react';
import { animated, useSpring } from 'react-spring';
import * as THREE from 'three';
import './index.less';

export interface ILargeGraph {
  serviceId: string;
  visible: boolean;
}

const dataTransfer = data => {
  const nodes = data.nodes.map((node: any) => {
    return {
      id: node.id,
      data: node,
    };
  });
  const edges = data.edges.map((edge: any) => {
    return {
      data: edge,
      source: edge.source,
      target: edge.target,
    };
  });
  return {
    nodes,
    edges,
  };
};
const LargeGraph: React.FunctionComponent<ILargeGraph> = props => {
  //@ts-ignore
  const { services, config, transform, setGiState, dispatch } = GraphinContext;
  const { serviceId, visible } = props;
  const [state, setState] = React.useState({
    toggle: true,
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

  React.useEffect(() => {
    if (!serviceId || !visible) {
      return;
    }
    const { service } = services.find(c => c.id === serviceId);
    if (!service) {
      return;
    }
    const elem = document.getElementById('gi-3d-graph') as HTMLElement;
    service()
      .then(res => res.json())
      .then(res => {
        const { nodes, edges } = transform(dataTransfer(res), config);
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

            const { size, fill } = node.style.keyshape;
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
          .nodeAutoColorBy('dataType')
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
          })
          .onNodeRightClick((node: any) => {
            setToggle(true);
            setGiState(preState => {
              const newData = preState.data;
              newData.nodes.push({ id: node.id, data: node.data });
              return {
                ...preState,
                data: transform(newData, config),
              };
            });
          });

        setState(preState => {
          return {
            ...preState,
            isReady: true,
          };
        });
      });
  }, [serviceId, visible]);

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
  if (!visible) {
    return null;
  }
  return (
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
    </div>
  );
};

export default LargeGraph;
