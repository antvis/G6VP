import { Card } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import SlotComponent from '../../components/SlotComponent';
import DatasetList from '../Dataset/List';
import WorkbookList from '../Workspace/Projects';
import { NOTIFICATION_ITEMS, STUDY_ITEMS } from './const';
import GuideCards from './GuideCards';
import Notification from './Notification';
import $i18n from '../../i18n';
import './index.less';
export interface HomeProps {}

const Home = props => {
  const { history } = props;
  const items = [
    {
      label: $i18n.get({ id: 'gi-site.pages.Home.MyData', dm: '我的数据' }),
      key: 'dataset',
      children: <DatasetList />,
    }, // 务必填写 key
    {
      label: $i18n.get({ id: 'gi-site.pages.Home.MyCanvas', dm: '我的画布' }),
      key: 'workbook',
      children: <WorkbookList type="project" onCreate={() => {}} />,
    },
  ];

  const createDataset = () => {
    history.push('/dataset/create');
  };
  const createWookbook = () => {
    history.push('/workbook/create');
  };
  return (
    <SlotComponent name="SLOT_HOME_CONTENT">
      <div className="gi-site-home">
        <section className="greeting">
          {$i18n.get({
            id: 'gi-site.pages.Home.BringDataToLifeIn',
            dm: '欢迎您来到学员知识图谱分析端(v1.0.0)',
          })}
        </section>
        <div className="container">
          <section className="flex-left">
            <GuideCards history={history} />
            <div style={{ padding: '4px 8px', height: '-webkit-fill-available' }}>
              <SegmentedTabs
                items={items}
                style={{
                  height: 'unset',
                  width: '100%',
                  borderRadius: '6px',
                }}
              />
            </div>
          </section>
          {/*<section className="flex-right">*/}
          {/*  <Card*/}
          {/*    title={$i18n.get({ id: 'gi-site.pages.Home.AnnouncementNotice', dm: '公告通知' })}*/}
          {/*    style={{ borderRadius: '8px', marginTop: '8px' }}*/}
          {/*  >*/}
          {/*    <Notification items={NOTIFICATION_ITEMS} />*/}
          {/*    <img src={`${window['GI_PUBLIC_PATH']}image/QRCode.jpg`} width={'100%'} />*/}
          {/*  </Card>*/}
          {/*  <Card*/}
          {/*    title={$i18n.get({ id: 'gi-site.pages.Home.LearningZone', dm: '学习专区' })}*/}
          {/*    style={{ marginTop: '12px', borderRadius: '8px' }}*/}
          {/*  >*/}
          {/*    <Notification items={STUDY_ITEMS} />*/}
          {/*  </Card>*/}
          {/*</section>*/}
        </div>
      </div>
    </SlotComponent>
  );
};

export default Home;
