import { Card, Col, Row, Tag } from 'antd';
import * as React from 'react';
const { Meta } = Card;

interface CardsProps {
  data: any;
  changeServerId: (val: string) => void;
}

// 已经在官方注册过的资产上架
const defaltDesc = {
  GI: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*3YEZS6qSRgAAAAAAAAAAAAAAARQnAQ',
    title: 'GraphInsight 官网服务',
    desc: 'GraphInsight 提供的数据服务，数据存储在浏览器IndexDB，目前已经支持',
    group: 'GraphInsight 官方',
    color: 'green',
  },
  GS: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*SRjBRZji8RsAAAAAAAAAAAAAARQnAQ',
    title: 'GraphScope 图计算服务',
    desc: '阿里达摩院 GraphScope 提供的大规模图计算服务，可对接集团ODPS，目前已支持',
    group: 'GraphInsight 官方',
    color: '#2281f2',
  },
  AKG: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*jFagT7R_T0UAAAAAAAAAAAAAARQnAQ',
    title: 'AKG 蚂蚁知识图谱服务',
    desc: '由蚂蚁知蛛团队（https://akg.alipay.com）提供的图谱知识服务。目前已支持',
    group: '知蛛前端团队',
    color: '#2f54eb',
  },
  SHASENG: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*HaLlTKJhhagAAAAAAAAAAAAAARQnAQ',
    title: '大安全异常检测服务',
    desc: '由大安全异常检测团队提供的资金网络异常检测服务。目前已支持',
    group: '知蛛前端团队',
    color: '#2f54eb',
  },
};

const MOCK = [
  // {
  //   id: 'AKG',
  //   name: '',
  //   version: '',
  //   pkg: '',
  // },
  // {
  //   id: 'SHASENG',
  //   name: '',
  //   version: '',
  //   pkg: '',
  // },
];

const Cards: React.FunctionComponent<CardsProps> = props => {
  const { data, changeServerId } = props;

  return (
    <div>
      <Row gutter={[16, 16]}>
        {[...data, ...MOCK].map(item => {
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
