import { utils } from '@antv/gi-sdk';
import React, { memo } from 'react';
import $i18n from '../../i18n';
import './index.less';
const { getPositionStyles } = utils;

export interface CopyrightProps {
  imageUrl: string;
  width: number;
  height: number;
  placement: string;
  offset: number[];
}

const Copyright: React.FunctionComponent<CopyrightProps> = props => {
  const { imageUrl, width, height, placement, offset } = props;
  const positionStyles = getPositionStyles(placement, offset);

  return (
    <div className="gi-copyright" style={{ ...positionStyles, userSelect: 'none' }}>
      <img
        src={`${imageUrl}`}
        alt={$i18n.get({ id: 'basic.components.Copyright.Component.CopyrightImage', dm: '版权图片' })}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
};

export default memo(Copyright);
