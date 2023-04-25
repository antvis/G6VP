import React, { useContext } from 'react';
import { Tooltip } from 'antd';
import { ComponentContext } from '../context';
import './index.less';

type HeaderProps = {
  title: string;
  onClose: () => void;
};

export const Header: React.FC<HeaderProps> = ({ title, onClose }) => {
  const { loading, abortQuery } = useContext(ComponentContext);
  return (
    <div className="dialog-header">
      <div className="dialog-header-title">{title}</div>
      <div className="dialog-header-button-group">
        {loading && (
          <Tooltip title="停止查询" mouseEnterDelay={1}>
            <div className="dialog-header-cancel" onClick={abortQuery}>
              <div className="cancel-button"></div>
            </div>
          </Tooltip>
        )}
        <div className="dialog-header-close" onClick={onClose}>
          <div className="close-button">
            <div className="close-button-bar"></div>
            <div className="close-button-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
