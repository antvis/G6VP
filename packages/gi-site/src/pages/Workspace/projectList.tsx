import { Icon, utils } from '@alipay/graphinsight';
import { CopyFilled, EditFilled, MoreOutlined, StarFilled } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Popconfirm, Row } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import ProjectCard from '../../components/ProjectCard';
import { getProjectList, removeProjectById } from '../../services';

interface ProjectListProps {
  onCreate?: () => void;
  type: 'project' | 'case' | 'save';
}

const ProjectList: React.FunctionComponent<ProjectListProps> = props => {
  const { type, onCreate } = props;
  const history = useHistory();
  const [state, updateState] = useImmer({
    lists: [],
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

  const menu = id => (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title="是否删除该项目?"
          onConfirm={e => {
            e.preventDefault();
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
  const projectButton = <EditFilled className="edit icon-buuton" />;
  const collectButton = (
    <>
      <StarFilled className="star icon-buuton" />
      <CopyFilled className="copy icon-buuton" />
    </>
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
                title={name}
                time={utils.time(gmtCreate)}
                extra={
                  <Dropdown overlay={menu(id)} placement="bottomCenter">
                    <Button type="text" icon={<MoreOutlined className="more icon-buuton" />}></Button>
                  </Dropdown>
                }
                description=""
              ></ProjectCard>
              {/* <Card
                hoverable
                cover={
                  <img
                    onClick={() => {
                      history.push(`/workspace/${id}?nav=data`);
                    }}
                    alt="example"
                    src="https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*WpS1Qpk73uMAAAAAAAAAAAAAARQnAQ"
                  />
                }
              >
                <div className="card-content">
                  <div className="card-title">
                    <p>{name}</p>
                    <span>
                      {type === 'project' ? projectButton : collectButton}
                      <Dropdown overlay={menu(id)} placement="bottomCenter">
                        <MoreOutlined className="more icon-buuton" />
                      </Dropdown>
                    </span>
                  </div>
                  <span>{utils.time(gmtCreate)}</span>
                </div>
              </Card> */}
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default ProjectList;
