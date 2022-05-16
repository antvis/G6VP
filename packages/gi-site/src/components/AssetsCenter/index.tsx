import { CheckCard } from '@alipay/tech-ui';
import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row, Tabs, Typography } from 'antd';
import React from 'react';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import { queryAssetList } from '../../services/assets';
import AssetCard from './Card';
import ComponentsPanel from './Components';
import './index.less';
import useAssetsCenter from './useHook';
const { TabPane } = Tabs;
const { Paragraph } = Typography;

interface AssetsCenterProps {}
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

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const { context, updateContext } = useContext();

  const { id } = context;

  const { handleCloseAssetsCenter } = useAssetsCenter();
  const { assetsCenter, config, activeAssetsInformation, activeAssetsKeys } = context;

  const [assets, setAssets] = React.useState({
    components: [],
    elements: [],
    layouts: [],
  });
  React.useEffect(() => {
    (async () => {
      const ASSET_LIST = await queryAssetList({
        projectId: id,
      });
      // console.log('ASSET_LIST', ASSET_LIST);
      setAssets({ ...ASSET_LIST } as any);
      ref = { ...activeAssetsKeys };
    })();
  }, [id, setAssets, activeAssetsKeys]);
  /** 默认选中config中的components */

  const handleCancel = () => {};
  const handleOk = () => {
    updateContext(draft => {
      draft.activeAssetsKeys = ref;
      draft.assetsCenter = { visible: false };
    });
  };
  const Footer = (
    <div>
      <Button onClick={handleCancel} size="small" style={{ borderRadius: 4, marginRight: 8 }}>
        取消
      </Button>
      <Button onClick={handleOk} type="primary" size="small" style={{ borderRadius: 4 }}>
        确认
      </Button>
    </div>
  );
  const handleChange = (key, val) => {
    ref[key] = val;
  };

  return (
    <div>
      <Drawer
        className="gi-assets-center-drawer"
        title="资产中心"
        placement="right"
        onClose={handleCloseAssetsCenter}
        visible={assetsCenter.visible}
        footer={Footer}
        width="calc(100vw - 382px)"
      >
        {assetsCenter.visible && (
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
        )}
      </Drawer>
    </div>
  );
};

export default AssetsCenter;
