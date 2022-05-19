import { utils } from '@alipay/graphinsight';
import { MoreOutlined } from '@ant-design/icons';
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

const SaveList: React.FunctionComponent<ProjectListProps> = props => {
  const { type } = props;
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
          title="是否删除该画布?"
          onConfirm={e => {
            e.preventDefault();
            confirm(id);
          }}
          okText="Yes"
          cancelText="No"
        >
          删除画布
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row gutter={[16, 16]} style={{ paddingRight: '24px' }}>
        {lists.map(item => {
          const { id, name, cover, gmtCreate } = item;
          console.log('item', item);
          return (
            <Col key={id} xs={24} sm={24} md={12} lg={8} xl={6}>
              <ProjectCard
                onClick={() => {
                  history.push(`/share/${id}`);
                }}
                cover={<img src={cover} style={{ width: '70px', height: '70px' }} />}
                title={name}
                time={utils.time(gmtCreate)}
                extra={
                  <Dropdown overlay={menu(id)} placement="bottomCenter">
                    <Button type="text" icon={<MoreOutlined className="more icon-buuton" />}></Button>
                  </Dropdown>
                }
                description=""
              ></ProjectCard>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default SaveList;
