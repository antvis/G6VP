import {
  AliyunOutlined,
  BgColorsOutlined,
  CodeOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  FileExcelOutlined,
  FolderViewOutlined,
  FundProjectionScreenOutlined,
  GiftOutlined,
  LayoutOutlined,
  MacCommandOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { Col, Divider, Row } from 'antd';
import * as React from 'react';
import RadioNote from '../../components/RadioNote';
import $i18n from '../../i18n';
interface IGuideCardsProps {
  history: any;
}
const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--background-color-transparent)',
    borderRadius: '8px',
    margin: '8px',
    textAlign: 'center',
    padding: '24px 0px',
  },
  title: {
    // lineHeight: '40px',
    // height: '40px',
    fontSize: '16px',
    marginBottom: '12px',
  },
  divider: {
    margin: '8px 0',
  },
};

const ITEMS = [
  {
    name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.StepSelectADataSource', dm: 'Step 1：选择数据源' }),
    items: [
      {
        id: 'DEMO',
        icon: <FolderViewOutlined />,
        name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.SampleData', dm: '样例数据' }),
      },
      {
        id: 'FILE',
        icon: <FileExcelOutlined />,
        name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.LocalFile', dm: '本地文件' }),
      },
      {
        id: 'GRAPH',
        icon: <DeploymentUnitOutlined />,
        name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.GraphDatabase', dm: '图数据库' }),
      },
      // {
      //   id: 'GEO',
      //   icon: <EnvironmentOutlined />,
      //   name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.GeographicDatabase', dm: '地理数据库' }),
      // },
    ],
  },
  {
    name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.StepCustomizeTheAnalysisCanvas', dm: 'Step 2：定制分析画布' }),
    items: [
      {
        id: 'STYLE',
        icon: <BgColorsOutlined />,
        name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.VisualMapping', dm: '视觉映射' }),
      },
      {
        id: 'LAYOUT',
        icon: <LayoutOutlined />,
        name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.SetLayout', dm: '设置布局' }),
      },
      {
        id: 'ASSETS',
        icon: <MacCommandOutlined />,
        name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.CombinationAnalysis', dm: '组合分析' }),
      },
      {
        id: 'INSIGHT',
        icon: <FundProjectionScreenOutlined />,
        name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.DiscoveryInsight', dm: '发现洞察' }),
      },
    ],
  },
  // {
  //   name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.StepDiscoverMorePossibilities', dm: 'Step 3：发现更多可能' }),
  //   items: [
  //     {
  //       id: 'AVA',
  //       icon: <RobotOutlined />,
  //       name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.IntelligentInterpretation', dm: '智能解读' }),
  //     },
  //     {
  //       id: 'DEVELOPMENT',
  //       icon: <CodeOutlined />,
  //       name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.CustomDevelopment', dm: '定制开发' }),
  //     },
  //     {
  //       id: 'DEPLOY',
  //       icon: <AliyunOutlined />,
  //       name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.IntegratedDeployment', dm: '集成部署' }),
  //     },
  //     {
  //       id: 'VIP_ASSETS',
  //       icon: <GiftOutlined />,
  //       name: $i18n.get({ id: 'gi-site.pages.Home.GuideCards.VipAssets', dm: 'VIP 资产' }),
  //     },
  //   ],
  // },
];

const GuideCards: React.FunctionComponent<IGuideCardsProps> = props => {
  const { history } = props;
  const onChange = id => {
    if (id === 'DEMO') {
      history.push('/dataset/case');
    }
    if (id === 'FILE') {
      history.push('/dataset/create?type=FILE');
    }
    if (id === 'GRAPH') {
      history.push('/dataset/create?type=GRAPH');
    }
    if (id === 'VIP_ASSETS') {
      history.push('/open/assets-list');
    }
  };
  return (
    <div>
      <Row>
        {ITEMS.map(c => {
          const { name, items } = c;
          return (
            <Col span={8} key={name}>
              <div style={styles.container}>
                <div style={styles.title}> {name}</div>
                <Divider style={styles.divider} />
                <RadioNote items={items} onChange={onChange} />
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default GuideCards;
