import * as React from 'react';
import { deps, getPkg } from '../../components/Navbar/getExportContext';
import { queryAssets } from '../../services/assets';
import * as DatasetServices from '../../services/dataset';
import * as WorkbookServices from '../../services/project';
interface ApplactionProps {}
//@ts-ignore
const { default: GI_SDK_APP } = window.GI_SDK_APP;

const Preview: React.FunctionComponent<ApplactionProps> = props => {
  //@ts-ignore
  const { id } = props.match.params;
  const service = async () => {
    const workbook = await WorkbookServices.getById(id);
    if (!workbook) {
      return;
    }
    const dataset = await DatasetServices.queryDatasetInfo(workbook.datasetId);
    const activeAssets = await queryAssets(workbook.activeAssetsKeys);
    const GI_ASSETS_PACKAGES = getPkg(activeAssets);
    const params = {
      dataset,
      workbook,
      GI_ASSETS_PACKAGES: GI_ASSETS_PACKAGES,
      deps,
    };
    console.log('export params', params);
    return {
      data: params,
      success: true,
    };
  };
  return (
    <div
      style={{
        height: '100vh',
        backgroundImage:
          'var(--layout-background,radial-gradient(at 13% 5%, hsla(214, 100%, 37%, 0.29) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(254, 66%, 56%, 0.11) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(355, 100%, 93%, 0) 0px, transparent 50%), radial-gradient(at 61% 52%, hsla(227, 64%, 46%, 0.05) 0px, transparent 50%), radial-gradient(at 88% 12%, hsla(227, 70%, 49%, 0.1) 0px, transparent 50%), radial-gradient(at 100% 37%, hsla(254, 68%, 56%, 0) 0px, transparent 50%))',
      }}
    >
      <GI_SDK_APP id={id} service={service} />
    </div>
  );
};

export default Preview;
