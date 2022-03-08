import { CheckCard } from '@alipay/tech-ui';
import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined, RobotOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Row, Tabs, Typography } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../pages/Analysis/redux';
import { queryAssetList } from '../../services/assets';
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
  const state = useSelector((state: StateType) => state);
  const dispatch = useDispatch();
  const { id } = state;

  const { handleCloseAssetsCenter } = useAssetsCenter();
  const { assetsCenter, config, activeAssetsInformation, activeAssetsKeys } = state;
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
      console.log('ASSET_LIST', ASSET_LIST);
      setAssets({ ...ASSET_LIST } as any);
      ref = { ...activeAssetsKeys };
    })();
  }, [id, setAssets, activeAssetsKeys]);
  /** 默认选中config中的components */

  const handleCancel = () => {};
  const handleOk = () => {
    dispatch({
      type: 'update:config',
      activeAssetsKeys: ref,
      assetsCenter: { visible: false },
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

  const cardContent = item => {
    const { version = '最新', ownerNickname = '官方', gmtModified } = item;
    return (
      <div className="asset-detail">
        <ul>
          <li>作者：{ownerNickname}</li>
          <li>版本：{version}</li>
          {/* <li>更新：{moment(gmtModified, 'YYYY-MM-DD HH:mm:ss').fromNow()}</li> */}
        </ul>
        {/* <div className="asset-detail-buttom"> */}
        {/* <div className="asset-favorite">Text</div> */}
        {/* </div> */}
      </div>
    );
  };
  console.log('assets', assets);
  return (
    <div>
      <Drawer
        className="gi-assets-center-drawer"
        title="资产中心"
        placement="right"
        onClose={handleCloseAssetsCenter}
        visible={assetsCenter.visible}
        footer={Footer}
        width={'80%'}
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
                          const { id: AssetId, name: AssetName } = item;
                          return (
                            <Col key={AssetId}>
                              <CheckCard
                                bordered={false}
                                className="assetsCardStyle"
                                title={AssetName}
                                avatar={
                                  <Avatar
                                    style={{ backgroundColor: '#EAEEFC', color: '#3056E3' }}
                                    icon={<RobotOutlined />}
                                    size={24}
                                  />
                                }
                                description={cardContent(item)}
                                value={AssetId}
                              />
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
