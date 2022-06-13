import { VideoCameraOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tag } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { getProjectList } from '../../../services/index';
import './index.less';
interface CaseProps {}

const CONSTS_MAP = {
  'demo-bank': {
    title: '在银行反洗钱分析场景的应用实践',
    tag: '金融风控',
    author: '山果',
    time: '2022.06.06',
    video: 'https://www.bilibili.com/video/BV1mg411X7Bh?share_source=copy_web',
    img: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*FZLuRI0h-HMAAAAAAAAAAAAAARQnAQ',
  },
  'demo-supply-chain': {
    title: '在供应链漏洞分析场景的应用实践',
    tag: '网络安全',
    author: '刘宏达',
    time: '2022.06.06',
    video: 'https://www.bilibili.com/video/BV1TF411V7wM?share_source=copy_web',
    img: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*qBabR5ADNmwAAAAAAAAAAAAAARQnAQ',
  },
};
const Case: React.FunctionComponent<CaseProps> = props => {
  const history = useHistory();
  const [state, updateState] = useImmer({
    lists: [],
    visible: false,
  });

  React.useEffect(() => {
    (async () => {
      const lists = await getProjectList('case');
      const filterLists = lists.filter(d => {
        return CONSTS_MAP[d.id];
      });
      console.log('filterLists', filterLists);
      updateState(draft => {
        draft.lists = filterLists;
      });
    })();
  }, []);

  console.log(state.lists);
  if (state.lists.length === 0) {
    return null;
  }

  return (
    <div>
      <Row gutter={24}>
        {state.lists.map(c => {
          const { id, name } = c;
          const { img, title, tag, time, author, video } = CONSTS_MAP[id];
          console.log('img', img);
          return (
            <Col key={id} span={12}>
              <Card
                hoverable
                cover={
                  <img
                    src={img}
                    onClick={() => {
                      history.push(`/workspace/${id}?nav=data`);
                    }}
                  />
                }
              >
                <div className="gi-case-flex">
                  <div className="title">{title}</div>
                  <div>
                    <Tag>{tag}</Tag>
                  </div>
                </div>
                <div className="gi-case-flex">
                  <div className="time">{time}</div>
                  <div className="author">{author}</div>
                  <div className="video">
                    <span
                      onClick={() => {
                        window.open(video, '_blank');
                      }}
                    >
                      <VideoCameraOutlined /> 视频讲解
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col span={24}>
          <div
            style={{
              textAlign: 'center',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 7px 0 rgba(0,0,0,0.05)',
              borderRadius: '8px',
              height: '48px',
              lineHeight: '48px',
              marginTop: '24px',
            }}
          >
            更多案例准备中，敬请期待
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Case;
