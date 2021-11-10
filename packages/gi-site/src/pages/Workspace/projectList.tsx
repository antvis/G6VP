import { StarFilled, PlusOutlined, MoreOutlined, EditFilled, CopyFilled } from '@ant-design/icons';
import { Card, Col, Row, Dropdown, Menu } from 'antd';
import * as React from 'react';
import { useHistory } from '@alipay/bigfish';

interface ProjectListProps {
  data: any;
  handleOpen?: () => void;
  handleDelete?: (id: string) => void;
  type: string;
}

const ProjectList: React.FunctionComponent<ProjectListProps> = props => {
  const { data, type, handleOpen, handleDelete } = props;
  const history = useHistory();
  const addButton = (
    <Col key={'new'} span={6}>
      <Card style={{ height: '100%', width: '100%', minHeight: 236 }} hoverable onClick={handleOpen} className="new">
        <PlusOutlined style={{ fontSize: '100px', opacity: 0.15, color: '#177DDC' }} />
        <span className="new-title">创建项目</span>
      </Card>
    </Col>
  );

  const menu = id => (
    <Menu>
      <Menu.Item
        onClick={() => {
          history.push(`/workspace/${id}`);
        }}
      >
        编辑项目
      </Menu.Item>
      <Menu.Item>克隆项目</Menu.Item>
      <Menu.Item>编辑项目信息</Menu.Item>
      <Menu.Item onClick={() => handleDelete(id)}>删除</Menu.Item>
      <Menu.Item>分享</Menu.Item>
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
        {data.map(item => {
          const { id, name, gmtCreate } = item;
          return (
            <Col key={id} span={6}>
              <Card
                hoverable
                cover={
                  <img
                    onClick={() => {
                      history.push(`/workspace/${id}`);
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
                  <span>{gmtCreate}</span>
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
