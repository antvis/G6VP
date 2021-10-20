import { CheckCard } from '@alipay/tech-ui';
import { Button, Col, Drawer, Row, Tabs } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../pages/Analysis/redux';
import { queryAssetList } from '../../services/assets';
import useAssetsCenter from './useHook';

const { TabPane } = Tabs;

interface AssetsCenterProps {}
const options = [
  {
    name: '组件',
    key: 'components',
  },
  {
    name: '元素',
    key: 'elements',
  },
  {
    name: '布局',
    key: 'layouts',
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
      setAssets({ ...ASSET_LIST, layouts: [] });
      ref = activeAssetsKeys;
    })();
  }, [id, setAssets, activeAssetsKeys]);
  /** 默认选中config中的components */

  console.log(assetsCenter, 'assetsCenter', state);

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
      <Button onClick={handleCancel}>取消</Button>
      <Button onClick={handleOk} type="primary">
        确认
      </Button>
    </div>
  );
  const handleChange = (key, val) => {
    console.log(key, val);
    ref[key] = val;
    console.log('ref', ref);
  };
  console.log(options, assets, ref);
  return (
    <div>
      <Drawer
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
              const { name, key } = category;
              const defaultValue = activeAssetsKeys[key];
              return (
                <TabPane tab={name} key={key}>
                  <CheckCard.Group
                    multiple
                    onChange={val => {
                      handleChange(key, val);
                    }}
                    defaultValue={defaultValue}
                  >
                    <Row
                      gutter={[
                        { xs: 8, sm: 16, md: 16, lg: 16 },
                        { xs: 8, sm: 16, md: 16, lg: 16 },
                      ]}
                    >
                      {assets[key].map(c => {
                        const { id: AssetId, name: AssetName } = c;
                        return (
                          <Col key={AssetId}>
                            <CheckCard title={AssetName} description="GI官方资产" value={AssetId} />
                          </Col>
                        );
                      })}
                    </Row>
                  </CheckCard.Group>
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
