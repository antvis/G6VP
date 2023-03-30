import { CheckCard } from '@ant-design/pro-components';
import { Col, Collapse, Row } from 'antd';
import * as React from 'react';
import AssetCard from './Card';
import { CategroyOptions, otherCategory } from './constants';

const { Panel } = Collapse;

interface ComponentsPanelProps {
  data: any[];
  handleChange?: (a: any, b: any) => void;
  defaultValue?: any[];
}
const cardContent = item => {
  const { desc, version } = item;
  const pkg = item.pkg.replace('@antv/gi-assets-', '');
  return <div className="asset-detail">{desc}</div>;
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
  console.log('res', res, data, categoryKeys);

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
                    { xs: 8, sm: 12, md: 24, lg: 24 },
                    { xs: 8, sm: 12, md: 12, lg: 12 },
                  ]}
                  style={{ padding: '8px 0px' }}
                >
                  {res[categoryId].map(item => {
                    return (
                      <Col key={item.id}>
                        <AssetCard {...item} />
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
