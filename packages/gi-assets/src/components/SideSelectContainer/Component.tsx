import { CaretDownOutlined } from '@ant-design/icons';
import { Select, Tabs } from 'antd';
import * as React from 'react';
import { getPositionStyles } from '../utils';
import './index.less';
const { TabPane } = Tabs;
const { Option } = Select;
export interface OperatorBarProps {
  placement: string;
  offset: number[];
  GI_CONTAINER: string[];
}

const SideSelectContainer: React.FunctionComponent<OperatorBarProps> = props => {
  //@ts-ignore
  const { components, assets, placement, offset, width, height } = props;
  if (components.length === 0) return null;
  const sortedComponents = components
    .sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX)
    .filter((item: any) => item.props?.GIAC_CONTENT);

  const [state, setState] = React.useState({
    toggle: false,
    activeId: sortedComponents[0]?.id,
  });

  const { activeId } = state;

  const handleToggle = () => {
    setState(preState => {
      return {
        ...preState,
        toggle: !preState.toggle,
      };
    });
  };
  const handleChange = value => {
    setState(preState => {
      return {
        ...preState,
        activeId: value,
      };
    });
  };

  const postionStyles = getPositionStyles(placement, offset);

  const baseStyle = {
    ...postionStyles,
    height,
    width,
    backgroundColor: '#fff',
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

  const { component: ActiveComponent, props: ActiveProps } = assets[activeId];

  return (
    <div style={styles}>
      <div onClick={handleToggle} style={handlerStyles as any}></div>
      <div style={{ width: '100%', overflow: 'hidden' }} className="gi-side-select-container">
        <div className="header">
          <Select
            value={activeId}
            style={{ width: 120 }}
            bordered={false}
            onChange={handleChange}
            suffixIcon={<CaretDownOutlined />}
          >
            {sortedComponents.map((item, index) => {
              if (!item) {
                return null;
              }
              const { props: itemProps, id: itemId } = item;
              return <Option value={itemId}>{itemProps.GIAC_CONTENT.title}</Option>;
            })}
          </Select>
        </div>

        <div className="content">
          <ActiveComponent {...ActiveProps} />
        </div>
      </div>
    </div>
  );
};

export default SideSelectContainer;
