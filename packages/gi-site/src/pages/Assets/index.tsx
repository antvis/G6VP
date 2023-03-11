import { Space, Empty } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import { getAssetPackages, setDefaultAssetPackages } from '../../loader';
import Cards from './Cards';
import './index.less';
import PackageTable from './Table';
import UploadAssets from './Upload';
import ViewMode from './ViewMode';
setDefaultAssetPackages();

interface AssetsCenterProps {}

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const [state, setState] = React.useState({
    isReady: false,
    lists: [],
    mode: 'card' as 'card' | 'table',
  });
  React.useEffect(() => {
    const packages = getAssetPackages();
    //@ts-ignore
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

  const { lists, mode } = state;
  if (!state.isReady) {
    return null;
  }
  const renderMangeContainer = () => {
    if (mode === 'table') {
      return <PackageTable data={lists}></PackageTable>;
    } else {
      return <Cards data={lists}></Cards>;
    }
  };
  return (
    <>
      <SegmentedTabs
        items={[
          { key: 'relation', label: '关系资产', children: renderMangeContainer() },
          {
            key: 'location',
            label: '地理资产',
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
