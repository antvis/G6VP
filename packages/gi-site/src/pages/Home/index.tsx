import { CaretDownOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { levelTitleMapping } from './constant';
import FeatureCard from './FeatureCard';
import logoSvg from './image/logo.svg';
import styles from './index.less';
import SolutionCard from './SolutionCard';

const { Header, Content, Footer } = Layout;

const Home = () => (
  <Layout>
    <Header className={styles.headerContainer}>
      <div className={styles.left}>
        <img src={logoSvg} alt="" />
      </div>
      <div className={styles.right}>
        <span style={{ marginRight: '36px', cursor: 'pointer' }}>
          <Link to="/market">组件市场</Link>
        </span>
        <span style={{ marginRight: '36px', cursor: 'pointer' }}>
          支持与服务
          <CaretDownOutlined style={{ marginLeft: '5px' }} />
        </span>
        <Avatar
          style={{ width: '21px', height: '21px' }}
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </div>
    </Header>

    <Content style={{ background: '#fff' }}>
      <div className={styles.contentContaniner}>
        <div className={styles.videoContainer}>
          <div></div>
          <div className={styles.fillTop}></div>
          <div className={styles.text}>
            <h1>图可视分析平台</h1>
            <p>一款在线图分析平台，帮助用户在关联数据中发现业务价值</p>
            <div>
              <Button className={styles.leftButton}>
                <Link to="/market">组件市场</Link>
              </Button>
              <Button className={styles.rightButton}>
                <Link to="/workspace">立即使用</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.productContainer}>
          <h2 className={styles.h2}>{levelTitleMapping['product'].title}</h2>
          <p className={styles.p2}>{levelTitleMapping['product'].description}</p>
          <div className={styles.cardContainer}>
            {levelTitleMapping['product'].list.map(item => (
              <FeatureCard key={item.title} data={item} />
            ))}
          </div>
        </div>

        <div className={styles.resolveContainer}>
          <div className={styles.fillTop}></div>
          <h2 className={styles.h2}>{levelTitleMapping['resolve'].title}</h2>
          <p className={styles.p2}>{levelTitleMapping['resolve'].description}</p>
          <div className={styles.cardContainer}>
            {levelTitleMapping['resolve'].list.map(item => (
              <SolutionCard key={item.title} data={item} />
            ))}
          </div>
          <div className={styles.fillBottom}></div>
        </div>

        <div className={styles.clientContainer}>
          <h2 className={styles.h2}>{levelTitleMapping['client'].title}</h2>
          <p className={styles.p2}>{levelTitleMapping['client'].description}</p>
          <div className={styles.cardContainer}>
            <div className={styles.clientCard}>
              <div className={styles.text}>
                <h3>{levelTitleMapping['client'].list[0].title}</h3>
                <p>{levelTitleMapping['client'].list[0].desc}</p>
              </div>
              <div>
                <img src={levelTitleMapping['client'].list[0].url} alt="" />
              </div>
            </div>
            <div className={styles.clientCard}>
              <div>
                <img src={levelTitleMapping['client'].list[1].url} alt="" />
              </div>
              <div className={styles.text}>
                <h3>{levelTitleMapping['client'].list[1].title}</h3>
                <p>{levelTitleMapping['client'].list[1].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>

    <Footer className={styles.footerContainer} style={{ textAlign: 'center' }}>
      <div className={styles.fillTop}></div>
      AntV ©2021 Created by GraphInsight
    </Footer>
  </Layout>
);

export default Home;
