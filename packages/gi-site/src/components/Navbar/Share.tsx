import { Button, notification } from 'antd';
import * as React from 'react';
import * as DatasetServices from '../../services/dataset';
import * as WorkbookServices from '../../services/project';

import { ShareAltOutlined } from '@ant-design/icons';
interface ShareProjectProps {
  context: any;
}

const ShareProject: React.FunctionComponent<ShareProjectProps> = props => {
  const { context } = props;

  const handleClick = async () => {
    const workbook = await WorkbookServices.getById(context.id);
    if (!workbook) {
      return;
    }
    const dataset = await DatasetServices.queryDatasetInfo(workbook.datasetId);
    const params = {
      dataset,
      workbook,
      GI_ASSETS_PACKAGES: JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}'),
    };

    const elementA = document.createElement('a');
    elementA.download = workbook.name as string;
    elementA.style.display = 'none';
    try {
      const blob = new Blob([JSON.stringify(params, null, 2)]);
      elementA.href = URL.createObjectURL(blob);
      document.body.appendChild(elementA);
      elementA.click();
      document.body.removeChild(elementA);
      notification.success({
        message: '分享项目成功！',
        description:
          '当前环境为「本地存储」，所有的操作数据均在您的浏览器本地 IndexedDB 中，因此您可下载项目文件进行分享，然后在「新建画布/恢复工作薄」中进行文件恢复',
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: '分享项目失败！',
        description: `失败原因：${error}`,
      });
    }
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
