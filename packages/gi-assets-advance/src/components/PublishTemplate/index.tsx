import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Modal, Popconfirm, Row, Select, Table, Tooltip, message } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { useContext, utils } from '@alipay/graphinsight';
import GremlinEditor from '../GremlinQuery/GremlinEditor';
import './index.less';

const { Option } = Select;

export interface IProps {
  value: string;
  visible: boolean;
  close: () => void;
  fileType: 'GREMLIN' | 'GQL' | 'ISOGQL' | 'UNKNOWN';
  saveTemplateServceId: string;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TemplateParam: React.FC<IProps> = ({ fileType, value, visible, close, saveTemplateServceId }) => {
  const [form] = Form.useForm();
  const { services } = useContext();

  // 没有选择
  if (!saveTemplateServceId) {
    message.error('请选择发布成模板的服务');
    return null;
  }

  const saveTemplateService = utils.getService(services, saveTemplateServceId);

  const [state, setState] = useImmer<{
    initValue: string;
    defaultFormValue: {
      parameterName: string;
      valueType: string;
      parameterValue: string;
    };
    paramsList: any[];
    selectValue: string;
    modalVisible: boolean;
    temDescription: string;
    btnLoading: boolean;
  }>({
    initValue: value,
    defaultFormValue: {
      parameterName: '',
      valueType: 'string',
      parameterValue: '',
    },
    paramsList: [],
    selectValue: '',
    modalVisible: false,
    btnLoading: false,
    temDescription: '',
  });

  const { initValue, defaultFormValue, paramsList, selectValue, modalVisible, temDescription, btnLoading } = state;

  const handleValueSelectChange = (currentValue: string) => {
    setState(draft => {
      draft.selectValue = currentValue;
    });
  };

  // 点击参数化按钮，对选择的部分进行参数化
  const showParamsModal = () => {
    setState(draft => {
      draft.modalVisible = true;
    });
    form.setFieldsValue({
      parameterName: '',
      valueType: 'string',
      parameterValue: selectValue.replace(/(\"|\')/g, ''),
    });
  };

  const handleChangeDescription = evt => {
    setState(draft => {
      draft.temDescription = evt.target.value;
    });
  };

  const handleParams = async () => {
    const values = await form.validateFields();
    const currents = [...paramsList];

    // 检查参数化的参数名称是否已经存在，如果存在则覆盖并给出提示信息
    const hasParams = currents.find((t: any) => t.parameterName === values.parameterName);
    if (hasParams) {
      message.info('参数化已经存在的参数，会覆盖已有的参数');
    }

    const resultParams = currents.filter((t: any) => t.parameterName !== values.parameterName);

    resultParams.push(values);

    // 替换 Gremlin 语句
    const reg = new RegExp(`${selectValue}`);
    const templateStr = initValue
      .replace(reg, `{{${values.parameterName}}}`)
      .replace(/(\"|\')(?=\{\{)/, '')
      .replace(/(?<=\}\})(\"|\')/, '');

    setState(draft => {
      draft.paramsList = [...resultParams];
      draft.initValue = templateStr;
      draft.modalVisible = false;
      draft.defaultFormValue = {
        parameterName: '',
        valueType: 'string',
        parameterValue: '',
      };
    });
  };

  const publishTemplate = async () => {
    const values = await form.validateFields();
    if (!values.templateName) {
      message.error('模板名称为空或格式不正确!');
      return;
    }

    setState(draft => {
      draft.btnLoading = true;
    });
    if (!saveTemplateService) {
      return;
    }
    const result = await saveTemplateService({
      graphLanguageType: fileType,
      queryTemplate: initValue,
      templateName: values.templateName,
      description: temDescription,
      templateParameterList: paramsList,
    });

    setState(draft => {
      draft.btnLoading = false;
    });

    if (!result) {
      return;
    }

    message.success('发布模板成功');
    close();
  };

  const handleDelete = record => {
    const filterList = paramsList.filter(
      d => d.parameterName !== record.parameterName && d.parameterValue !== record.parameterValue,
    );
    setState(draft => {
      draft.paramsList = filterList;
    });
  };

  const tableColumns = [
    {
      title: '参数名称',
      dataIndex: 'parameterName',
      key: 'parameterName',
    },
    {
      title: '类型',
      dataIndex: 'valueType',
      key: 'valueType',
    },
    {
      title: '替换值',
      dataIndex: 'parameterValue',
      key: 'parameterValue',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)} okText="确定" cancelText="取消">
          <a>
            <DeleteOutlined />
          </a>
        </Popconfirm>
      ),
    },
  ];

  const replaceFun = match => {
    return `<span style='opacity: 0.2'>${match}</span>`;
  };

  const createMarkup = () => {
    return {
      __html: initValue.trim().replace(/(\{\{)\w+(\}\})/g, replaceFun),
    };
  };

  return (
    <Drawer
      title="发布成模板"
      visible={visible}
      width={700}
      onClose={close}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button
            onClick={close}
            style={{
              marginRight: 8,
            }}
          >
            取消
          </Button>
          <Button type="primary" onClick={publishTemplate} loading={btnLoading}>
            发布
          </Button>
        </div>
      }
    >
      <Row className="templateParamContainer">
        <Col
          span={24}
          className="title"
          style={{
            marginBottom: -8,
          }}
        >
          <Form name="templateNames" form={form}>
            <Form.Item
              label="模板名称"
              name="templateName"
              tooltip={{
                title: '模板名称只能包含字母、数字或下划线，且只能以字母开头',
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input
                size="small"
                style={{
                  width: 350,
                  border: '1px solid #434343',
                  marginLeft: 16,
                }}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col
          span={16}
          className="title"
          style={{
            marginTop: 0,
          }}
        >
          原始语句
          <span className="description">请选择要参数化的内容，然后点击右边的参数化按钮进行下一步的操作</span>
        </Col>
        <Col
          span={8}
          style={{
            textAlign: 'right',
            marginTop: 20,
          }}
        >
          <Tooltip title={`选择 ${fileType} 中的参数值后进行参数化操作`}>
            <Button size="small" onClick={showParamsModal} disabled={!selectValue}>
              参数化
            </Button>
          </Tooltip>
        </Col>
        <Col
          span={24}
          style={{
            border: '1px solid #d9d9d9',
          }}
        >
          <GremlinEditor
            initialValue={initValue}
            height={150}
            isReadOnly={true}
            onSelectionChange={handleValueSelectChange}
          />
        </Col>
        <Col span={24} className="title">
          模板语句
          <pre className="tpre" dangerouslySetInnerHTML={createMarkup()}></pre>
        </Col>
        <Col span={24} className="title">
          参数列表
        </Col>
        <Col span={24}>
          <Table
            columns={tableColumns}
            dataSource={paramsList}
            pagination={{
              hideOnSinglePage: true,
              size: 'small',
            }}
          />
        </Col>
        <Col span={24} className="title">
          模板描述
        </Col>
        <Col span={24}>
          <Input.TextArea
            rows={3}
            onChange={handleChangeDescription}
            style={{
              border: '1px solid #434343',
            }}
          />
        </Col>
      </Row>
      <Modal
        title={`${fileType} 参数化`}
        visible={modalVisible}
        onOk={handleParams}
        width={350}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setState(draft => {
            draft.modalVisible = false;
          });
        }}
        bodyStyle={{
          padding: '8px 24px',
        }}
      >
        <Form {...layout} name="templateParams" form={form} initialValues={defaultFormValue}>
          <Form.Item
            label="参数名称"
            name="parameterName"
            rules={[
              {
                required: true,
                message: '请输入参数的名称!',
              },
            ]}
            style={{
              marginBottom: 16,
            }}
          >
            <Input size="small" />
          </Form.Item>

          <Form.Item
            label="参数类型"
            name="valueType"
            rules={[
              {
                required: true,
                message: '请选择参数类型!',
              },
            ]}
            style={{
              marginBottom: 16,
            }}
          >
            <Select size="small">
              <Option value="string">string</Option>
              <Option value="long">long</Option>
              <Option value="double">double</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="parameterValue"
            label="替换值"
            style={{
              marginBottom: 0,
            }}
          >
            <Input size="small" disabled />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default TemplateParam;
