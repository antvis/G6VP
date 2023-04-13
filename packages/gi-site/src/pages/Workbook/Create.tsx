import { utils } from '@antv/gi-sdk';
import { Button, Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import SegmentedTabs from '../../components/SegmentedTabs';
import { getSearchParams } from '../../components/utils';
import * as DatasetService from '../../services/dataset';
import getConfigByEngineId from '../../services/initial.data/getConfigByEngineId';
import * as ProjectServices from '../../services/project';
import * as TemplateService from '../../services/template';
import { IDataset, ITemplate } from '../../services/typing';
import Recover from '../Workspace/Recover';
import TemplateDesc from './TemplateDesc';

interface CreateProps {}
const styles = {
  container: {
    borderRadius: '8px',
    padding: '24px',
    background: 'unset',
  },
};

const Create: React.FunctionComponent<CreateProps> = props => {
  //@ts-ignore
  const { history } = props;
  const [form] = Form.useForm();
  const [state, updateState] = useImmer({
    name: '',
    datasetId: '',
    templateId: '',
    templates: [] as ITemplate[],
    template: {},
    datasets: [] as IDataset[],
    dataset: {} as IDataset,
  });

  useEffect(() => {
    (async () => {
      const { searchParams } = getSearchParams(window.location);
      const datasetId = searchParams.get('datasetId');
      const templateId = searchParams.get('templateId');
      const datasets = await DatasetService.allLists();
      const templates = await TemplateService.list();
      form.setFieldsValue({
        datasetId: datasetId || '',
        templateId: templateId || '',
      });
      updateState(draft => {
        draft.templates = templates;
        draft.datasets = datasets;
        draft.templateId = templateId || '';
        draft.datasetId = datasetId || '';
        draft.template = templates.find(item => item.id === templateId) || {};
        draft.dataset = datasets.find(item => item.id === datasetId) || {};
      });
    })();
  }, []);

  const { templates, datasets, template, dataset } = state;

  /** 以下是计算的值 */
  const datasetOptions = datasets.map(item => {
    return {
      ...item,
      value: item.id,
      label: `${item.name} (${item.id})`,
    };
  });
  const templateOptions = templates.map(item => {
    return {
      ...item,
      value: item.id,
      label: item.name,
    };
  });

  const handleChangeTemplate = (value, record) => {
    updateState(draft => {
      draft.templateId = value;
      draft.template = record;
    });
  };
  const handleChangeDataset = (value, record) => {
    updateState(draft => {
      draft.datasetId = value;
      draft.dataset = record;
    });
  };

  const handleSubmit = async () => {
    //@ts-ignore
    const values = await form.validateFields();

    const style = utils.generatorStyleConfigBySchema(dataset.schemaData);
    const { nodes, edges, layout, activeAssetsKeys, components } = getConfigByEngineId(
      dataset.engineId,
      JSON.parse(JSON.stringify(template)),
    );

    const projectId = await ProjectServices.create({
      datasetId: dataset.id,
      name: values.name,
      status: 1, // 1 正常项目， 0 删除项目
      tag: '',
      members: '',
      projectConfig: {
        nodes,
        edges,
        layout,
        components,
        ...style,
      },
      activeAssetsKeys,
      type: 'project',
    });
    history.push(`/workspace/${projectId}`);
  };

  const handleRecover = async params => {
    const { GI_ASSETS_PACKAGES, name, datasetId, projectConfig, activeAssetsKeys, members } = params;
    const projectId = await ProjectServices.create({
      datasetId,
      name,
      status: 0, // 0 正常项目， 1删除项目
      members,
      projectConfig,
      activeAssetsKeys,
      type: 'project',
    });
    try {
      const PRE_GI_ASSETS_PACKAGES = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
      localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify({ ...PRE_GI_ASSETS_PACKAGES, ...GI_ASSETS_PACKAGES }));
      history.push(`/workspace/${projectId}?nav=data`);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div>
      <SegmentedTabs
        style={styles.container}
        defaultActive="new"
        items={[
          {
            key: 'new',
            label: '新建画布',
            children: (
              <Form form={form} layout="vertical">
                <Form.Item
                  label="工作薄名称"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '请输入画布名称!',
                    },
                  ]}
                >
                  <Input placeholder="请填写画布名称" />
                </Form.Item>
                <Form.Item
                  label="选择数据集"
                  name="datasetId"
                  rules={[
                    {
                      required: true,
                      message: '请选择数据集!',
                    },
                  ]}
                >
                  <Select placeholder="请选择数据集" options={datasetOptions} onChange={handleChangeDataset}></Select>
                </Form.Item>
                <Form.Item
                  label="选择模版"
                  name="templateId"
                  rules={[
                    {
                      required: true,
                      message: '请选择模版!',
                    },
                  ]}
                >
                  <Select placeholder="请选择模版" options={templateOptions} onChange={handleChangeTemplate}></Select>
                </Form.Item>
                <TemplateDesc {...template} />

                <Form.Item>
                  <Button type="primary" onClick={handleSubmit}>
                    创建
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'recover',
            label: '恢复工作簿',
            children: <Recover onRecover={handleRecover} />,
          },
        ]}
      />
    </div>
  );
};

export default Create;
