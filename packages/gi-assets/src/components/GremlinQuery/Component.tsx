import { CloseOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import GremlinEditor from 'ace-gremlin-editor';
import { Button, Col, Divider, Row } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
//@ts-ignore
import styles from './index.less';

export interface IGremlinQueryProps {
  visible: boolean;
  close: () => void;
  initValue?: string;
  theme?: 'dark' | 'light';
  height?: number;
  showGutter?: boolean;
  serviceId: string;
}

const GremlinQueryPanel: React.FC<IGremlinQueryProps> = ({
  visible,
  close,
  initValue = '',
  theme = 'dark',
  height = 220,
  showGutter = false,
  serviceId,
}) => {
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
      className={styles.gremlineQueryPanel}
      style={{
        visibility: visible ? 'visible' : 'hidden',
        height: 'fit-content',
        position: 'absolute',
        top: '20px',
        left: '20px',
      }}
    >
      <Row className={classNames(styles.header, 'handle')}>
        <Col span={22} className={styles.title}>
          Gremlin 查询
        </Col>
        <Col span={2}>
          <span className={styles.collapseIcon} onClick={close}>
            <CloseOutlined />
          </span>
        </Col>
      </Row>
      <div
        className={styles.contentContainer}
        style={{
          display: 'block',
          visibility: visible ? 'visible' : 'hidden',
        }}
      >
        <div className={styles.blockContainer}>
          <div style={{ marginBottom: 8 }}>请输入 Gremlin 语句：</div>
          <div style={{ border: '1px solid var(--main-editor-border-color)', borderRadius: '2px' }}>
            <GremlinEditor
              theme={theme}
              initValue={editorValue}
              gremlinId="query-analysis"
              height={height}
              showGutter={showGutter}
              onValueChange={value => handleChangeEditorValue(value)}
            />
          </div>
        </div>
      </div>
      <div
        className={styles.buttonContainer}
        style={{
          display: 'block',
          visibility: visible ? 'visible' : 'hidden',
        }}
      >
        <Divider className={styles.divider} />
        <Button className={styles.queryButton} loading={btnLoading} type="primary" onClick={handleClickQuery}>
          查询
        </Button>
      </div>
    </div>
  );
};

export default GremlinQueryPanel;
