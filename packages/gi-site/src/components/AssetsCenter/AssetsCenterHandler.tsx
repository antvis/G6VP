import * as React from 'react';
import './index.less';

interface AssetsCenterHandlerProps {
  title: string;
  id: string;
}

const AssetsCenterHandler: React.FunctionComponent<AssetsCenterHandlerProps> = props => {
  const { title, id } = props;
  return (
    <div className={`gi-assets-center-handler ${id}`}>
      <span>{title} </span>
    </div>
  );
};

export default AssetsCenterHandler;
