import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Form, Radio, Row, Steps, message, Modal, Spin, Upload } from 'antd';
import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { connectGraphScopeService, closeGraphInstance } from '../GraphScopeService';
import LocalFilePanel from './LocalFile';
import ChinaVisDataPanel from './ChinaVisDataPanel';
import ConnectGraphScope from './ConnectGS';
import './index.less';
const { Item } = Form;
const { confirm } = Modal;

const { Step } = Steps;
interface LocalFileProps {
  handleUploadFile: (isCover?: boolean) => Promise<any>;
  handleLoadData: (type: 'LOCAL' | 'DEMO') => void;
  uploadLoading: boolean;
  filesMapping: any;
  onClose: () => void;
  loading: boolean;
  form: any;
}

const GSDataMode: React.FunctionComponent<LocalFileProps> = props => {
  const { handleUploadFile, handleLoadData, onClose, filesMapping, uploadLoading, loading, form } = props;

  const [current, setCurrent] = useImmer({
    activeKey: 0,
  });

  const [gsLoading, setGsLoading] = useState({
    step1Loading: uploadLoading,
    step2Loading: loading,
    closeLoading: false,
  });

  const [modeType, setModeType] = useState<'LOCAL' | 'DEMO'>('LOCAL');

  const next = () => {
    setCurrent(draft => {
      draft.activeKey++;
    });
  };

  const prev = () => {
    setCurrent(draft => {
      draft.activeKey--;
    });
  };

  const handleModelType = e => {
    setModeType(e.target.value);
  };

  const handleConnectGs = async () => {
    const values = await form.validateFields();
    // 调用接口，将用户输入的服务地址及 ID 类型缓存起来，供后面的服务使用
    const result = await connectGraphScopeService(values);
    if (!result.success) {
      message.error('连接GraphScope失败');
      return;
    }
    message.success('连接成功');
    next();
  };

  const handleUploadFileToNext = async () => {
    if (modeType === 'LOCAL') {
      setGsLoading({
        ...gsLoading,
        step1Loading: true,
      });
      if (filesMapping) {
        confirm({
          title: '是否忽略已上传文件?',
          icon: <ExclamationCircleOutlined />,
          content:
            '你已经有上传的文件，是否选择忽略已经上传的文件，，如果选择「忽略已上传文件」，则已经上传的文件不会再次上传，如果选择全量覆盖，若上传同名文件，会覆盖之前上传的文件',
          onOk: async close => {
            // 忽略已上传文件
            close();
            const status = await handleUploadFile(false);
            if (status) {
              await handleLoadData(modeType);
            }
          },
          onCancel: async close => {
            // 全量覆盖
            close();
            const status = await handleUploadFile(true);
            if (status) {
              await handleLoadData(modeType);
            }
          },
          okText: '忽略已上传文件',
          cancelText: '全量覆盖',
        });
      } else {
        setGsLoading({
          ...gsLoading,
          step1Loading: true,
        });
        // 上传
        const status = await handleUploadFile(false);

        if (status) {
          await handleLoadData(modeType);
        }
      }
    } else {
      // 示例数据，开始载图
      await handleLoadData(modeType);
    }
  };

  const deleteInstance = async () => {
    setGsLoading({
      ...gsLoading,
      closeLoading: true,
      step1Loading: false,
    });
    const result = await closeGraphInstance();
    setGsLoading({
      ...gsLoading,
      closeLoading: false,
    });
    if (result.success) {
      message.success('关闭 GraphScope 实例成功');
      return false;
    }
    message.error('关闭 GraphScope 实例失败');
  };

  const steps = [
    {
      title: '配置服务器信息',
      content: (
        <div style={{ margin: '10px 0px 0px 0px' }}>
          <ConnectGraphScope />,
          <Row style={{ padding: '30px 0px 10px 0px', justifyContent: 'center' }}>
            <Button onClick={onClose} style={{ margin: '0 10px' }} shape="round">
              取消
            </Button>
            <Button type="primary" onClick={handleConnectGs} shape="round" loading={gsLoading.step1Loading}>
              进入下一步
            </Button>
          </Row>
        </div>
      ),
    },
    {
      title: '配置数据信息',
      content: (
        <div style={{ margin: '10px 0px 0px 0px' }}>
          <Alert
            message="上传要载入到 GraphScope 引擎中的点边文件，点击「开始载图」后会将数据载入到 GraphScope 中，大约需要 30s 左右的时间，请耐心等待"
            type="info"
            showIcon
            style={{ margin: '12px 0px' }}
          />
          <Row style={{ paddingTop: 16 }}>
            <Col span={24}>
              <Item label="模式" name="type" style={{ marginBottom: 8 }}>
                <Radio.Group defaultValue="LOCAL" onChange={handleModelType}>
                  <Radio value="LOCAL">本地文件</Radio>
                  <Radio value="DEMO">示例数据</Radio>
                  <Radio value="OSS" disabled>
                    OSS
                  </Radio>
                </Radio.Group>
              </Item>
            </Col>
            {modeType === 'LOCAL' && <LocalFilePanel />}
            {modeType === 'DEMO' && <ChinaVisDataPanel />}
          </Row>
          <Row style={{ padding: '30px 0px 10px 0px', justifyContent: 'center' }}>
            <Button style={{ margin: '0 10px' }} shape="round" onClick={deleteInstance}>
              删除实例
            </Button>
            <Button style={{ margin: '0 10px' }} shape="round" onClick={() => prev()}>
              上一步
            </Button>
            <Button type="primary" onClick={handleUploadFileToNext} shape="round" loading={gsLoading.step1Loading}>
              开始载图
            </Button>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <>
      <Steps current={current.activeKey} type="navigation">
        {steps.map((item: any) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current.activeKey].content}</div>
      <div className="steps-action"></div>
    </>
  );
};

export default GSDataMode;
