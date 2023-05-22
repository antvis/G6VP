import {
  AppstoreOutlined,
  BgColorsOutlined,
  BranchesOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Button, Empty, Modal } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import { getSearchParams } from '../../components/utils';
import { setDefaultAssetPackages } from '../../loader';
import { queryAssetList } from '../../services/assets';
import CartContent from './CartContent';
import Detail from './Detail';

setDefaultAssetPackages();

interface AssetsListProps {}

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
const ASSETS_QUERY_KEY = 'assetsTab';
export const ASSETS_KEY = 'assetKey';

const AssetsList: React.FunctionComponent<AssetsListProps> = () => {
  const { searchParams, path } = getSearchParams(window.location);
  const [state, setState] = React.useState({
    assets: { components: [], elements: [], layouts: [] },
    activeKey: searchParams.get(ASSETS_QUERY_KEY) || options[0].key,
    isReady: false,
    modalVisible: false,
  });

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
      // 获取所有资产列表的信息，生成资产配置信息的 cdn 信息，存放在 gi-mock-data 中的 assets.json 中，修改后记得发布哦！！
      // console.log(
      //   '~~~~~',
      //   ASSET_LIST.components.concat(ASSET_LIST.elements, ASSET_LIST.layouts).reduce((acc, curr) => {
      //     return {
      //       ...acc,
      //       [curr.id]: {
      //         id: curr.id,
      //         name: curr.name,
      //         type: curr.type,
      //         docs: '',
      //         icon: curr.icon,
      //         category: curr.category,
      //       },
      //     };
      //   }, {}),
      // );
    })();
  }, []);

  const handleClick = () => {
    setState(preState => {
      return {
        ...preState,
        modalVisible: true,
      };
    });
  };

  if (!state.isReady) {
    return null;
  }

  return (
    <>
      <SegmentedTabs
        extra={
          <Button type="primary" onClick={handleClick} icon={<ShoppingCartOutlined />}>
            选购清单
          </Button>
        }
        items={[
          {
            key: 'graph-components',
            label: '图分析资产',
            children: <Detail data={state.assets['components']} />,
          },
          {
            key: 'graph-elements',
            label: '图元素资产',
            children: <Detail data={state.assets['elements']} />,
          },
          {
            key: 'graph-layouts',
            label: '图布局资产',
            children: <Detail data={state.assets['layouts']} />,
          },

          {
            key: 'location',
            label: '地理资产列表',
            children: <Empty description="正在建设中" />,
          },
          {
            key: 'VIP',
            label: 'VIP资产',
            icon: <GiftOutlined />,
            children: <Empty description="正在建设中" />,
          },
        ]}
      />

      <Modal
        title="选购清单"
        width={'600px'}
        visible={state.modalVisible}
        open={state.modalVisible}
        onCancel={() => {
          setState(preState => {
            return {
              ...preState,
              modalVisible: false,
            };
          });
        }}
        closable
      >
        <CartContent />
      </Modal>
    </>
  );
};

export default AssetsList;
