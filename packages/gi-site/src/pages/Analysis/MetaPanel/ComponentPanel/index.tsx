import { MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import { CategroyOptions } from '../../../../components/AssetsCenter/constants';
import './index.less';
import RenderForm from './RenderForm';
const { Panel } = Collapse;
const otherCategory = {
  name: '未分类',
  icon: <QuestionCircleOutlined />,
  order: 12,
};
const CategoryHeader = ({ data }) => {
  const { icon, name, id } = data;
  return <div style={{ fontWeight: 'lighter' }}>{name}</div>;
};

/** 组件模块 配置面板 */
const ComponentPanel = props => {
  // const { updateContext } = useContext();
  const { config, components, updateContext } = props;

  const res = React.useMemo(() => {
    return components.reduce((acc, curr) => {
      const { category } = curr;
      const children = acc[category];
      if (children) {
        acc[category] = [...children, curr];
      } else {
        acc[category] = [curr];
      }

      return acc;
    }, {});
  }, [components]);
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

  const handleChange = (assetId, values) => {
    updateContext(draft => {
      draft.config.components.forEach(item => {
        if (item.id === assetId) {
          item.props = values;
        }
      });
    });
  };
  return (
    <div>
      <AssetsCenterHandler title="组件" id="components" />
      <div>
        <Collapse
          defaultActiveKey={categoryKeys}
          expandIcon={({ isActive }) => (
            <MoreOutlined
              rotate={isActive ? 90 : 0}
              style={{
                color: '#ddd',
              }}
            />
          )}
          ghost
          // expandIconPosition="right"
        >
          {categroy.map(categoryItem => {
            const { id: categoryId } = categoryItem;

            return (
              <Panel
                header={<CategoryHeader data={categoryItem} />}
                key={categoryId}
                style={{ padding: '0px' }}
                className="no-padding"
              >
                {res[categoryId].map(item => {
                  return <RenderForm key={item.id} {...item} onChange={handleChange} config={config} />;
                })}
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};

export default ComponentPanel;

// export default React.memo(ComponentPanel, (prevProps, nextProps) => {
//   if (JSON.stringify(prevProps.ACTIVE_ASSETS_KEYS) !== JSON.stringify(nextProps.ACTIVE_ASSETS_KEYS)) {
//     return false;
//   }
//   console.log('prevProps.activeAssetsKeys', prevProps, nextProps);
//   return true;
// });
