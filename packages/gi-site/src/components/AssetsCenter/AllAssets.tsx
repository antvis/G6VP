import { CheckCard } from '@alipay/tech-ui';
import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined } from '@ant-design/icons';
import { Col, Row, Tabs, Typography } from 'antd';
import React from 'react';
import { queryAssetList } from '../../services/assets';
import AssetCard from './Card';
import ComponentsPanel from './Components';
import './index.less';
const { TabPane } = Tabs;
const { Paragraph } = Typography;

interface AssetsCenterProps {
  assetsCenter: any;
  activeAssetsKeys: any;
  onChange: (ref: any) => void;
}
const options = [
  {
    name: '组件',
    key: 'components',
    icon: <AppstoreOutlined />,
  },
  {
    name: '元素',
    key: 'elements',
    icon: <BgColorsOutlined />,
  },
  {
    name: '布局',
    key: 'layouts',
    icon: <BranchesOutlined />,
  },
];

let ref = {
  components: [],
  elements: [],
  layouts: [],
};

const AllAssets: React.FunctionComponent<AssetsCenterProps> = props => {
  const { assetsCenter, activeAssetsKeys, onChange } = props;

  const [state, setState] = React.useState({
    assets: { components: [], elements: [], layouts: [] },
    isReady: false,
  });

  const { assets, isReady } = state;
  React.useEffect(() => {
    (async () => {
      const ASSET_LIST = await queryAssetList();

      setState(preState => {
        return {
          ...preState,
          assets: { ...ASSET_LIST } as any,
          isReady: true,
        };
      });
      ref = { ...activeAssetsKeys };
    })();
  }, [activeAssetsKeys]);

  const handleChange = (key, val) => {
    ref[key] = val;
    onChange && onChange(ref);
  };
  if (!isReady) {
    return null;
  }
  return (
    <div>
      <Tabs defaultActiveKey={assetsCenter.hash}>
        {options.map(category => {
          const { name, key, icon } = category;
          const defaultValue = activeAssetsKeys[key];
          return (
            <TabPane
              tab={
                <span className="gi-assets-center-pane-title">
                  {icon}
                  {name}
                </span>
              }
              key={key}
            >
              {key === 'components' && (
                <ComponentsPanel data={assets[key]} handleChange={handleChange} defaultValue={defaultValue} />
              )}
              {key !== 'components' && (
                <CheckCard.Group
                  multiple
                  onChange={val => {
                    handleChange(key, val);
                  }}
                  defaultValue={defaultValue}
                >
                  <Row
                    gutter={[
                      { xs: 8, sm: 12, md: 12, lg: 12 },
                      { xs: 8, sm: 12, md: 12, lg: 12 },
                    ]}
                    style={{ padding: '8px 0px' }}
                  >
                    {assets[key].map(item => {
                      const { id: AssetId } = item;
                      return (
                        <Col key={AssetId}>
                          <AssetCard {...item}></AssetCard>
                        </Col>
                      );
                    })}
                  </Row>
                </CheckCard.Group>
              )}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default AllAssets;
