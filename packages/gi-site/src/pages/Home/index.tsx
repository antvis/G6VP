import { FileAddOutlined, FundOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Space, Tabs } from 'antd';
import * as React from 'react';
import DatasetList from '../Dataset/List';
import WorkbookList from '../Workspace/Projects';
import './index.less';

export interface HomeProps {}

const Home = props => {
  const { history } = props;
  const items = [
    { label: '我的数据', key: 'dataset', children: <DatasetList /> }, // 务必填写 key
    { label: '我的画布', key: 'workbook', children: <WorkbookList type="project" onCreate={() => {}} /> },
  ];
  const createDataset = () => {
    history.push('/dataset/create');
  };
  const createWookbook = () => {
    history.push('/workbook/create');
  };
  return (
    <div className="gi-site-home">
      <section className="greeting"> 欢迎使用 GraphInsight 遨游关系数据世界～ </section>
      <div className="container">
        <section className="flex-left">
          <Card>
            <Space>
              <div> 第一步:</div>
              <div>
                <Button type="text" icon={<FileAddOutlined style={{ fontSize: '18px' }} />} onClick={createDataset}>
                  创建数据集
                </Button>
              </div>
              <div> 巧妇难为无米之炊，支持本地文件，图数据库，图计算引擎，在线 API 等 10+ 数据源</div>
            </Space>
            <Divider />
            <Space>
              <div>第二步:</div>
              <div>
                <Button type="text" icon={<FundOutlined style={{ fontSize: '18px' }} />} onClick={createWookbook}>
                  创建工作薄
                </Button>
              </div>
              <div> 让你的关系数据跃然纸上，可视化搭建分析画布，设置样式布局，组合分析资产</div>
            </Space>
          </Card>
          <Card style={{ marginTop: '12px' }}>
            <Tabs items={items}></Tabs>
          </Card>
        </section>
        <section className="flex-right">
          <Card title="公告通知"></Card>
          <Card title="学习专区" style={{ marginTop: '12px' }}></Card>
        </section>
      </div>
    </div>
  );
};

export default Home;
