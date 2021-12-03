import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import * as React from 'react';
import { GIAC_PROPS } from '../const';

export interface Back {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: any;
}

const Back: React.FunctionComponent<Back> = props => {
  const { GIAC = GIAC_PROPS.GIAC } = props;
  const { color, hasDivider, title, icon, isShowIcon, isShowTitle } = GIAC;

  return (
    <div>
      {isShowIcon && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            window.history.back();
          }}
        ></Button>
      )}

      {isShowTitle && <span>{title}</span>}

      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default Back;
