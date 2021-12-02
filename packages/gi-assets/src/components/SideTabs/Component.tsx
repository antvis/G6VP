import { Tabs } from 'antd';
import * as React from 'react';
import { getPositionStyles } from '../utils';
import './index.less';
const { TabPane } = Tabs;
export interface OperatorBarProps {
  placement: string;
  offset: number[];
  GI_CONTAINER: string[];
}

const SideTabs: React.FunctionComponent<OperatorBarProps> = props => {
  const [state, setState] = React.useState({
    toggle: false,
  });
  //@ts-ignore
  const { components, assets, placement, offset, width, height } = props;

  const sortedComponents = components
    .sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX)
    .filter((item: any) => item.props?.GIAC_CONTENT);

  const handleToggle = () => {
    setState(preState => {
      return {
        toggle: !preState.toggle,
      };
    });
  };

  const postionStyles = getPositionStyles(placement, offset);

  const baseStyle = {
    ...postionStyles,
    height,
    width,
    backgroundColor: '#fff',
    padding: '8px',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };
  const styles = state.toggle ? { ...baseStyle, width: '0px' } : baseStyle;
  const handlerStyles: React.CSSProperties = {
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: ' translate(0%, -50%)',
    height: '80px',
    width: '38px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    borderTop: '20px solid transparent',
    borderBottom: '20px solid transparent',
    borderLeft: '30px solid #ddd',
    borderRight: '20px solid transparent',
  };
  return (
    <div style={styles}>
      <div onClick={handleToggle} style={handlerStyles as any}></div>
      <Tabs defaultActiveKey="1">
        {sortedComponents.map((item, index) => {
          if (!item) {
            return null;
          }
          const { props: itemProps, id: itemId } = item;
          const { component: Component } = assets[itemId];
          return (
            <TabPane key={index} tab={itemProps.GIAC_CONTENT.title}>
              <Component {...itemProps} />
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default SideTabs;
