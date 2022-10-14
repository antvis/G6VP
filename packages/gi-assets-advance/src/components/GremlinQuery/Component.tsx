import { useContext, utils } from '@alipay/graphinsight';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Divider, notification } from 'antd';
import { useImmer } from 'use-immer';
import React, { useEffect, useState } from 'react';
import GremlinEditor from './GremlinEditor';
import PublishTemplate from '../PublishTemplate';
import './index.less';

export interface IGremlinQueryProps {
  initialValue?: string;
  height?: number;
  showGutter?: boolean;
  serviceId: string;
  saveTemplateServceId?: string;
  style?: React.CSSProperties | undefined;
  visible?: boolean;
  isShowPublishButton?: boolean;
}

const GremlinQueryPanel: React.FC<IGremlinQueryProps> = ({
  initialValue = '',
  height = 220,
  serviceId,
  saveTemplateServceId = 'GI/PublishTemplate',
  style,
  visible,
  isShowPublishButton,
}) => {
  const { updateContext, transform, services } = useContext();

  const service = utils.getService(services, serviceId);

  const [state, setState] = useImmer<{
    editorValue: string;
    isFullScreen: boolean;
    modalVisible: boolean;
  }>({
    editorValue: initialValue || '',
    isFullScreen: false,
    modalVisible: false,
  });

  const setEditorValue = val => {
    setState(draft => {
      draft.editorValue = val;
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
    });

    setBtnLoading(false);
    if (!result || !result.success) {
      notification.error({
        message: '执行 Gremlin 查询失败',
        description: `失败原因：${result.message}`,
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
    setState(draft => {
      draft.isFullScreen = !state.isFullScreen;
    });
  };

  const handleShowModal = () => {
    setState(draft => {
      draft.modalVisible = true;
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
        <Divider />
        {isShowPublishButton && (
          <Button className={'publishButton'} disabled={!editorValue} onClick={handleShowModal}>
            发布成模板
          </Button>
        )}

        <Button className={'queryButton'} loading={btnLoading} type="primary" onClick={handleClickQuery}>
          执行查询
        </Button>
      </div>
      {state.modalVisible && (
        <PublishTemplate
          saveTemplateServceId={saveTemplateServceId}
          visible={state.modalVisible}
          value={editorValue}
          close={() => {
            setState(draft => {
              draft.modalVisible = false;
            });
          }}
          fileType={'GREMLIN'}
        />
      )}
    </div>
  );
};

export default GremlinQueryPanel;
