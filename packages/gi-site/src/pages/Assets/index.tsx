import { Card } from 'antd';
import * as React from 'react';
import AllAssets from '../../components/AssetsCenter/AllAssets';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { getAssetPackages, setDefaultAssetPackages } from '../../loader';
import './index.less';
import PackageTable from './Table';
import UploadAssets from './Upload';
setDefaultAssetPackages();

interface AssetsCenterProps {}

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const [state, setState] = React.useState({
    isReady: false,
    lists: [],
  });
  React.useEffect(() => {
    const packages = getAssetPackages();
    setState({
      isReady: true,
      //@ts-ignore
      lists: packages,
    });
  }, []);

  const { lists } = state;
  if (!state.isReady) {
    return null;
  }
  return (
    <>
      <BaseNavbar active="assets"></BaseNavbar>
      <div className="gi-assets-container">
        <Card title="资产管理" extra={<UploadAssets></UploadAssets>}>
          <PackageTable data={lists}></PackageTable>
        </Card>
        <Card title="资产列表" style={{ margin: '12px 0px' }}>
          <AllAssets assetsCenter={{ hash: 'components' }} activeAssetsKeys={[]} onChange={() => {}} />
        </Card>
      </div>
    </>
  );
};

export default AssetsCenter;
