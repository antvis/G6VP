import { SaveOutlined } from '@ant-design/icons';
import { Button, notification, Tooltip } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import * as ProjectServices from '../../services/project';
import type { IProject } from '../../services/typing';

import './index.less';
interface SaveWorkbookProps {
  workbookId: string;
}

const SaveWorkbook: React.FunctionComponent<SaveWorkbookProps> = props => {
  const { workbookId } = props;
  const history = useHistory();
  const { context, updateContext } = useContext();
  const { config, activeAssetsKeys, name } = context;
  const handleSave = async () => {
    const origin = (await ProjectServices.getById(workbookId)) as IProject;

    const { pageLayout, layout, ...otherConfig } = config;
    // TODO：case 的需要保存到另一个表中
    if (origin.type === 'case') {
      const workbookId = await ProjectServices.create({
        name: origin?.name + '_复制',
        type: 'project',
        activeAssetsKeys,
        projectConfig: config,
      });
      history.push(`/workspace/${workbookId}?nav=data`);
      if (workbookId) {
        updateContext(draft => {
          draft.isSave = true;
        });
        notification.success({
          message: '保存成功',
        });
        return;
      }
    } else {
      // const data = graphRef.current && graphRef.current.save();
      const { id, name, type, props } = pageLayout;
      const clonedLayout = JSON.parse(JSON.stringify(layout));
      const result = await ProjectServices.updateById(workbookId, {
        activeAssetsKeys,
        projectConfig: {
          ...otherConfig,
          layout: clonedLayout,
          pageLayout: { id, name, type, props },
        },
      });
      if (result) {
        updateContext(draft => {
          draft.isSave = true;
        });
        notification.success({
          message: '保存成功',
        });
        return;
      }
    }
    notification.error({
      message: '保存失败',
    });
  };

  return (
    <Tooltip title="保存">
      <Button icon={<SaveOutlined />} onClick={handleSave} size="small" className="gi-intro-save">
        保存
      </Button>
    </Tooltip>
  );
};

export default SaveWorkbook;
