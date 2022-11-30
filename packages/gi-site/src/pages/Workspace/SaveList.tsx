import { MoreOutlined } from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { Button, Col, Dropdown, Empty, Menu, message, Popconfirm, Row, Typography } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import ProjectCard from '../../components/ProjectCard';
import { getProjectList, removeProjectById } from '../../services';
import { IS_INDEXEDDB_MODE } from '../../services/const';
import { deleteShareById, queryShareList } from '../../services/share';
import type { IProject } from '../../services/typing';

interface SaveListState {
  lists: IProject[];
  visible: boolean;
}

interface SaveListProps {
  onCreate?: () => void;
  type: 'project' | 'case' | 'save';
}

const SaveList: React.FunctionComponent<SaveListProps> = props => {
  const { type } = props;
  const history = useHistory();
  const [state, updateState] = useImmer<SaveListState>({
    lists: [],
    visible: false,
  });

  React.useEffect(() => {
    (async () => {
      let lists = [];
      if (IS_INDEXEDDB_MODE) {
        lists = await getProjectList(type);
      } else {
        lists = await queryShareList();
      }
      updateState(draft => {
        draft.lists = lists;
      });
    })();
  }, []);

  const { lists } = state;

  const confirm = async id => {
    if (IS_INDEXEDDB_MODE) {
      const items = lists.filter(d => d.id !== id);
      updateState(draft => {
        draft.lists = items;
      });
      removeProjectById(id);
    } else {
      const result = await deleteShareById(id);
      if (result) {
        message.success('删除成功');
        // 重新加载列表
        const list = await queryShareList();
        updateState(draft => {
          draft.lists = list;
        });
      }
    }
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
  if (lists.length === 0) {
    return (
      <div style={{ margin: '50px auto' }}>
        <Empty
          description={
            <div>
              当用户在工作台中使用<Typography.Text type="success">「保存分析」</Typography.Text>
              资产的时候，默认会被保存在这里。
            </div>
          }
        />
      </div>
    );
  }

  return (
    <>
      <Row gutter={[16, 16]} style={{ paddingRight: '24px' }}>
        {lists.map(item => {
          const { id, name, cover, gmtCreate, description } = item;

          return (
            <Col key={id} xs={24} sm={24} md={12} lg={8} xl={6}>
              <ProjectCard
                onClick={() => {
                  history.push(`/share/${id}`);
                }}
                cover={<img src={cover} style={{ width: '70px', height: '70px' }} />}
                title={name || ''}
                time={utils.time(gmtCreate)}
                extra={
                  <Dropdown overlay={menu(id)} placement="bottomCenter">
                    <Button type="text" icon={<MoreOutlined className="more icon-buuton" />}></Button>
                  </Dropdown>
                }
                description={description}
              ></ProjectCard>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default SaveList;
