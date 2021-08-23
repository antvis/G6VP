import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Row } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import BaseNavbar from '../../../components/Navbar/BaseNavbar';
import { queryAssets } from '../../../services/assets.market';
import CreateAssets from '../Create';

interface CustomServicesProps {}

const CustomServices: React.FunctionComponent<CustomServicesProps> = props => {
  const { history, match } = props;
  const { projectId } = match.params;
  console.log(props);
  const [state, setState] = React.useState({
    services: [],
    visible: false,
  });

  React.useEffect(() => {
    queryAssets(projectId).then(assets => {
      setState(preState => {
        return {
          ...preState,
          services: assets.services,
        };
      });
    });
  }, [projectId]);
  const handleClose = () => {
    setState(preState => {
      return {
        ...preState,
        visible: false,
      };
    });
  };
  const handleShowCreateModel = () => {
    setState(preState => {
      return {
        ...preState,
        visible: true,
      };
    });
  };
  const { services, visible } = state;
  return (
    <div>
      <BaseNavbar history={history}>
        <h4>资产中心</h4>
      </BaseNavbar>
      <Breadcrumb>
        <Breadcrumb.Item>资产中心</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">数据服务</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>项目ID</Breadcrumb.Item>
      </Breadcrumb>
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 16, lg: 16 },
          { xs: 8, sm: 16, md: 16, lg: 16 },
        ]}
      >
        <Col key="create-asset" style={{ width: '300px' }}>
          <Card hoverable title="新建数据服务" onClick={handleShowCreateModel}>
            <PlusOutlined /> <br />
            点击创建新的数据服务
          </Card>
        </Col>
        {services.map(c => {
          console.log('c', c);
          const { id, name, displayName, description, branchName, type } = c.others;
          return (
            <Col key={id} style={{ width: '300px' }}>
              <Link
                to={`/market/${id}?assetId=${id}&project=${name}&branch=${branchName}&type=${type}`}
                style={{ color: '#424447' }}
              >
                <Card hoverable title={displayName}>
                  {name}「{branchName}」 <br />
                  {description}
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
      <CreateAssets
        type="service"
        history={history}
        visible={state.visible}
        close={handleClose}
        projectId={projectId}
      />
    </div>
  );
};

export default CustomServices;
