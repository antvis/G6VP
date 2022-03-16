import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, message, Space, Tooltip } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import ActionList from '../../../../components/ActionList';
import CollapseCard from '../../../../components/CollapseCard';
import { createAssets, createNewProjectOnAntCode } from '../../../../services/assets';
import { TYPE_MAPPING } from '../../../Market/Constants';
interface DataServiceProps {
  projectId: string;
  serviceLists: any[];
}

export interface FormValues {
  id: string;
  displayName: string;
  mode: 'MOCK' | 'API';
  content: string;
}
const DataService: React.FunctionComponent<DataServiceProps> = props => {
  const { projectId, serviceLists } = props;

  const [state, updateState] = useImmer<{
    visible: boolean;
    formValues: FormValues;
    modalStatus: 'EDIT' | 'CREAT';
  }>({
    visible: false,
    formValues: {
      id: '',
      displayName: '',
      mode: 'MOCK',
      content: '',
    },
    modalStatus: 'CREAT',
  });
  const { visible, formValues } = state;

  const [form] = Form.useForm();
  const createMockService = async values => {
    const { id, displayName, mode, content } = values;

    // 数据服务不需要在 antcode 上创建仓库
    // step1: 在 antcode 上创建仓库
    const projectName = `${projectId}_${id}`;
    const createResult = await createNewProjectOnAntCode({
      projectName,
      description: displayName,
      type: TYPE_MAPPING['services'],
    });

    if (!createResult || !createResult.success) {
      message.error('创建项目失败：' + createResult.errorMsg);
      return;
    }

    // step2: 将资产插入到数据库中
    const dbResponse = await createAssets({
      displayName,
      name: id,
      type: TYPE_MAPPING['services'],
      description: displayName,
      version: '0.0.1',
      branchName: 'master',
      projectId,
      sourceCode: 'export default (data) => {\n return data \n}',
    });

    if (!dbResponse || !dbResponse.success) {
      message.error('创建项目失败：' + dbResponse.errorMsg);
      return;
    }

    const { data } = dbResponse;

    // step3: 跳转到资产编辑页面
    window.open(
      `#/services//${data.insertId}?assetId=${data.insertId}&project=${projectName}&branch=master&type=${TYPE_MAPPING['services']}`,
    );
  };
  const handleSubmit = async values => {
    if (values.mode === 'MOCK') {
      createMockService(values);
    }
  };

  const handleClick = () => {
    updateState(draft => {
      draft.visible = true;
    });
  };

  const handleClose = () => {
    updateState(draft => {
      draft.visible = false;
    });
  };
  /**  form的联动真是jio了 */
  const onValuesChange = changedValues => {
    const [key] = Object.keys(changedValues);
    if (key === 'mode') {
      updateState(draft => {
        draft.formValues.mode = changedValues.mode;
      });
    }
  };

  return (
    <div>
      <CollapseCard
        title="数据服务"
        extra={
          <Button
            type="dashed"
            style={{ width: '100%' }}
            size="small"
            onClick={() => {
              window.open(`#/services/${projectId}`);
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        }
      >
        {serviceLists.map(item => {
          return (
            <ActionList
              key={item.id}
              title={item.id}
              extra={
                <Space>
                  <Tooltip placement="top" title={'编辑服务'}>
                    <EditOutlined
                      onClick={() => {
                        window.open(`#/services/${projectId}?serviceId=${item.id}`);
                      }}
                    />
                  </Tooltip>
                </Space>
              }
            ></ActionList>
          );
        })}
      </CollapseCard>
    </div>
  );
};

export default DataService;
