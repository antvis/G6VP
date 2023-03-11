import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined } from '@ant-design/icons';
import { Empty, Tabs } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import Detail from './Detail';
import { setDefaultAssetPackages } from '../../loader';
import { queryAssetList } from '../../services/assets';
import { getSearchParams } from '../../components/utils';

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

  if (!state.isReady) {
    return null;
  }
  return (
    <>
      <SegmentedTabs
        items={[
          {
            key: 'relation',
            label: '关系资产列表',
            children: (
              <div style={{ height: 'calc(100% - 62px)' }}>
                <Tabs
                  defaultActiveKey={searchParams.get(ASSETS_QUERY_KEY) || options[0].key}
                  items={options.map(x => {
                    return {
                      label: (
                        <span>
                          {x.icon} {x.name}
                        </span>
                      ),
                      key: x.key,
                    };
                  })}
                  onChange={(activeKey: string) => {
                    setState(preState => {
                      return {
                        ...preState,
                        activeKey,
                      };
                    });
                    searchParams.set(ASSETS_QUERY_KEY, activeKey);
                    searchParams.set(ASSETS_KEY, '');
                    window.location.hash = `${path}?${searchParams.toString()}`;
                  }}
                />
                <Detail data={state.assets[state.activeKey]} />
              </div>
            ),
          },
          {
            key: 'location',
            label: '地理资产列表',
            children: <Empty description="正在建设中" />,
          },
        ]}
      />
    </>
  );
};

export default AssetsList;
