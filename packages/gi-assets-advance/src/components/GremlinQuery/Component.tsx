import { useContext, utils } from '@alipay/graphinsight';

import { Button, Col, Divider, notification, Row } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import GremlinEditor from './GremlinEditor';
import './index.less';

export interface IGremlinQueryProps {
  initialValue?: string;
  height?: number;
  showGutter?: boolean;
  serviceId: string;
  style?: React.CSSProperties | undefined;
  visible?: boolean;
}

const GremlinQueryPanel: React.FC<IGremlinQueryProps> = ({
  initialValue = '',
  height = 220,
  serviceId,
  style,
  visible,
}) => {
  const { updateContext, transform, services, graph } = useContext();

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
    const projectId = localStorage.getItem('GI_ACTIVE_PROJECT_ID');

    const result = await service({
      value: editorValue,
      projectId,
      mode: localStorage.getItem('GI_CURRENT_QUERY_MODE') === 'ODPS' ? 2 : 1,
    });

    setBtnLoading(false);
    console.log('Gremlin 查询结果', result);
    if (!result || !result.success) {
      notification.error({
        message: '执行 Gremlin 查询失败',
        description: `查询失败：${result.errorMsg}`,
      });
      return;
    }

    const locationHash = location.hash.match(/(?<=workspace\/)([0-9\.]*)(?=\?)/g);
    if (locationHash && locationHash.length === 1) {
      // schemaData 统一在项目的Schema管理中去处理
      // await updateProjectById(locationHash[0], {
      //   // projectConfig: JSON.stringify(newConfig),
      //   schemaData: JSON.stringify(schema),
      // });
    }

    updateContext(draft => {
      // @ts-ignore
      draft.key = Math.random();
      const res = transform(result.data);
      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
    });
  };

  useEffect(() => {
    setBtnLoading(false);
  }, [visible]);

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
