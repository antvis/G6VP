import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { Button, Card, Col, Menu, Popconfirm, Row, Skeleton, Tooltip } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import Empty from '../../components/Empty';
import * as ProjectService from '../../services/project';
import type { IProject } from '../../services/typing';
const { Meta } = Card;

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
}

const ProjectList: React.FunctionComponent<ProjectListProps> = props => {
  const { type, onCreate } = props;
  const history = useHistory();
  const [state, updateState] = useImmer<ProjectListState>({
    lists: [],
    isLoading: true,
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

  const confirm = async id => {
    const isSuccess = await ProjectService.removeById(id);
    if (isSuccess) {
      const items = lists.filter(d => d.id !== id);
      updateState(draft => {
        draft.lists = items;
      });
    }
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
          const { id, name, gmtCreate, recycleTime, cover } = item;
          let expiredStr, expiredDateStr;
          if (recycleTime) {
            const expiredDate = new Date(recycleTime + 604800000);
            expiredStr = `${expiredDate.toLocaleDateString()} ${expiredDate.toLocaleTimeString()}`;
            expiredDateStr = expiredDate.toLocaleDateString();
          }
          const time = utils.time(gmtCreate);

          const expiredInfo = expiredStr && (
            <div style={{ color: 'red' }}>
              画布将于 {expiredDateStr} 自动销毁&nbsp;
              <Tooltip title="关联的数据集已删除，该工作簿即将过期自动销毁。若需恢复，请在「数据集-回收站」恢复相关数据">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          );

          const Cover = (
            <img
              src={cover || `${window['GI_PUBLIC_PATH']}image/empty_workbook.png`}
              style={{ cursor: 'pointer', width: '100%' }}
              onClick={() => {
                history.push(`/workspace/${id}?nav=style`);
              }}
            />
          );

          return (
            <Col key={id} xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Card cover={Cover}>
                <div style={{ position: 'relative' }}>
                  <Meta
                    title={name}
                    description={
                      <>
                        {time}
                        {expiredInfo}
                      </>
                    }
                  />
                  {}
                  <div style={{ position: 'absolute', bottom: '0px', right: '0px' }}>
                    <Popconfirm
                      title="是否删除该项目?"
                      onConfirm={e => {
                        e!.preventDefault();
                        confirm(id);
                      }}
                      placement="rightBottom"
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" size="small" icon={<DeleteOutlined className="more icon-buuton" />}></Button>
                    </Popconfirm>
                  </div>
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
