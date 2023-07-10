import { SaveOutlined } from '@ant-design/icons';
import { Graph } from '@antv/graphin';
import { Button, notification, Tooltip } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import * as ProjectServices from '../../services/project';
import type { IProject } from '../../services/typing';
import $i18n from '../../i18n';
import './index.less';

interface SaveWorkbookProps {
  workbookId: string;
}

const getCover = async (graph: Graph) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const cover = graph.toDataURL('image/png');
      resolve(cover);
    }, 30);
  });
};

const SaveWorkbook: React.FunctionComponent<SaveWorkbookProps> = props => {
  const { workbookId } = props;
  const history = useHistory();
  const { context, updateContext } = useContext();
  const { config, activeAssetsKeys, name, graphRef } = context;
  const handleSave = async () => {
    const origin = (await ProjectServices.getById(workbookId)) as IProject;

    const { pageLayout, layout, ...otherConfig } = config;
    // TODO：case 的需要保存到另一个表中
    if (origin.type === 'case') {
      const workbookId = await ProjectServices.create({
        name: origin?.name + $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.Copy', dm: '_复制' }),
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
          message: $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SavedSuccessfully', dm: '保存成功' }),
        });
        return;
      }
    } else {
      const graph = graphRef.current as Graph;
      if (graph) {
        const width = graph.getWidth();
        const height = graph.getHeight();
        graph.changeSize(400, 300);
        graphRef.current.fitView(10);
        graph.changeSize(width, height);
        graph.fitView(20);
      }

      const cover = graph ? await getCover(graph) : '';

      /** 临时的兼容处理，需要重新设计 */
      const {
        id = 'SegmentedLayout',
        name = $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SegmentLayout', dm: '分段布局' }),
        type = 'GICC_LAYOUT',
        props = {
          containers: [
            {
              id: 'GI_CONTAINER_SIDE',
              name: $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SideContainer', dm: '侧边容器' }),
              required: true,
              GI_CONTAINER: ['FilterPanel'],
              display: true,
            },
          ],
        },
      } = pageLayout || {
        id: 'SegmentedLayout',
        name: $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SegmentLayout', dm: '分段布局' }),
        type: 'GICC_LAYOUT',
        props: {
          containers: [
            {
              id: 'GI_CONTAINER_SIDE',
              name: $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SideContainer', dm: '侧边容器' }),
              required: true,
              GI_CONTAINER: ['FilterPanel'],
              display: true,
            },
          ],
        },
      };

      const clonedLayout = JSON.parse(JSON.stringify(layout));
      const result = await ProjectServices.updateById(workbookId, {
        cover,
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
          message: $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SavedSuccessfully', dm: '保存成功' }),
        });
        return;
      }
    }
    notification.error({
      message: $i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SaveFailed', dm: '保存失败' }),
    });
  };

  return (
    <Tooltip title={$i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.SaveCanvas', dm: '保存画布' })}>
      <Button icon={<SaveOutlined />} onClick={handleSave} size="small" type="text">
        {$i18n.get({ id: 'gi-site.components.Navbar.SaveWorkbook.Save', dm: '保存' })}
      </Button>
    </Tooltip>
  );
};

export default SaveWorkbook;
