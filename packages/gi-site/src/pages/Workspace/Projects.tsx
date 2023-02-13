import { EllipsisOutlined, MoreOutlined } from '@ant-design/icons';
import { Icon, utils } from '@antv/gi-sdk';
import { clone } from '@antv/util';
import { Button, Col, Drawer, Dropdown, Menu, Popconfirm, Row, Skeleton } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import ExportConfig from '../../components/Navbar/ExportConfig';
import ProjectCard from '../../components/ProjectCard';
import { queryAssets } from '../../services/assets';
import { GI_SITE } from '../../services/const';
import { queryDatasetInfo } from '../../services/dataset';
import * as ProjectService from '../../services/project';
import type { IProject } from '../../services/typing';
import { getServicesByConfig } from '../Analysis/getAssets';
import getCombinedServiceConfig from '../Analysis/getAssets/getCombinedServiceConfig';
import { queryActiveAssetsInformation } from '../Analysis/utils';
interface ProjectListProps {
  onCreate: () => void;
  type: 'project' | 'case' | 'save';
}

interface ProjectListState {
  lists: IProject[];
  isLoading: boolean;
  exportProjectContext: any;
}

const ProjectList: React.FunctionComponent<ProjectListProps> = props => {
  const { type, onCreate } = props;
  const history = useHistory();
  const [state, updateState] = useImmer<ProjectListState>({
    lists: [],
    isLoading: true,
    exportProjectContext: undefined
  });

  const [member, setMember] = useImmer({
    currentProject: null,
    visible: false,
  });

  React.useEffect(() => {
    (async () => {
      const lists = await ProjectService.list(type);
      updateState(draft => {
        draft.isLoading = false;
        draft.lists = lists;
      });
    })();
  }, []);

  const { lists } = state;

  const addButton = (
    <Col key={'new'} xs={24} sm={24} md={12} lg={8} xl={8}>
      <ProjectCard
        style={{ color: 'var(--primary-color)', border: '2px dashed var(--primary-color)' }}
        onClick={onCreate}
        cover={<Icon type="icon-plus" style={{ fontSize: '60px' }} />}
        title={'创建项目'}
        time={''}
        description=""
      ></ProjectCard>
    </Col>
  );

  const confirm = id => {
    const items = lists.filter(d => d.id !== id);
    updateState(draft => {
      draft.lists = items;
    });
    ProjectService.removeById(id);
  };

  const handleShowMemberModal = item => {
    setMember({
      visible: true,
      currentProject: item,
    });
  };

  const closeMemberPanen = () => {
    setMember({
      visible: false,
      currentProject: null,
    });
  };

  const menu = item => (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title="是否删除该项目?"
          onConfirm={e => {
            e!.preventDefault();
            confirm(item.id);
          }}
          okText="Yes"
          cancelText="No"
        >
          删除项目
        </Popconfirm>
      </Menu.Item>
      {!GI_SITE.IS_OFFLINE && <Menu.Item onClick={() => handleShowMemberModal(item)}>成员管理</Menu.Item>}
    </Menu>
  );
  if (state.isLoading) {
    return (
      <>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </>
    );
  }

  // TODO [WIP]
  const handleExportSDK = async (projectItem) => {
    const { id, projectConfig, activeAssetsKeys, theme = 'light', name, datasetId } = projectItem;
    const { engineId, engineContext, schemaData, data } = await queryDatasetInfo(datasetId);
    queryAssets(activeAssetsKeys).then(activeAssets => {
      const { transData, inputData } = data || {
        transData: { nodes: [], edges: [] },
        inputData: [{ nodes: [], edges: [] }],
      };
      const assetServices = utils.getCombineServices(activeAssets.services!);
      const combinedServiceConfig = getCombinedServiceConfig([], assetServices);
      const activeAssetsInformation = queryActiveAssetsInformation({
        engineId,
        assets: activeAssets,
        data: transData,
        config: projectConfig,
        serviceConfig: [...assetServices, ...combinedServiceConfig],
        schemaData,
      });
      const services = utils.uniqueElementsBy(
        [...getServicesByConfig(combinedServiceConfig, data, schemaData), ...assetServices],
        (a, b) => {
          return a.id === b.id;
        },
      );
      // TODO: FilterPanel 的 filterKeys 默认无值？
      const clonedConfig = clone(projectConfig);
      const filterPanel = clonedConfig.components.find(component => component.id === 'FilterPanel');
      if (filterPanel) filterPanel.props.filterKeys = filterPanel.props.filterKeys || [];
      const projectContext = {
        ...projectItem,
        engineId, 
        engineContext,
        id,
        name,
        config: clonedConfig,
        projectConfig: {},
        schemaData,
        data: transData,
        inputData,
        activeAssets,
        theme,
        activeAssetsInformation,
        assets: {
          components: {},
          elements: {},
          layouts: {}
        },
        assetsCenter: { visible: false, hash: 'components' },
        services,
        serviceConfig: []
      }
      updateState(draft => {
        draft.exportProjectContext = projectContext;
      });

    });
  }
  const handleCancelExportSDK = () => {
    updateState(draft => {
      draft.exportProjectContext = undefined;
    });
  }

  return (
    <>
      <Row gutter={[16, 16]} style={{ paddingRight: '24px' }}>
        {lists.map(item => {
          const { id, name, gmtCreate } = item;
          return (
            <Col key={id} xs={24} sm={24} md={12} lg={8} xl={8}>
              <ProjectCard
                onClick={() => {
                  history.push(`/workspace/${id}?nav=style`);
                }}
                onExportSDK={() => handleExportSDK(item)}
                cover={<Icon type="icon-analysis" style={{ fontSize: '87px' }} />}
                title={name || ''}
                time={utils.time(gmtCreate)}
                description="asdfalsdkjfaksjdfklasdfasdfasd"
                extra={
                  <Dropdown overlay={menu(id)} placement="bottomCenter">
                    <Button type="text" icon={<EllipsisOutlined className="more icon-buuton" />}></Button>
                  </Dropdown>
                }
              ></ProjectCard>
            </Col>
          );
        })}
      </Row>
      {/* <MembersPanel visible={member.visible} handleClose={closeMemberPanen} values={member.currentProject} /> */}

      <Drawer
        title="导出SDK"
        placement="right"
        closable={false}
        onClose={handleCancelExportSDK}
        visible={Boolean(state.exportProjectContext)}
        width="calc(100vw - 382px)"
      >
        {Boolean(state.exportProjectContext) && <ExportConfig context={state.exportProjectContext} />}
      </Drawer>
    </>
  );
};

export default ProjectList;
