import { Input } from 'antd';
import * as React from 'react';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { getAssetPackages, getCombinedAssets, setDefaultAssetPackages } from '../../loader';
import './index.less';
import AssetsList from './List';
import PackageTable from './Table';
import UploadAssets from './Upload';
setDefaultAssetPackages();

const { TextArea } = Input;
interface AssetsCenterProps {}

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const [state, setState] = React.useState({
    isReady: false,
    lists: [],
    assets: {
      components: [],
      elements: [],
      layouts: [],
    },
  });
  React.useEffect(() => {
    getCombinedAssets().then(assets => {
      const packages = getAssetPackages();
      setState({
        isReady: true,
        //@ts-ignore
        lists: packages,
        //@ts-ignore
        assets: assets,
      });
    });
  }, []);

  const { lists, assets } = state;
  if (!state.isReady) {
    return null;
  }
  return (
    <>
      <BaseNavbar active="assets"></BaseNavbar>
      <div className="gi-assets-container">
        <UploadAssets></UploadAssets>
        <h3>资产包列表</h3>
        <PackageTable data={lists}></PackageTable>
        <h3>资产列表</h3>
        <AssetsList data={assets}></AssetsList>
      </div>
    </>
  );
};

export default AssetsCenter;
