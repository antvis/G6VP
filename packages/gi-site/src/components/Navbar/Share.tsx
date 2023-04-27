import { Button, notification } from 'antd';
import * as React from 'react';

import { ShareAltOutlined } from '@ant-design/icons';
interface ShareProjectProps {
  context: any;
}

const ShareProject: React.FunctionComponent<ShareProjectProps> = props => {
  const { context } = props;

  const handleClick = () => {
    notification.info({
      message: '分享项目',
      description:
        '当前环境为「本地存储」，所有的操作数据均在您的浏览器本地 IndexedDB 中，因此您可下载项目文件进行分享，然后在「新建画布/恢复工作薄」中进行文件恢复',
    });
    const { projectConfig, name, engineId, ...others } = context;
    const params = {
      ...others,
      engineId: engineId || 'GI',
      name,
      projectConfig,
      GI_ASSETS_PACKAGES: JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}'),
    };
    const elementA = document.createElement('a');
    elementA.download = name as string;
    elementA.style.display = 'none';
    const blob = new Blob([JSON.stringify(params, null, 2)]);
    elementA.href = URL.createObjectURL(blob);
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  };

  return (
    <div>
      <Button size="small" onClick={handleClick} icon={<ShareAltOutlined />} type="text">
        分享
      </Button>
    </div>
  );
};

export default ShareProject;
