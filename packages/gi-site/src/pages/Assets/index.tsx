import { DeploymentUnitOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Empty, Space } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import { getAssetPackages, setDefaultAssetPackages, type Package } from '../../loader';
import Cards from './Cards';
import './index.less';
import PackageTable from './Table';
import UploadAssets from './Upload';
import ViewMode from './ViewMode';
setDefaultAssetPackages();

interface AssetsCenterProps {}

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const [state, setState] = React.useState<{ isReady: boolean; lists: Package[]; mode: 'card' | 'table' }>({
    isReady: false,
    lists: [],
    mode: 'table',
  });
  React.useEffect(() => {
    const packages = getAssetPackages();
    setState(preState => {
      return {
        ...preState,
        isReady: true,
        lists: packages,
      };
    });
  }, []);

  const handleChangeMode = val => {
    setState(preState => {
      return {
        ...preState,
        mode: val,
      };
    });
  };

  const handleEdit = (umd: string, val: Package) => {
    const packages = getAssetPackages();
    const packageIndex = packages.findIndex(item => item.global === umd);
    packages[packageIndex] = val;

    localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(packages));
    setState(preState => {
      return {
        ...preState,
        lists: [...packages],
      };
    });
  };

  const { lists, mode } = state;
  if (!state.isReady) {
    return null;
  }
  const renderMangeContainer = () => {
    if (mode === 'table') {
      return <PackageTable data={lists} onEdit={handleEdit}></PackageTable>;
    } else {
      return <Cards data={lists}></Cards>;
    }
  };
  return (
    <>
      <SegmentedTabs
        items={[
          { key: 'relation', label: '关系图资产', children: renderMangeContainer(), icon: <DeploymentUnitOutlined /> },
          {
            key: 'location',
            icon: <EnvironmentOutlined />,
            label: '地图资产',
            children: <Empty description="正在建设中" />,
          },
        ]}
        extra={
          <Space>
            <ViewMode value={mode} onChange={handleChangeMode} />
            <UploadAssets></UploadAssets>
          </Space>
        }
      />
    </>
  );
};

export default AssetsCenter;
