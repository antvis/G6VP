import { CopyFilled, EditFilled, MoreOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import { Card, Col, Dropdown, Menu, Popconfirm, Row } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { getProjectList, removeProjectById } from '../../services';
import { time } from './utils';

interface ProjectListProps {
  onCreate?: () => void;
  type: 'project' | 'case';
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
    <Col key={'new'} span={6}>
      <Card style={{ height: '100%', width: '100%', minHeight: 236 }} hoverable onClick={onCreate} className="new">
        <PlusOutlined style={{ fontSize: '100px', opacity: 0.15, color: '#177DDC' }} />
        <span className="new-title">创建项目</span>
      </Card>
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
      <Menu.Item
        onClick={() => {
          history.push(`/workspace/${id}`);
        }}
      >
        编辑项目
      </Menu.Item>
      {/* <Menu.Item>克隆项目</Menu.Item> */}
      <Menu.Item>
        <Popconfirm
          title="是否删除该项目?"
          onConfirm={() => {
            confirm(id);
          }}
          okText="Yes"
          cancelText="No"
        >
          删除项目
        </Popconfirm>
      </Menu.Item>
      {/* <Menu.Item>分享</Menu.Item> */}
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
      <Row gutter={[16, 16]}>
        {type === 'project' && addButton}
        {lists.map(item => {
          const { id, name, gmtCreate } = item;
          return (
            <Col key={id} span={6}>
              <Card
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
                  <span>{time(gmtCreate)}</span>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default ProjectList;
