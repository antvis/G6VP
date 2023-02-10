import { Icon, utils } from '@antv/gi-sdk';
import { Col, Menu, Popconfirm, Row, Skeleton } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import ProjectCard from '../../components/ProjectCard';
import { GI_SITE } from '../../services/const';
import * as ProjectService from '../../services/project';
import type { IProject } from '../../services/typing';
interface ProjectListProps {
  onCreate: () => void;
  type: 'project' | 'case' | 'save';
}

interface ProjectListState {
  lists: IProject[];
  isLoading: boolean;
}

const ProjectList: React.FunctionComponent<ProjectListProps> = props => {
  const { type, onCreate } = props;
  const history = useHistory();
  const [state, updateState] = useImmer<ProjectListState>({
    lists: [],
    isLoading: true,
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
                cover={<Icon type="icon-analysis" style={{ fontSize: '60px' }} />}
                title={name || ''}
                time={utils.time(gmtCreate)}
                description=""
              ></ProjectCard>
            </Col>
          );
        })}
      </Row>
      {/* <MembersPanel visible={member.visible} handleClose={closeMemberPanen} values={member.currentProject} /> */}
    </>
  );
};

export default ProjectList;
