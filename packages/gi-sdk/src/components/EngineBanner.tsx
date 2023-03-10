import { Icon } from '@antv/gi-common-components';
import { Button, Col, Row } from 'antd';
import React from 'react';

export interface EngineBannerProps {
  logo: string;
  title: string;
  desc: string;
  docs?: string;
  style?: React.CSSProperties;
}

const EngineBanner: React.FC<EngineBannerProps> = props => {
  const { logo, title, desc, docs, style } = props;

  return (
    <Row
      style={{
        background: 'rgb(245, 248, 255)',
        transition: 'all 0.3s ease 0s',
        padding: '24px 0px',
        ...style,
      }}
    >
      <Col
        span={12}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <img width={'250px'} src={logo} alt="" />
      </Col>
      <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>{title}</h2>
        <p>{desc}</p>
        <p>
          <Button
            type="primary"
            icon={<Icon type="icon-book" />}
            size="small"
            onClick={() => {
              docs && window.open(docs);
            }}
          >
            使用文档
          </Button>
        </p>
      </Col>
    </Row>
  );
};

export default EngineBanner;
