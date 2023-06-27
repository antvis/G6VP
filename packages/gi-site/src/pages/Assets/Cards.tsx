import { Card, Col, Row, Tag, Typography } from 'antd';
import * as React from 'react';
import $i18n from '../../i18n';

const { Meta } = Card;
const { Paragraph } = Typography;

interface CardsProps {
  data: any;
}

// 已经在官方注册过的资产上架
const CARD_MAP = {
  GI_ASSETS_AKG: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*jFagT7R_T0UAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.AntKnowledgeGraph', dm: '蚂蚁知识图谱' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.ExcellentAssetsInKnowledgeReasoning',
      dm: '包含算法分析，DSL语言查询，融合分析等知识推理场景下的精品资产',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.KnowSpiderFrontEndTeam', dm: '知蛛前端团队' }),
    color: '#2f54eb',
  },
  GI_ASSETS_YUQUE: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*qP9PRLYCpwUAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.YuqueKnowledgeNetwork', dm: '语雀知识网络' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.ContainsAssetsSuchAsNodes',
      dm: '包含语雀知识网络下的节点，边，交互等资产',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.YuqueFrontEndTeam', dm: '语雀前端团队' }),
    color: '#87d068',
  },
  GI_ASSETS_SECURITY: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*NWl9TYq8tQkAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.AntSecurity', dm: '蚂蚁大安全域' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.IncludingCaseAnalysisMoneyLaundering',
      dm: '包含安全风控领域下案件分析，洗钱分析，等精品分析资产',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.LargeSecurityFrontEndTeam', dm: '大安全前端团队' }),
    color: '#8171ff',
  },
  GI_ASSETS_GRAPHSCOPE: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*SRjBRZji8RsAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.GraphComputingEngineStandaloneVersion',
      dm: '图计算引擎（单机版）',
    }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.IncludesAssetModulesSuchAs',
      dm: '包含运维管理，集群管理，数据管理，部署概览等资产模块',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GraphscopeOfficial', dm: 'GraphScope 官方' }),
    color: '#2281f2',
  },
  GI_ASSETS_TUGRAPH: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GraphDatabaseStandalone', dm: '图数据库（单机版）' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.SupportsTbLevelStandAlone',
      dm: '支持TB级单机存储，高性能图计算，支持 Cypher 语句查询',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.TugraphOfficial', dm: 'TuGraph 官方' }),
    color: '#2281f2',
  },
  GeaMakerGraphStudio: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*yDeARar2jLIAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.AntGraphDatabase', dm: '蚂蚁图数据库' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.IncludesAssetModulesSuchAs.3',
      dm: '包含 Gremlin查询，高级查询，可视化建模等资产模块',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GeamakerFrontEndTeam', dm: 'GeaMaker 前端团队' }),
    color: '#091e35',
  },
  GI_ASSETS_GEAMAKER: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*yDeARar2jLIAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.AntGraphDatabase', dm: '蚂蚁图数据库' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.IncludesAssetModulesSuchAs.3',
      dm: '包含 Gremlin查询，高级查询，可视化建模等资产模块',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GeamakerFrontEndTeam', dm: 'GeaMaker 前端团队' }),
    color: '#091e35',
  },
  GI_ASSETS_NEO4J: {
    cover: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6NRERpsvzMcAAAAAAAAAAAAADmJ7AQ/original',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.NeoJGraphDatabase', dm: 'Neo4j 图数据库' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.IncludesAssetModulesSuchAs.3',
      dm: '包含 Gremlin查询，高级查询，可视化建模等资产模块',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GVpFrontEndTeam', dm: 'G6VP 前端团队' }),
    color: '#091e35',
  },
  GI_ASSETS_BASIC: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.BasicAnalysisAssets', dm: '基础分析资产' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.BuiltInBasicLayoutBasic',
      dm: '内置 20+ 基础布局，基础交互，元素样式，系统交互，基础容器等资产',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GVpOfficial', dm: 'G6VP 官方' }),
    color: 'green',
  },
  GI_ASSETS_ADVANCE: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.AdvancedAnalysisAssets', dm: '高级分析资产' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.BuiltInGraphAnalysisAdvanced',
      dm: '内置 10+ 图分析高级资产：过滤，邻居查询，路径分析，多画布分析等',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GVpOfficial', dm: 'G6VP 官方' }),
    color: 'blue',
  },
  GI_ASSETS_SCENE: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.ScenarioAnalysisAssets', dm: '场景分析资产' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.BuiltInDBigPicture',
      dm: '内置 3D大图分析，地理交互分析，时序分析等场景分析资产',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GVpOfficial', dm: 'G6VP 官方' }),
    color: 'red',
  },
  GI_ASSETS_ALGORITHM: {
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*wnCMQpZDfAQAAAAAAAAAAAAAARQnAQ',
    title: $i18n.get({ id: 'gi-site.pages.Assets.Cards.AlgorithmAnalysisAssets', dm: '算法分析资产' }),
    desc: $i18n.get({
      id: 'gi-site.pages.Assets.Cards.BuiltInNodeClusteringNode',
      dm: '内置 节点聚类，节点相似性分析，社区发现，模式匹配等 6+ 算法分析资产',
    }),
    group: $i18n.get({ id: 'gi-site.pages.Assets.Cards.GVpOfficial', dm: 'G6VP 官方' }),
    color: 'purple',
  },
};

const Cards: React.FunctionComponent<CardsProps> = props => {
  const { data } = props;

  return (
    <div>
      <Row gutter={[16, 16]}>
        {data.map(item => {
          const { global, name, url, version } = item;
          console.log('item', item);
          const extraInfo = CARD_MAP[global] || {
            title: name,
            desc: $i18n.get(
              {
                id: 'gi-site.pages.Assets.Cards.TheGlobalVariableIsGlobal',
                dm: '全局变量为: {global}',
              },
              { global: global },
            ),
            group: 'unkown',
            cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
            color: '#000',
          };
          const { title, desc, group, cover, color } = extraInfo;

          return (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={global}>
              <Card
                hoverable
                cover={<img alt="example" src={cover} style={{ objectFit: 'cover', aspectRatio: '16/9' }} />}
              >
                <div style={{ position: 'relative' }}>
                  <Meta
                    title={title}
                    description={
                      <Paragraph
                        style={{ height: 45, margin: 0 }}
                        ellipsis={{ rows: 2, expandable: false, tooltip: desc }}
                      >
                        {desc}
                      </Paragraph>
                    }
                  ></Meta>
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
