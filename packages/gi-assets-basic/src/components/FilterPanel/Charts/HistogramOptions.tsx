import { SlidersOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Popover } from 'antd';
import * as React from 'react';
import { IFilterCriteria } from '../type';
interface HistogramOptionsProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
}

const Content = (props: HistogramOptionsProps & { onClose: () => void }) => {
  const { filterCriteria, updateFilterCriteria, onClose } = props;
  const onFinish = e => {
    console.log(e);

    console.log('filterCriteria', filterCriteria);
    //@ts-ignore
    updateFilterCriteria(filterCriteria.id, {
      ...filterCriteria,
      chartOptions: {
        binWidth: e.binWidth,
        min: e.min,
        max: e.max,
      },
    });
    onClose && onClose();
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      style={{ width: '250px' }}
    >
      <Form.Item label="范围最小值" name="min" rules={[{ required: true, message: 'Please input your username!' }]}>
        <InputNumber style={{ width: '120px' }} />
      </Form.Item>

      <Form.Item label="范围最大值" name="max" rules={[{ required: true, message: 'Please input your password!' }]}>
        <InputNumber style={{ width: '120px' }} />
      </Form.Item>
      <Form.Item label="分箱值" name="binWidth" rules={[{ required: true, message: 'Please input your password!' }]}>
        <InputNumber style={{ width: '120px' }} />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          保存分箱配置
        </Button>
      </Form.Item>
    </Form>
  );
};
const HistogramOptions: React.FunctionComponent<HistogramOptionsProps> = props => {
  const { filterCriteria, updateFilterCriteria } = props;
  const [open, setOpen] = React.useState(false);
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  if (filterCriteria.analyzerType === 'HISTOGRAM') {
    return (
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        placement="topLeft"
        title={'设置分箱规则'}
        content={<Content {...props} onClose={hide} />}
        trigger="click"
      >
        <Button type="text" style={{ padding: '4px' }}>
          <SlidersOutlined />
        </Button>
      </Popover>
    );
  }
  return null;
};

export default HistogramOptions;
