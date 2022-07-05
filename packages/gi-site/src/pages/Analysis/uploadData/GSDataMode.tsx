import { PlusOutlined, UploadOutlined, MinusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Form, Radio, Row, Steps, message, Switch, Modal, Spin, Upload } from 'antd';
import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { createCupidInstance, loadOdpsDataToGraphScope } from '../../../services/graphcompute';
import LocalFilePanel from './LocalFile';
import ODPSTablePanel from './ODPSTablePanel';
import ODPSMode from './ODPS';
import { useContext } from '../hooks/useContext';
import './index.less';
const { Item } = Form;
const { confirm } = Modal;

const { Step } = Steps;
interface LocalFileProps {
  handleUploadFile: (isCover?: boolean) => Promise<any>;
  handleLoadData: () => void;
  updateSchemaData: () => void;
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

  const { context } = useContext();
  const { id } = context;
  console.log('context', context);

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
    // setGsLoading({
    //   ...gsLoading,
    //   step1Loading: true,
    // });
    if (modeType === 'ODPS') {
      // 如果不存在，则需要创建，否则直接进入下一步

      const values = await form.validateFields();
      console.log('odps form value', values);
      setOdpsFormValue(values);
      // const { accessId, accessKey, project, endpoint } = values;
      // const createParams = {
      //   projectId: id,
      //   accessId,
      //   accessKey,
      //   project,
      //   endpoint,
      // };
      // const result = await createCupidInstance(createParams);
      // console.log('create cupid instance', result);
      // setGsLoading({
      //   ...gsLoading,
      //   step1Loading: false,
      // });
      // if (!result || !result.success) {
      //   message.error('创建 cupid 实例失败');
      //   return;
      // }
      // const { instance_id, httpserver } = result;
      // console.log('返回结果', instance_id, httpserver);
      // // 创建成功后，将 cupidInstanceId 和 cupidHttpServer 存储到 localstorage 中
      // // localStorage.setItem('cupidInstanceId', instance_id);
      // localStorage.setItem('cupidHttpServer', httpserver);

      next();
    } else if (modeType === 'LOCAL') {
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
    } else if (modeType === 'ODPS') {
      // ODPS 数据源
      const values = await form.validateFields();
      console.log('odps form step2', odpsFormValue, values);
      // 针对 ODPS 数据源进行载图
      const odpsLoadGraphParams = {
        project: odpsFormValue.project,
        projectId: id,
        ...values,
      };
      const result = await loadOdpsDataToGraphScope(odpsLoadGraphParams);

      setGsLoading({
        ...gsLoading,
        step2Loading: false,
      });

      const { success: loadSuccess, message: loadMessage, data: loadData } = result;
      if (!loadSuccess) {
        message.error(`数据加载失败: ${loadMessage}`);
        return;
      }

      const { graphName, graphURL } = loadData;
      localStorage.setItem('graphScopeGraphName', graphName);
      localStorage.setItem('graphScopeGremlinServer', graphURL);

      message.success('加载数据到 GraphScope 引擎成功');

      // 载图成功后，更新 Project 中的 SchemeData
      updateSchemaData();
      close();
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
                  <Radio value="ODPS">ODPS</Radio>
                  <Radio value="OSS" disabled>
                    OSS
                  </Radio>
                </Radio.Group>
              </Item>
            </Col>
            {modeType === 'LOCAL' && <LocalFilePanel />}
            {modeType === 'ODPS' && (
              <>
                {gsLoading.step1Loading ? (
                  <Alert
                    message={<span>正在创建 cupId 实例，预计需要 5-10 分钟，请耐心等待……</span>}
                    type="warning"
                    showIcon
                    style={{ margin: '0px 0px 16px 0' }}
                  />
                ) : (
                  <>
                    {/* <Alert
                    message={
                      <span>
                        请确认输入正确的 AccessId、AccessKey、Project 及 endpoint 信息，可以在
                        <a href="https://datastudio.dw.alibaba-inc.com/">DataStudio 平台</a>获取正确的信息
                      </span>
                    }
                    type="info"
                    showIcon
                    style={{ margin: '0px 0px 16px 0' }}
                  /> */}
                    <Alert
                      message={
                        <span>临时方案：只需要添加 project 字段，其他字段不需要输入，直接点击进入下一步即可</span>
                      }
                      type="warning"
                      showIcon
                      style={{ margin: '0px 0px 16px 0' }}
                    />
                  </>
                )}
                <ODPSMode />
              </>
            )}
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
          {modeType === 'ODPS' && (
            <>
              <ODPSTablePanel />
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
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current.activeKey].content}</div>
      <div className="steps-action"></div>
    </>
  );
};

export default GSDataMode;
