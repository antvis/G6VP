import { Button, message, Steps, Select, Row, Col } from 'antd';
import * as React from 'react';

interface CreatePanelProps {}

const { Step } = Steps;
const { Option } = Select;

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

const CreatePanel: React.FunctionComponent<CreatePanelProps> = props => {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
      {current === 0 && (     
        <Row>
            <span>
              选择解决方案：
            </span>
            <Select
              style={{ width: 200 }}
              placeholder="Select a program"
            >
              <Option value="knowledgeGraph">图谱</Option>
              <Option value="riskControl">风控</Option>
            </Select>
          </Row>)}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
              Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatePanel;
