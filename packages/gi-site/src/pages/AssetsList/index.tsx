import {
  AppstoreOutlined,
  BgColorsOutlined,
  BranchesOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Button, Empty, Tooltip } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import { getSearchParams } from '../../components/utils';
import { setDefaultAssetPackages } from '../../loader';
import { queryAssetList } from '../../services/assets';
import CartContent from './CartContent';
import Detail from './Detail';
import $i18n from '../../i18n';

setDefaultAssetPackages();

interface AssetsListProps {}

const options = [
  {
    name: $i18n.get({ id: 'gi-site.pages.AssetsList.Component', dm: '组件' }),
    key: 'components',
    icon: <AppstoreOutlined />,
  },
  {
    name: $i18n.get({ id: 'gi-site.pages.AssetsList.Element', dm: '元素' }),
    key: 'elements',
    icon: <BgColorsOutlined />,
  },
  {
    name: $i18n.get({ id: 'gi-site.pages.AssetsList.Layout', dm: '布局' }),
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
  });

  const [visible, setVisible] = React.useState(false);

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
    setVisible(true);
  };

  if (!state.isReady) {
    return null;
  }
  console.log(state.assets, 'ddd');
  const { components, elements, layouts } = state.assets;
  return (
    <>
      <SegmentedTabs
        extra={
          <Tooltip
            title={$i18n.get({
              id: 'gi-site.pages.AssetsList.YouCanQuicklyGenerateA',
              dm: '根据选购的资产清单，可以快速生成画布应用模版',
            })}
          >
            <Button type="primary" onClick={handleClick} icon={<ShoppingCartOutlined />}>
              {$i18n.get({ id: 'gi-site.pages.AssetsList.PurchaseList', dm: '选购清单' })}
            </Button>
          </Tooltip>
        }
        items={[
          {
            key: 'graph-components',
            label: $i18n.get(
              {
                id: 'gi-site.pages.AssetsList.GraphAnalysisAssetComponentslength',
                dm: '图分析资产 {componentsLength}',
              },
              { componentsLength: components.length },
            ),
            children: <Detail data={components} />,
          },
          {
            key: 'graph-elements',
            label: $i18n.get(
              {
                id: 'gi-site.pages.AssetsList.GraphElementAssetElementslength',
                dm: '图元素资产 {elementsLength}',
              },
              { elementsLength: elements.length },
            ),
            children: <Detail data={elements} />,
          },
          {
            key: 'graph-layouts',
            label: $i18n.get(
              {
                id: 'gi-site.pages.AssetsList.LayoutAssetsLayoutslength',
                dm: '图布局资产 {layoutsLength}',
              },
              { layoutsLength: layouts.length },
            ),
            children: <Detail data={layouts} />,
          },

          {
            key: 'location',
            label: $i18n.get({ id: 'gi-site.pages.AssetsList.ListOfGeographicAssets', dm: '地理资产列表' }),
            children: (
              <Empty description={$i18n.get({ id: 'gi-site.pages.AssetsList.UnderConstruction', dm: '正在建设中' })} />
            ),
          },
          {
            key: 'VIP',
            label: $i18n.get({ id: 'gi-site.pages.AssetsList.VipAssets', dm: 'VIP资产' }),
            icon: <GiftOutlined />,
            children: (
              <Empty description={$i18n.get({ id: 'gi-site.pages.AssetsList.UnderConstruction', dm: '正在建设中' })} />
            ),
          },
        ]}
      />

      <CartContent visible={visible} setVisible={setVisible} />
    </>
  );
};

export default AssetsList;
