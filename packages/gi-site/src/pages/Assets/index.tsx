import { Card, Space } from 'antd';
import * as React from 'react';
import AllAssets from '../../components/AssetsCenter/AllAssets';
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
  return (
    <>
      <Card
        title="资产管理"
        extra={
          <Space>
            <ViewMode value={mode} onChange={handleChangeMode} />
            <UploadAssets></UploadAssets>
          </Space>
        }
      >
        {mode === 'table' && <PackageTable data={lists}></PackageTable>}
        {mode === 'card' && <Cards data={lists}></Cards>}
      </Card>
      <Card title="资产列表" style={{ margin: '12px 0px' }}>
        <AllAssets assetsCenter={{ hash: 'components' }} activeAssetsKeys={[]} onChange={() => {}} />
      </Card>
    </>
  );
};

export default AssetsCenter;
