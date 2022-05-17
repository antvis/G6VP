import React, { useState } from 'react';
import { createForm, onFormInputChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { FormItem, Input, NumberPicker, Select, Switch } from '@formily/antd';
import { useContext, utils } from '@alipay/graphinsight';

import { Button } from 'antd';
import { SchemaData } from './registerMeta';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    NumberPicker,
    Switch,
  },
});

const AlgorithmAnalysis = ({ serviceId }) => {
  const { updateContext, transform, services } = useContext();

  const service = utils.getService(services, serviceId);

  const [algorithmParams, setAlgorithmParams] = useState({});
  const form = createForm({
    // initialValues: config.props,
    effects() {
      onFormInputChange(({ values }) => {
        const currentValues = JSON.parse(JSON.stringify(values));
        console.log('form value', currentValues);
        setAlgorithmParams(currentValues);
        // if (onChange) {
        //   ref.current.cacheConfigMap.set(ref.current.elementId, currentValues);
        //   onChange(currentValues, ref.current.elementId);
        // }
      });
    },
  });

  const handleExecAlgorithm = async () => {
    console.log('算法参数', algorithmParams);
    // const result = await service(algorithmParams);

    // setBtnLoading(false);
    // console.log('Gremlin 查询结果', result);
    // if (!result || !result.success) {
    //   return;
    // }
  };

  const formSchema = {
    type: 'object',
    properties: SchemaData,
  };

  return (
    <div className="gi-algorithm-analysis">
      <FormProvider form={form}>
        <SchemaField schema={JSON.parse(JSON.stringify(formSchema))} />
      </FormProvider>
      <div>
        <Button type="primary" onClick={handleExecAlgorithm}>
          查询
        </Button>
      </div>
    </div>
  );
};

export default AlgorithmAnalysis;
