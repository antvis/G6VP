import { useContext, utils } from '@alipay/graphinsight';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Divider, notification } from 'antd';
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

  const [state, setState] = React.useState({
    editorValue: initialValue || '',
    isFullScreen: false,
  });
  const setEditorValue = val => {
    setState(preState => {
      return {
        ...preState,
        editorValue: val,
      };
    });
  };
  const { editorValue, isFullScreen } = state;

  const handleChangeEditorValue = (value: string) => {
    setEditorValue(value);
  };

  const [btnLoading, setBtnLoading] = useState(false);

  const handleClickQuery = async () => {
    setBtnLoading(true);
    if (!service) {
      return;
    }

    const result = await service({
      value: editorValue,
    }).catch(error => {
      setBtnLoading(false);
      notification.error({
        message: '服务请求失败',
        description: error,
      });
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

    updateContext(draft => {
      // @ts-ignore
      const res = transform(result.data);
      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
    });
  };
  const toggleFullScreen = () => {
    setState(preState => {
      return {
        ...preState,
        isFullScreen: !preState.isFullScreen,
      };
    });
  };

  useEffect(() => {
    setBtnLoading(false);
  }, [visible]);

  const containerStyle: React.CSSProperties = isFullScreen
    ? {
        position: 'fixed',
        left: '0px',
        right: '0px',
        top: '0px',
        zIndex: 9999,
      }
    : {};

  return (
    <div className={'gremlineQueryPanel'} style={{ ...style, ...containerStyle }}>
      <div style={{ height: '32px', lineHeight: '32px' }}>
        请输入 Gremlin 语句进行查询
        <Button
          style={{ float: 'right' }}
          type="text"
          onClick={toggleFullScreen}
          icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        ></Button>
      </div>
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
