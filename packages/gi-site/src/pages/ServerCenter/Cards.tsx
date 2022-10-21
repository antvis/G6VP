import { Card, Col, Row, Tag } from 'antd';
import * as React from 'react';
const { Meta } = Card;

interface CardsProps {
  data: any;
  changeServerId: (val: string) => void;
}

// 已经在官方注册过的资产上架
const defaltDesc = {
  AKG: {
    id: 'AKG',
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*jFagT7R_T0UAAAAAAAAAAAAAARQnAQ',
    name: 'AKG 蚂蚁知识图谱服务',
    desc: '由蚂蚁知蛛团队（https://akg.alipay.com）提供的图谱知识服务。目前已支持',
    group: '知蛛前端团队',
    color: '#2f54eb',
  },
  TUGRAPH: {
    id: 'TUGRAPH',
    name: 'TuGraph 单机版引擎',
    desc: '由 TuGraph 团队提供的单机版图存储服务,支持TB级单机存储，高性能图计算',
    group: 'TuGraph 前端团队',
    color: '#2f54eb',
    cover: 'https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ',
  },
  SHASENG: {
    id: 'SHASENG',
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*HaLlTKJhhagAAAAAAAAAAAAAARQnAQ',
    name: '大安全异常检测服务',
    desc: '由大安全异常检测团队提供的资金网络异常检测服务。目前已支持',
    group: '知蛛前端团队',
    color: '#2f54eb',
  },
};

const defaultEngines = Object.values(defaltDesc);
const Cards: React.FunctionComponent<CardsProps> = props => {
  const { data, changeServerId } = props;

  return (
    <div>
      <Row gutter={[16, 16]}>
        {[...data, ...defaultEngines].map(item => {
          const { id, name, services, cover, desc } = item;

          return (
            <Col key={id} xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt="example"
                    src={cover}
                    onClick={() => {
                      changeServerId(id);
                    }}
                  />
                }
              >
                <div style={{ position: 'relative' }}>
                  <Meta title={name} description={desc}></Meta>
                  <Tag color={'green'} style={{ position: 'absolute', right: '0px', top: '2px' }}>
                    {id}
                  </Tag>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Cards;
