import { Card, Col, Row, Tag } from 'antd';
import * as React from 'react';
const { Meta } = Card;

interface CardsProps {
  data: any;
}

// 已经在官方注册过的资产上架
const CARD_MAP = {
  GI_ASSETS_AKG: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*jFagT7R_T0UAAAAAAAAAAAAAARQnAQ',
    title: '蚂蚁知识图谱',
    desc: '包含算法分析，DSL语言查询，融合分析等知识推理场景下的精品资产',
    group: '知蛛前端团队',
    color: '#2f54eb',
  },
  GI_ASSETS_YUQUE: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*qP9PRLYCpwUAAAAAAAAAAAAAARQnAQ',
    title: '语雀知识网络',
    desc: '包含语雀知识网络下的节点，边，交互等资产',
    group: '语雀前端团队',
    color: '#87d068',
  },
  GI_ASSETS_SECURITY: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*NWl9TYq8tQkAAAAAAAAAAAAAARQnAQ',
    title: '蚂蚁大安全域',
    desc: '包含安全风控领域下案件分析，洗钱分析，等精品分析资产',
    group: '大安全前端团队',
    color: '#8171ff',
  },
  GI_ASSETS_GS: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*SRjBRZji8RsAAAAAAAAAAAAAARQnAQ',
    title: '图计算引擎',
    desc: '包含运维管理，集群管理，数据管理，部署概览等资产模块',
    group: 'GraphInsight 官方',
    color: '#2281f2',
  },
  GeaMakerGraphStudio: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*yDeARar2jLIAAAAAAAAAAAAAARQnAQ',
    title: '蚂蚁图数据库',
    desc: '包含 Gremlin查询，高级查询，可视化建模等资产模块',
    group: 'GeaMaker 前端团队',
    color: '#091e35',
  },
  GI_ASSETS_GEAMAKER: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*yDeARar2jLIAAAAAAAAAAAAAARQnAQ',
    title: '蚂蚁图数据库',
    desc: '包含 Gremlin查询，高级查询，可视化建模等资产模块',
    group: 'GeaMaker 前端团队',
    color: '#091e35',
  },
  GI_ASSETS_BASIC: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: '基础分析资产',
    desc: '内置 20+ 基础布局，基础交互，元素样式，系统交互，基础容器等资产',
    group: 'GraphInsight 官方',
    color: 'green',
  },
  GI_ASSETS_ADVANCE: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: '高级分析资产',
    desc: '内置 10+ 图分析高级资产：过滤，邻居查询，路径分析，多画布分析等',
    group: 'GraphInsight 官方',
    color: 'blue',
  },
  GI_ASSETS_SCENE: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: '场景分析资产',
    desc: '内置 3D大图分析，地理交互分析，时序分析等场景分析资产',
    group: 'GraphInsight 官方',
    color: 'red',
  },
  GI_ASSETS_ALGORITHM: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: '算法分析资产',
    desc: '内置 节点聚类，节点相似性分析，社区发现，模式匹配等 6+ 算法分析资产',
    group: 'GraphInsight 官方',
    color: 'purple',
  },
};

const Cards: React.FunctionComponent<CardsProps> = props => {
  const { data } = props;
  console.log('data', data);
  return (
    <div>
      <Row gutter={[16, 16]}>
        {data.map(item => {
          const { global, name, url, version } = item;
          const extraInfo = CARD_MAP[global] || {
            title: name,
            desc: `全局变量为: ${global}`,
            group: 'unkown',
            cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
            color: '#000',
          };
          const { title, desc, group, cover, color } = extraInfo;
          console.log('cover', cover);
          return (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={global}>
              <Card hoverable cover={<img alt="example" src={cover} />}>
                <div style={{ position: 'relative' }}>
                  <Meta title={title} description={desc}></Meta>
                  <Tag color={color} style={{ position: 'absolute', right: '0px', top: '2px' }}>
                    {`${group}@${version}`}
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
