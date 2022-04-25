import { useContext, utils } from '@alipay/graphinsight';
import GremlinEditor from './GremlinEditor';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import { Button, Col, Divider, Row, notification } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import './index.less';

const icons = Graphin.registerFontFamily(iconLoader);
const defSpringLen = (_edge, source, target) => {
  // NOTE: 固定200还是效果好
  // return 200;
  /** 默认返回的是 200 的弹簧长度 */
  /** 如果你要想要产生聚类的效果，可以考虑 根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
  const defaultSpring = 100;
  const Sdegree = source.data.layout.degree;
  const Tdegree = target.data.layout.degree;
  const MinDegree = Math.min(Sdegree, Tdegree);

  let SpringLength = defaultSpring;
  if (MinDegree < 5) {
    SpringLength = defaultSpring * MinDegree;
  } else {
    SpringLength = 500;
  }
  // console.log(Sdegree, Tdegree, MinDegree, MaxDegree, "SpringLength", SpringLength);

  return SpringLength;
};

export interface IGremlinQueryProps {
  initialValue?: string;
  height?: number;
  showGutter?: boolean;
  serviceId: string;
  style?: React.CSSProperties | undefined;
}

const GremlinQueryPanel: React.FC<IGremlinQueryProps> = ({ initialValue = '', height = 220, serviceId, style }) => {
  const { data, updateContext, transform, services } = useContext();

  const service = utils.getService(services, serviceId);

  const [editorValue, setEditorValue] = useState(initialValue || '');

  const handleChangeEditorValue = (value: string) => {
    setEditorValue(value);
  };

  const [btnLoading, setBtnLoading] = useState(false);

  const handleClickQuery = async () => {
    setBtnLoading(true);
    if (!service) {
      return;
    }

    // 查询之前判断是否已经实例化 GraphScope 实例
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');
    if (!gremlinServer) {
      setBtnLoading(false);
      notification.error({
        message: 'Gremlin 查询失败',
        description: '使用 Gremlin 查询之前，请先实例化 GraphScope 实例！',
      });
      return;
    }

    const result = await service({
      value: editorValue,
    }).then(response => {
      if (response.json) {
        return response.json();
      }
      return response;
    });

    setBtnLoading(false);
    console.log('Gremlin 查询结果', result);
    if (!result || !result.success) {
      return;
    }

    updateContext(draft => {
      const res = transform(result.data);
      res.nodes.forEach(node => {
        if (!node.style.badges) {
          node.style.badges = [];
        }
        // 保留其他位置的 badges，例如锁定和标签
        node.style.badges = node.style.badges.filter(({ position }) => position !== 'LB') || [];

        const expandIds = result.data.nodes.map(n => n.id);
        if (expandIds.indexOf(node.id) !== -1) {
          node.style.badges.push({
            position: 'LB',
            type: 'font',
            fontFamily: 'graphin',
            value: icons['plus-circle'],
            size: [12, 12],
            color: '#fff',
            fill: '#4DB6AC',
            stroke: '#4DB6AC',
          });
        }
      });

      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
      draft.layout = {
        type: 'graphin-force',
        animation: false,
        preset: {
          type: 'concentric',
        },
        defSpringLen,
      };
    });
  };

  return (
    <div className={'gremlineQueryPanel'} style={style}>
      <Row className={classNames('header', 'handle')}>
        <Col span={22} className={'title'}>
          请输入 Gremlin 语句进行查询
        </Col>
      </Row>
      <div className={'contentContainer'}>
        <div className={'blockContainer'}>
          <div style={{ border: '1px solid #bfbfbf', borderRadius: '2px' }}>
            <GremlinEditor
              initialValue={editorValue}
              height={height}
              onValueChange={value => handleChangeEditorValue(value)}
            />
          </div>
        </div>
      </div>
      <div className={'buttonContainer'}>
        <Divider className={'divider'} />
        <Button className={'queryButton'} loading={btnLoading} type="primary" onClick={handleClickQuery}>
          开始查询
        </Button>
      </div>
    </div>
  );
};

export default GremlinQueryPanel;
