import { CloseOutlined, SubnodeOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Button, Col, Divider, Row, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.less';

export interface IGremlinQueryProps {
  visible: boolean;
  onClose: () => void;
  initValue?: string;
  theme?: 'dark' | 'light';
  height?: number;
  showGutter?: boolean;
  serviceId: string;
  style?: React.CSSProperties;
}

const GremlinQueryPanel: React.FC<IGremlinQueryProps> = ({
  visible,
  onClose,
  initValue = '',
  theme = 'dark',
  height = 220,
  showGutter = false,
  serviceId,
  style,
}) => {
  console.log('style', style);
  const { services, dispatch } = GraphinContext as any;

  const [editorValue, setEditorValue] = useState(initValue || '');

  const handleChangeEditorValue = (value: string) => {
    setEditorValue(value);
  };

  const [btnLoading, setBtnLoading] = useState(false);

  const handleClickQuery = async () => {
    setBtnLoading(true);

    const { service } = services.find(sr => sr.id === serviceId);
    if (!service) {
      return;
    }

    const result = await service({
      value: editorValue,
    });

    setBtnLoading(false);
    if (!result) {
      return null;
    }

    dispatch.changeData(result);
  };

  return (
    <div
      className={'gremlineQueryPanel'}
      style={{
        visibility: visible ? 'visible' : 'hidden',
        height: 'fit-content',
        position: 'absolute',
        ...style,
      }}
    >
      <Row className={classNames('header', 'handle')}>
        <Col span={22} className={'title'}>
          Gremlin 查询
        </Col>
        <Col span={2}>
          <span className={'collapseIcon'} onClick={onClose}>
            <CloseOutlined />
          </span>
        </Col>
      </Row>
      <div
        className={'contentContainer'}
        style={{
          display: 'block',
          visibility: visible ? 'visible' : 'hidden',
        }}
      >
        <div className={'blockContainer'}>
          <div style={{ marginBottom: 8 }}>请输入 Gremlin 语句：</div>
          <div style={{ border: '1px solid var(--main-editor-border-color)', borderRadius: '2px' }}>
            {/* <GremlinEditor
              theme={theme}
              initValue={editorValue}
              gremlinId="query-analysis"
              height={height}
              showGutter={showGutter}
              onValueChange={value => handleChangeEditorValue(value)}
            /> */}
          </div>
        </div>
      </div>
      <div
        className={'buttonContainer'}
        style={{
          display: 'block',
          visibility: visible ? 'visible' : 'hidden',
        }}
      >
        <Divider className={'divider'} />
        <Button className={'queryButton'} loading={btnLoading} type="primary" onClick={handleClickQuery}>
          查询
        </Button>
      </div>
    </div>
  );
};
export interface GIContianerProps {
  color: string;
  hasDivider: boolean;
  placement: 'LT' | 'RT' | 'LB' | 'RB';
  offset: [number, number];
}
const getPositionStyles = (placement, offset: number[]) => {
  const styles: { [key: string]: string } = {
    position: 'absolute',
  };
  const [offsetX, offsetY] = offset;
  if (placement === 'RT') {
    styles.right = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LT') {
    styles.left = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LB') {
    styles.left = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  if (placement === 'RB') {
    styles.right = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  return styles;
};

const WrapGIContainer = Component => {
  return (props: IGremlinQueryProps & GIContianerProps) => {
    const { visible: defaultVisible, color, hasDivider, placement, offset } = props;
    const [visible, setVisible] = React.useState(defaultVisible);

    React.useEffect(() => {
      setVisible(defaultVisible);
    }, [defaultVisible]);
    const onClick = () => {
      setVisible(!visible);
    };
    const onClose = () => {
      setVisible(false);
    };
    const styles = getPositionStyles(placement, offset);

    return (
      <>
        <div onClick={onClick}>
          <Tooltip title="Gremlin 查询" color={color} key={color}>
            <Button type="text" icon={<SubnodeOutlined />}>
              Gremlin 查询
            </Button>
          </Tooltip>
          {hasDivider && <Divider type="vertical" />}
        </div>

        {ReactDOM.createPortal(
          <Component {...props} visible={visible} onClose={onClose} style={styles} />,
          //@ts-ignore
          document.getElementById('graphin-container'),
        )}
      </>
    );
  };
};

export default WrapGIContainer(GremlinQueryPanel);
