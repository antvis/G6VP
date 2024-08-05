// @ts-nocheck
import {
  ArrayCollapse,
  ArrayItems,
  DatePicker,
  FormItem,
  Input,
  NumberPicker,
  Radio,
  Select,
  Switch,
} from '@formily/antd';
import { createSchemaField } from '@formily/react';
import React from 'react';
import { SketchPicker } from 'react-color';
import ColorInput from '../CommonStyleSetting/ColorInput';
import GroupSelect from '../CommonStyleSetting/GroupSelect';
import IconPicker from '../CommonStyleSetting/IconPicker';
import IconSelector from '../CommonStyleSetting/IconSelector';
import { AssetCollapse, FormCollapse, Offset } from '../FormilyForm';
import ModifierPicker from './ModifierPicker';

const SchemaField: React.ReactNode = createSchemaField({
  components: {
    ArrayCollapse,
    ArrayItems,
    AssetCollapse,
    ColorInput,
    DatePicker,
    FormCollapse,
    FormItem,
    GroupSelect,
    IconPicker,
    IconSelector,
    Input,
    ModifierPicker,
    NumberPicker,
    Offset,
    Radio,
    Select,
    SketchPicker,
    Switch,
  },
}) as any;
export default SchemaField;
