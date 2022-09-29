import { Icon } from '@alipay/graphinsight';
import { DeleteOutlined, EditOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Card, Col, Popconfirm, Row, Tooltip } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';

const TYPE_ICONS = {
  file: { icon: 'icon-file-excel', name: '本地文件' },
  api: { icon: 'icon-api', name: '在线接口' },
  database: { icon: 'icon-database', name: '图数据库' },
};

const { Meta } = Card;

import { DataSet, queryDataset } from '../../services/dataset';

interface ProjectListProps {
  onCreate: () => void;
  type: 'project' | 'case' | 'save';
}

interface ProjectListState {
  lists: DataSet[];
}

const DatasetList: React.FunctionComponent<ProjectListProps> = props => {
  const { type, onCreate } = props;
  const history = useHistory();
  const [state, updateState] = useImmer<ProjectListState>({
    lists: [],
  });

  const [member, setMember] = useImmer({
    currentProject: null,
    visible: false,
  });

  React.useEffect(() => {
    (async () => {
      const lists = await queryDataset();
      updateState(draft => {
        draft.lists = lists;
      });
    })();
  }, []);

  const { lists } = state;
  console.log('lists', lists);
  const confirm = () => {
    console.log('delete');
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8} key={'default'}>
          <Card
            hoverable
            style={{ width: '100%', border: '2px dashed var(--primary-color)', color: 'var(--primary-color)' }}
          >
            <Meta
              avatar={<Icon type="icon-plus" style={{ fontSize: '80px' }} />}
              title={'创建数据集'}
              description="This is the description"
            />
          </Card>
        </Col>
        {lists.map((item, index) => {
          const { title = '未命名的数据集', data } = item;
          const description = `节点规模：${data.nodes.length}，边规模：${data.edges.length}`;
          return (
            <Col span={8} key={index}>
              <Card
                hoverable
                style={{ width: '100%' }}
                actions={[
                  <Tooltip title="创建分析" color="var(--primary-color)">
                    <Icon
                      type="icon-analysis"
                      key={'analysis'}
                      // style={{ color: 'var(--primary-color)' }}
                    />
                  </Tooltip>,
                  <Tooltip title="查看数据集" color="var(--primary-color)">
                    <EditOutlined key="edit" />
                  </Tooltip>,
                  <Tooltip title="共享" color="var(--primary-color)">
                    <UsergroupAddOutlined disabled />
                  </Tooltip>,

                  <Popconfirm
                    placement="topRight"
                    title={
                      <div>
                        确定删除该数据集吗？
                        <br />
                        注意⚠️：删除后，可能影响相关联的分析画布
                        <br />
                        因缺乏数据集而无法使用
                      </div>
                    }
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="删除数据集" color="red">
                      <DeleteOutlined />
                    </Tooltip>
                  </Popconfirm>,
                ]}
              >
                <Meta
                  avatar={<Icon type="icon-file-excel" style={{ fontSize: '50px' }} />}
                  title={title}
                  description={description}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default DatasetList;
