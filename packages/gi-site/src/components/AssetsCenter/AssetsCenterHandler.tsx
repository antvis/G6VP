import { AppstoreAddOutlined } from '@ant-design/icons';
import * as React from 'react';
import './index.less';
import useAssetsCenter from './useHook';

interface AssetsCenterHandlerProps {
  title: string;
  id: string;
}

const AssetsCenterHandler: React.FunctionComponent<AssetsCenterHandlerProps> = props => {
  const { title, id } = props;
  const { handleOpenAssetsCenter } = useAssetsCenter(id);
  return (
    <div className={`gi-assets-center-handler ${id}`}>
      <span>{title} </span>
      <span onClick={handleOpenAssetsCenter} className={`gi-tour-assets-${id}`}>
        <AppstoreAddOutlined />
      </span>
    </div>
  );
};

export default AssetsCenterHandler;
