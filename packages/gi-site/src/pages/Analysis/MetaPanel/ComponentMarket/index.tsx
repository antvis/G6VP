import { CheckCard } from '@alipay/tech-ui';
import { Button, Col, Drawer, Row } from 'antd';
import * as React from 'react';

interface ComponentMarketProps {
  /** 全量组件 */
  components: any;
  /** dispatch */
  dispatch: any;
  /** 当前的配置 */
  config: any;
}

const ComponentMarket: React.FunctionComponent<ComponentMarketProps> = props => {
  const { components, dispatch, config } = props;
  /** 默认选中config中的components */
  const defaultValue = config.components.map(c => c.id);
  const componentKeys = Object.keys(components).filter(c => {
    return c !== 'graphin-node' && c !== 'graphin-edge';
  });
  const displayComponents = componentKeys.map(key => {
    return components[key];
  });

  const [state, setState] = React.useState({
    value: defaultValue,
    isVisible: false,
  });

  const { value, isVisible } = state;

  const handleChange = checkedValues => {
    setState({
      ...state,
      value: checkedValues,
    });
  };

  const showModal = () => {
    setState(preState => {
      return {
        ...preState,
        isVisible: true,
      };
    });
  };
  const handleCancel = () => {
    setState(preState => {
      return {
        ...preState,
        isVisible: false,
      };
    });
  };
  const handleOk = () => {
    setState(preState => {
      return {
        ...preState,
        isVisible: false,
      };
    });
    const { components: matchComponents } = config;
    const matchComponentIds = matchComponents.map(c => c.id);
    const result = value.map(key => {
      if (matchComponentIds.indexOf(key) !== -1) {
        return matchComponents.find(c => c.id === key);
      }
      const { props, id } = components.find(c => c.id === key);
      return {
        props,
        id,
        enable: true,
      };
    });

    dispatch({
      type: 'update:config',
      /** 需要更新refreshComponentKey，让其强制渲染 */
      refreshComponentKey: Math.random(),
      config: {
        ...config,
        components: result,
      },
    });
  };
  const Footer = (
    <div>
      <Button onClick={handleCancel}>取消</Button>
      <Button onClick={handleOk} type="primary">
        确认
      </Button>
    </div>
  );

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
        自选组件
      </Button>
      <Drawer
        title="组件市场"
        width={'80%'}
        placement="right"
        closable={false}
        onClose={handleCancel}
        visible={isVisible}
        footer={Footer}
      >
        <CheckCard.Group multiple onChange={handleChange} defaultValue={value}>
          <Row
            gutter={[
              { xs: 8, sm: 16, md: 16, lg: 16 },
              { xs: 8, sm: 16, md: 16, lg: 16 },
            ]}
          >
            {displayComponents.map(c => {
              const { id, name } = c;
              return (
                <Col key={id}>
                  <CheckCard title={name} description="GI提供的组件" value={id} />
                </Col>
              );
            })}
          </Row>
        </CheckCard.Group>
      </Drawer>
    </div>
  );
};

export default ComponentMarket;
