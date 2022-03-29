import { Button, Carousel, Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import BubbleChart from './Bubble';
import { levelTitleMapping } from './constant';
import FeatureCard from './FeatureCard';
import styles from './index.less';

const { Content, Footer } = Layout;

const rightContent = (
  <>
    <span style={{ marginRight: '36px', cursor: 'pointer' }}>我的工作台</span>
  </>
);

const Home = () => {
  return (
    <Layout className={styles.giLayout}>
      <BaseNavbar rightContent={rightContent} active="home" />
      <Content style={{ background: '#fff' }}>
        <div className={styles.contentContaniner}>
          <div className={styles.videoContainer}>
            <div className={styles.fillTop}></div>
            <div className={styles.container}>
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
              <div className={styles.carousel}>
                <Carousel autoplay>
                  <div>
                    <img
                      src={'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*IqFVR4U1HZ0AAAAAAAAAAAAAARQnAQ'}
                    ></img>
                  </div>
                  <div>
                    <img
                      src={'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*d8c1Sp9018oAAAAAAAAAAAAAARQnAQ'}
                    ></img>
                  </div>
                  <div>
                    <img
                      src={'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*goIoRIevfN8AAAAAAAAAAAAAARQnAQ'}
                    ></img>
                  </div>
                </Carousel>
              </div>
            </div>
          </div>

          <div className={styles.productContainer}>
            <h2 className={styles.h2}>{levelTitleMapping['product'].title}</h2>
            <div className={styles.cardContainer}>
              {levelTitleMapping['product'].list.map(item => (
                <FeatureCard key={item.title} data={item} />
              ))}
            </div>
          </div>

          <div className={styles.resolveContainer}>
            <div className={styles.fillTop}></div>
            <br />
            <br />
            <br />
            <br />

            <BubbleChart />
            {/* <h2 className={styles.h2}>{levelTitleMapping['resolve'].title}</h2>
            <p className={styles.p2}>{levelTitleMapping['resolve'].description}</p>
            <div className={styles.cardContainer}>
              {levelTitleMapping['resolve'].list.map(item => (
                <SolutionCard key={item.title} data={item} />
              ))}
            </div>
            <div className={styles.fillBottom}></div> */}
          </div>

          {/* <div className={styles.clientContainer}>
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
          </div> */}
        </div>
      </Content>

      <Footer className={styles.footerContainer} style={{ textAlign: 'center' }}>
        {/* <div className={styles.fillTop}></div> */}
        AntV ©2021 Created by GraphInsight
      </Footer>
    </Layout>
  );
};

export default Home;
