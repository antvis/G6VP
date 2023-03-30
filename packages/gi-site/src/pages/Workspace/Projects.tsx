import { EllipsisOutlined } from '@ant-design/icons';
import { Icon, utils } from '@antv/gi-sdk';
import { Button, Col, Drawer, Dropdown, Menu, Popconfirm, Row, Skeleton } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import Empty from '../../components/Empty';
import ExportConfig from '../../components/Navbar/ExportConfig';
import ProjectCard from '../../components/ProjectCard';
import { queryAssets } from '../../services/assets';
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

const styles = {
  container: {
    borderRadius: '8px',
    background: 'var(--background-color-transparent)',
    padding: '24px',
  },
};

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
    exportProjectContext: undefined,
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

  const confirm = async id => {
    const isSuccess = await ProjectService.removeById(id);
    if (isSuccess) {
      const items = lists.filter(d => d.id !== id);
      updateState(draft => {
        draft.lists = items;
      });
    }
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

  const menu = id => (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title="是否删除该项目?"
          onConfirm={e => {
            e!.preventDefault();
            confirm(id);
          }}
          okText="Yes"
          cancelText="No"
        >
          删除项目
        </Popconfirm>
      </Menu.Item>
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

  const handleExportSDK = async projectItem => {
    const { id, projectConfig, activeAssetsKeys, theme = 'light', name, datasetId } = projectItem;
    const { engineId, engineContext, schemaData, data } = await queryDatasetInfo(datasetId);
    queryAssets(activeAssetsKeys).then(activeAssets => {
      const { transData, inputData } = data || {
        transData: { nodes: [], edges: [] },
        inputData: [{ nodes: [], edges: [] }],
      };
      window['LOCAL_DATA_FOR_GI_ENGINE'] = {
        data: transData,
        schemaData,
      };
      const assetServices = utils.getCombineServices(activeAssets.services!);
      const combinedServiceConfig = getCombinedServiceConfig([], assetServices);
      const serviceConfig = utils.uniqueElementsBy(
        [...assetServices, ...combinedServiceConfig],
        (a, b) => a.id === b.id,
      );
      const activeAssetsInformation = queryActiveAssetsInformation({
        engineId,
        assets: activeAssets,
        data: transData,
        config: projectConfig,
        serviceConfig,
        schemaData,
      });
      const services = utils.uniqueElementsBy(
        [...getServicesByConfig(combinedServiceConfig, data, schemaData), ...assetServices],
        (a, b) => a.id === b.id,
      );
      const projectContext = {
        ...projectItem,
        engineId,
        engineContext,
        id,
        name,
        config: projectConfig,
        inputData,
        activeAssets,
        theme,
        activeAssetsInformation,
        assets: {
          components: {},
          elements: {},
          layouts: {},
        },
        assetsCenter: { visible: false, hash: 'components' },
        services,
        serviceConfig: [],
      };
      updateState(draft => {
        draft.exportProjectContext = projectContext;
      });
    });
  };
  const handleCancelExportSDK = () => {
    updateState(draft => {
      draft.exportProjectContext = undefined;
    });
  };
  const handleDownloadProject = projectItem => {
    const { projectConfig, name, engineId, ...others } = projectItem;
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
  if (lists.length === 0) {
    return (
      <div style={styles.container}>
        <Empty title="暂无数据，先去创建一个工作薄吧" url="/workbook/create" />
      </div>
    );
  }
  return (
    <>
      <Row gutter={[16, 16]} style={{ paddingRight: '24px' }}>
        {lists.map(item => {
          const { id, name, gmtCreate, recycleTime } = item;
          let expiredStr;
          if (recycleTime) {
            const expiredDate = new Date(recycleTime + 604800000);
            expiredStr = `${expiredDate.toLocaleDateString()} ${expiredDate.toLocaleTimeString()}`;
          }
          return (
            <Col key={id}>
              <ProjectCard
                onClick={() => {
                  history.push(`/workspace/${id}?nav=style`);
                }}
                onExportSDK={() => handleExportSDK(item)}
                onDownloadProject={() => handleDownloadProject(item)}
                cover={<Icon type="icon-analysis" style={{ fontSize: '87px' }} />}
                title={name || ''}
                time={utils.time(gmtCreate)}
                expiredStr={expiredStr}
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
