import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Form, Radio, Row, Steps, message, Switch, Modal, Spin, Upload } from 'antd';
import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import LocalFilePanel from './LocalFile';
import './index.less';
const { Item } = Form;
const { confirm } = Modal;

const { Step } = Steps;
interface LocalFileProps {
  handleUploadFile: (isCover?: boolean) => Promise<any>;
  handleLoadData: () => void;
  updateSchemaData: (mode: string) => void;
  uploadLoading: boolean;
  filesMapping: any;
  close: () => void;
  loading: boolean;
  form: any;
}

const GSDataMode: React.FunctionComponent<LocalFileProps> = props => {
  const {
    handleUploadFile,
    handleLoadData,
    updateSchemaData,
    close,
    filesMapping,
    uploadLoading,
    loading,
    form,
  } = props;

  const projectId = localStorage.getItem('GI_ACTIVE_PROJECT_ID');

  const [current, setCurrent] = useImmer({
    activeKey: 0,
  });

  const [gsLoading, setGsLoading] = useState({
    step1Loading: uploadLoading,
    step2Loading: loading,
  });

  const [modeType, setModeType] = useState('LOCAL');
  const [odpsFormValue, setOdpsFormValue] = useState({} as any);

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
          onOk: async () => {
            // 忽略已上传文件
            const status = await handleUploadFile(false);
            if (status) {
              next();
            }
          },
          onCancel: async () => {
            // 全量覆盖
            const status = await handleUploadFile(true);
            if (status) {
              next();
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
          next();
        }
      }
    }
  };

  const handleLoadDataToGraphScope = async () => {
    setGsLoading({
      ...gsLoading,
      step2Loading: true,
    });
    if (modeType === 'LOCAL') {
      // 本地数据，则开始载图
      await handleLoadData();
    }
  };

  const steps = [
    {
      title: <>{modeType === 'LOCAL' ? '配置数据信息' : '配置ODPS信息'}</>,
      content: (
        <div style={{ margin: '10px 0px 0px 0px' }}>
          <Row style={{ paddingTop: 16 }}>
            <Col span={24}>
              <Item label="模式" name="type" style={{ marginBottom: 8 }}>
                <Radio.Group defaultValue="LOCAL" onChange={handleModelType}>
                  <Radio value="LOCAL">本地文件</Radio>
                  <Radio value="OSS" disabled>
                    OSS
                  </Radio>
                </Radio.Group>
              </Item>
            </Col>
            {modeType === 'LOCAL' && <LocalFilePanel />}
          </Row>
          <Row style={{ padding: '30px 0px 10px 0px', justifyContent: 'center' }}>
            <Button onClick={close} style={{ margin: '0 10px' }} shape="round">
              取消
            </Button>
            <Button type="primary" onClick={handleUploadFileToNext} shape="round" loading={gsLoading.step1Loading}>
              进入下一步
            </Button>
          </Row>
        </div>
      ),
    },
    {
      title: '将数据载入到 GraphScope 中',
      content: (
        <div className="dataCheck-panel">
          {modeType === 'LOCAL' && (
            <>
              <Alert
                message="请确认节点 ID 的数据类型，默认为 string，点击确认后会开始将数据载入到 GraphScope 中，大约需要 30s 左右的时间，请耐心等待"
                type="info"
                showIcon
                style={{ margin: '12px 0px' }}
              />
              <Row>
                <Col span={24}>
                  <Item label="ID字段类型" name="isStringType">
                    <Switch defaultChecked checkedChildren="string" unCheckedChildren="int64" />
                  </Item>
                </Col>
              </Row>
            </>
          )}
          <Row style={{ justifyContent: 'center' }}>
            <Button style={{ margin: '0 10px' }} shape="round" onClick={() => prev()}>
              上一步
            </Button>
            <Button type="primary" shape="round" onClick={handleLoadDataToGraphScope} loading={gsLoading.step2Loading}>
              进入分析
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
