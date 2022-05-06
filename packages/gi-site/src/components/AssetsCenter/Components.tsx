import { Icon } from '@alipay/graphinsight';
import { CheckCard } from '@alipay/tech-ui';
import {
  BarChartOutlined,
  BgColorsOutlined,
  BranchesOutlined,
  CarryOutOutlined,
  ConsoleSqlOutlined,
  InsertRowBelowOutlined,
  PieChartOutlined,
  QuestionCircleOutlined,
  SelectOutlined,
  SlackOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Collapse, Row, Tag } from 'antd';
import * as React from 'react';

const { Panel } = Collapse;

interface ComponentsPanelProps {
  data: any[];
  handleChange?: (a: any, b: any) => void;
  defaultValue?: any[];
}
const COLOR_MAP = {
  basic: 'green',
  advance: 'volcano',
  scene: 'purple',
  undefined: '#f50',
};
const cardContent = item => {
  console.log('item', item);
  const { desc, version } = item;
  const pkg = item.pkg.replace('@alipay/gi-assets-', '');
  return <div className="asset-detail">{desc}</div>;
};

const CategroyOptions = {
  'container-components': {
    name: '容器组件',
    icon: <InsertRowBelowOutlined />,
    order: 1,
  },
  'canvas-interaction': {
    name: '画布交互',
    icon: <SelectOutlined />,
    order: 2,
  },
  'element-interaction': {
    name: '元素交互',
    icon: <PieChartOutlined />,
    order: 3,
  },
  'node-interaction': {
    name: '节点交互',
    icon: <PieChartOutlined />,
    order: 3,
  },
  'system-interaction': {
    name: '系统交互',
    icon: <SlackOutlined />,
    order: 4,
  },
  'styling-analysis': {
    name: '样式分析',
    icon: <BgColorsOutlined />,
    order: 5,
  },
  'data-analysis': {
    name: '数据分析',
    icon: <BarChartOutlined />,
    order: 6,
  },

  'layout-analysis': {
    name: '布局分析',
    icon: <BranchesOutlined />,
    order: 7,
  },
  'data-query': {
    name: '数据查询',
    icon: <ConsoleSqlOutlined />,
    order: 8,
  },
  'algorithm-analysis': {
    name: '算法分析',
    icon: <PieChartOutlined />,
    order: 9,
  },
  'scene-analysis': {
    name: '场景分析',
    icon: <PieChartOutlined />,
    order: 10,
  },
  workbook: {
    name: '工作簿',
    icon: <CarryOutOutlined />,
    order: 11,
  },
};
const otherCategory = {
  name: '未分类',
  icon: <QuestionCircleOutlined />,
  order: 12,
};
const CategoryHeader = ({ data }) => {
  const { icon, name, id } = data;
  return (
    <div>
      {icon} {name}
    </div>
  );
};

const ComponentsPanel: React.FunctionComponent<ComponentsPanelProps> = props => {
  const { data, handleChange, defaultValue } = props;
  console.log('data', data);
  const res = React.useMemo(() => {
    return data.reduce((acc, curr) => {
      const { category } = curr;
      const children = acc[category];
      if (children) {
        acc[category] = [...children, curr];
      } else {
        acc[category] = [curr];
      }

      return acc;
    }, {});
  }, [data]);
  const categoryKeys = Object.keys(res);
  const categroy = React.useMemo(() => {
    return categoryKeys
      .map(c => {
        return { id: c, ...(CategroyOptions[c] || otherCategory) };
      })
      .sort((a, b) => {
        return a.order - b.order;
      });
  }, [categoryKeys]);

  return (
    <div>
      <CheckCard.Group
        multiple
        onChange={val => {
          handleChange && handleChange('components', val);
        }}
        defaultValue={defaultValue}
      >
        <Collapse defaultActiveKey={categoryKeys} ghost>
          {categroy.map(categoryItem => {
            const { id: categoryId } = categoryItem;
            return (
              <Panel header={<CategoryHeader data={categoryItem} />} key={categoryId}>
                <Row
                  gutter={[
                    { xs: 8, sm: 12, md: 12, lg: 12 },
                    { xs: 8, sm: 12, md: 12, lg: 12 },
                  ]}
                  style={{ padding: '8px 0px' }}
                >
                  {res[categoryId].map(item => {
                    const { id: AssetId, name: AssetName, version, icon = 'icon-robot' } = item;
                    const pkg = item.pkg.replace('@alipay/gi-assets-', '');

                    return (
                      <Col key={AssetId}>
                        <CheckCard
                          bordered={false}
                          className="assetsCardStyle"
                          title={
                            <div
                              style={{
                                width: '224px',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              {AssetName}
                              <Tag
                                color={COLOR_MAP[pkg]}
                                style={{
                                  fontSize: '12px',
                                  transform: 'scale(0.8)',
                                }}
                              >
                                {pkg}@{version}
                              </Tag>
                            </div>
                          }
                          avatar={
                            <Avatar
                              style={{ backgroundColor: '#EAEEFC', color: '#3056E3' }}
                              icon={<Icon type={icon} />}
                              size={48}
                            ></Avatar>
                          }
                          description={cardContent(item)}
                          value={AssetId}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Panel>
            );
          })}
        </Collapse>
      </CheckCard.Group>
    </div>
  );
};

export default ComponentsPanel;
