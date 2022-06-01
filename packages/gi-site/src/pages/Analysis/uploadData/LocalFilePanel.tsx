import { PlusOutlined, UploadOutlined, MinusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Form, Radio, Row, Steps, Table, Switch, Modal, Input, Upload } from 'antd';
import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import './index.less';
const { Item } = Form;
const { confirm } = Modal;

const { Step } = Steps;
interface LocalFileProps {
  handleUploadFile: (isCover?: boolean) => boolean;
  handleLoadData: () => void;
  uploadLoading: boolean;
  filesMapping: any;
  close: () => void;
  loading: boolean;
}

const LocalFilePanel: React.FunctionComponent<LocalFileProps> = props => {
  const { handleUploadFile, handleLoadData, close, filesMapping, uploadLoading, loading } = props;

  const [current, setCurrent] = useImmer({
    activeKey: 0,
  });

  const [modeType, setModeType] = useState('LOCAL');

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
  };

  const handleLoadDataToGraphScope = async () => {
    await handleLoadData();
  };

  const fileProps = {
    beforeUpload: () => false,
  };

  const steps = [
    {
      title: '配置数据信息',
      content: (
        <div style={{ margin: '10px 0px 0px 0px' }}>
          <Row style={{ paddingTop: 16 }}>
            <Col span={12}>
              <Item label="模式" name="type" style={{ marginBottom: 8 }}>
                <Radio.Group defaultValue="LOCAL" onChange={handleModelType}>
                  <Radio value="LOCAL">本地文件</Radio>
                  <Radio value="OSS" disabled>
                    OSS
                  </Radio>
                  <Radio value="ODPS" disabled>
                    ODPS
                  </Radio>
                </Radio.Group>
              </Item>
            </Col>
            <Col span={24}>
              {modeType === 'LOCAL' && (
                <Alert
                  message={
                    <span>
                      请确保CSV文件格式正确，如果值为字符串，需要添加引号，具体请参数
                      <a href="https://www.jianshu.com/p/fd1b4cd6d31d">如何为Excel单元格字符串前后批量添加引号</a>
                    </span>
                  }
                  type="info"
                  showIcon
                  style={{ margin: '0px 0px 16px 0' }}
                />
              )}
              <Row>
                <Col span={11} style={{ marginRight: 24 }}>
                  <h4>点配置列表</h4>
                  <Form.List name="nodeConfigList">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Row
                            key={field.key}
                            style={{
                              border: '1px solid #ccc',
                              padding: 16,
                              paddingBottom: 0,
                              marginBottom: 16,
                            }}
                          >
                            <Col span={22} style={{ marginBottom: 16 }}>
                              <h5>第 {index + 1} 组点配置</h5>
                            </Col>
                            {index !== 0 && (
                              <Col span={2} style={{ textAlign: 'right', fontSize: 16 }}>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                              </Col>
                            )}
                            <Col span={12}>
                              <Item label="点类型" name={[field.name, 'nodeType']}>
                                <Input style={{ width: 125 }} />
                              </Item>
                            </Col>
                            <Col span={12}>
                              <Item label="点数据文件" name={[field.name, 'nodeFileList']}>
                                <Upload {...fileProps} name="nodes" maxCount={1}>
                                  <Button icon={<UploadOutlined />}>上传点文件</Button>
                                </Upload>
                              </Item>
                            </Col>
                          </Row>
                        ))}

                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            增加点配置
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
                <Col span={12}>
                  <h4>边配置列表</h4>
                  <Form.List name="edgeConfigList">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Row
                            key={field.key}
                            style={{
                              border: '1px solid #ccc',
                              padding: 16,
                              paddingBottom: 0,
                              marginBottom: 16,
                            }}
                          >
                            <Col span={22} style={{ marginBottom: 16 }}>
                              <h5>第 {index + 1} 组边配置</h5>
                            </Col>
                            <Col span={2} style={{ textAlign: 'right', fontSize: 16 }}>
                              <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Col>
                            <Col span={12}>
                              <Item label="边文件类型" name={[field.name, 'edgeType']}>
                                <Input style={{ width: 125 }} />
                              </Item>
                            </Col>
                            <Col span={12}>
                              <Item label="边数据文件" name={[field.name, 'edgeFileList']}>
                                <Upload {...fileProps} name="edges" maxCount={1}>
                                  <Button icon={<UploadOutlined />}>上传边文件</Button>
                                </Upload>
                              </Item>
                            </Col>
                            <Col span={12}>
                              <Item label="边起点类型" name={[field.name, 'sourceNodeType']}>
                                <Input style={{ width: 125 }} />
                              </Item>
                            </Col>
                            <Col span={12}>
                              <Item label="边终点类型" name={[field.name, 'targetNodeType']}>
                                <Input style={{ width: 125 }} />
                              </Item>
                            </Col>
                          </Row>
                        ))}

                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            增加边配置
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ padding: '30px 0px 10px 0px', justifyContent: 'center' }}>
            <Button onClick={close} style={{ margin: '0 10px' }} shape="round">
              取消
            </Button>
            <Button type="primary" onClick={handleUploadFileToNext} shape="round" loading={uploadLoading}>
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
          <Row style={{ justifyContent: 'center' }}>
            <Button style={{ margin: '0 10px' }} shape="round" onClick={() => prev()}>
              上一步
            </Button>
            <Button type="primary" shape="round" onClick={handleLoadDataToGraphScope} loading={loading}>
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

export default LocalFilePanel;
