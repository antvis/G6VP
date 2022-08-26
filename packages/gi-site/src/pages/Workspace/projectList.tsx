import { Icon, utils } from '@alipay/graphinsight';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Popconfirm, Row, Modal } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import ProjectCard from '../../components/ProjectCard';
import ODPSDeploy from '../../components/ODPSDeploy';
import MembersPanel from './Members';
import { getProjectList, removeProjectById } from '../../services';
import type { IProject } from '../../services/typing';

interface ProjectListProps {
  onCreate: () => void;
  type: 'project' | 'case' | 'save';
}

interface ProjectListState {
  lists: IProject[];
  deployVisible: boolean;
}

const ProjectList: React.FunctionComponent<ProjectListProps> = props => {
  const { type, onCreate } = props;
  const history = useHistory();
  const [state, updateState] = useImmer<ProjectListState>({
    lists: [],
    deployVisible: false,
  });

  const [member, setMember] = useImmer({
    currentProject: null,
    visible: false,
  });

  React.useEffect(() => {
    (async () => {
      const lists = await getProjectList(type);
      updateState(draft => {
        draft.lists = lists;
      });
    })();
  }, []);

  const { lists } = state;

  const addButton = (
    <Col key={'new'} xs={24} sm={24} md={12} lg={8} xl={6}>
      <ProjectCard
        style={{ color: 'var(--primary-color)', border: '2px dashed var(--primary-color)' }}
        onClick={onCreate}
        cover={<Icon type="icon-plus" style={{ fontSize: '70px' }} />}
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
    removeProjectById(id);
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

  const handleDeployOpen = () => {
    updateState(draft => {
      draft.deployVisible = true;
    });
  };

  const hanldeDeployClose = () => {
    updateState(draft => {
      draft.deployVisible = false;
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
      <Menu.Item onClick={() => handleShowMemberModal(item)}>成员管理</Menu.Item>
      <Menu.Item onClick={handleDeployOpen}>项目部署</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row gutter={[16, 16]} style={{ paddingRight: '24px' }}>
        {type === 'project' && addButton}
        {lists.map(item => {
          const { id, name, gmtCreate } = item;
          return (
            <Col key={id} xs={24} sm={24} md={12} lg={8} xl={6}>
              <ProjectCard
                onClick={() => {
                  history.push(`/workspace/${id}?nav=data`);
                }}
                cover={<Icon type="icon-analysis" style={{ fontSize: '70px' }} />}
                title={name || ''}
                time={utils.time(gmtCreate)}
                extra={
                  <Dropdown overlay={menu(item)} placement="bottomCenter">
                    <Button type="text" icon={<MoreOutlined className="more icon-buuton" />}></Button>
                  </Dropdown>
                }
                description=""
              ></ProjectCard>
            </Col>
          );
        })}
      </Row>
      <MembersPanel visible={member.visible} handleClose={closeMemberPanen} values={member.currentProject} />
      <Modal
        title="项目部署"
        visible={state.deployVisible}
        onCancel={hanldeDeployClose}
        maskClosable={false}
        footer={false}
      >
        <ODPSDeploy />
      </Modal>
    </>
  );
};

export default ProjectList;
