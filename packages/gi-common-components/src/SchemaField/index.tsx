import { FormItem, Input, NumberPicker, Radio, Select, Switch } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import React from 'react';
import { SketchPicker } from 'react-color';
import ColorInput from '../CommonStyleSetting/ColorInput';
import GroupSelect from '../CommonStyleSetting/GroupSelect';
import { AssetCollapse, FormCollapse, Offset } from '../FormilyForm';

const SchemaField: React.ReactNode = createSchemaField({
  components: {
    Radio,
    FormItem,
    Input,
    FormCollapse,
    Select,
    NumberPicker,
    Switch,
    SketchPicker,
    ColorInput,
    Offset,
    AssetCollapse,
    GroupSelect,
  },
});
export default SchemaField;
