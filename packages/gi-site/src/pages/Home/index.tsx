import { Button, Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const Home = () => (
  <Layout>
    <Header className="header"></Header>
    <Content style={{ padding: '0 50px' }}>
      <h1>Welcome to GraphInsight</h1>
      <Button type="primary">
        <Link to="/workspace">进入探索分析</Link>
      </Button>
    </Content>

    <Footer style={{ textAlign: 'center' }}>AntV ©2021 Created by GraphInsight</Footer>
  </Layout>
);

export default Home;
