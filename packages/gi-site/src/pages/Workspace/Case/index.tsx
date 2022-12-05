import { VideoCameraOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tag } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { queryCaseList } from '../../../services/case';
import { IProject } from '../../../services/typing';
import './index.less';
interface CaseProps {}

const Case: React.FunctionComponent<CaseProps> = props => {
  const history = useHistory();
  const [state, updateState] = useImmer({
    lists: [] as IProject[],
    visible: false,
  });

  React.useLayoutEffect(() => {
    (async () => {
      const lists = await queryCaseList();
      updateState(draft => {
        draft.lists = lists;
      });
    })();
  }, []);

  if (state.lists.length === 0) {
    return null;
  }

  return (
    <div>
      <Row gutter={24}>
        {state.lists.map(c => {
          //@ts-ignore
          const { id, name, img, title, tag, time, author, video } = c;

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
