import * as React from 'react';
import { bind } from 'size-sensor';
import { useContext } from './context';
interface SizeSensorProps {}

const SizeSensor: React.FunctionComponent<SizeSensorProps> = props => {
  const { GISDK_ID, graph } = useContext();
  React.useEffect(() => {
    const container = document.getElementById(`${GISDK_ID}-graphin-container`);
    const unbind = bind(container, element => {
      if (element) {
        const { clientHeight, clientWidth } = element;
        graph.changeSize(clientWidth, clientHeight);
        graph.autoPaint();
      }
    });
    return () => {
      unbind();
    };
  }, [graph]);
  return null;
};

export default SizeSensor;
