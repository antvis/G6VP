import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import * as React from 'react';

export interface Back {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const Back: React.FunctionComponent<Back> = props => {
  //@ts-ignore
  const { color, hasDivider, title, icon, isShowIcon, isShowTitle } = props;

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
