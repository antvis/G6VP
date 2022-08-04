import React from 'react';
import { Icon, utils } from '@alipay/graphinsight';
import { useImmer } from 'use-immer';
import { Row, Col } from 'antd';
import ProjectCard from '../../components/ProjectCard';

const LISTS = [
  {
    id: '123',
    gmtCreate: new Date('December 17, 1995 03:24:00'),
    status: '进行中',
    name: '反欺诈 Research',
  },
  {
    id: '134',
    gmtCreate: new Date('December 17, 1995 03:24:00'),
    status: '已完成',
    name: '反欺诈 Research',
  },
  {
    id: '224',
    gmtCreate: new Date('December 17, 1995 03:24:00'),
    status: '部署失败',
    name: '反欺诈 Research',
  },
];

const DeployedList = () => {
  const [state, updateState] = useImmer({
    lists: LISTS,
  });
  return (
    <Row gutter={[16, 16]} style={{ paddingRight: '24px' }}>
      {state.lists.map(item => {
        const { id, name, gmtCreate, status } = item;
        console.log('item:', item);
        return (
          <Col key={id} xs={24} sm={24} md={12} lg={8} xl={6}>
            <ProjectCard
              onClick={() => {}}
              cover={<Icon type="icon-analysis" style={{ fontSize: '70px' }} />}
              title={name || ''}
              time={utils.time(gmtCreate)}
              //   extra={
              //     <Dropdown overlay={menu(item)} placement="bottomCenter">
              //       <Button type="text" icon={<MoreOutlined className="more icon-buuton" />}></Button>
              //     </Dropdown>
              //   }
              extraTopRight={<span>{status}</span>}
              description=""
            ></ProjectCard>
          </Col>
        );
      })}
    </Row>
  );
};

export default DeployedList;
