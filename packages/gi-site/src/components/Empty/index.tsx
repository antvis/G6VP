import { Button, Empty } from 'antd';
import * as React from 'react';
import { history } from 'umi';
interface EmptyDemoProps {
  url: string;
  title: string;
}

const EmptyDemo: React.FunctionComponent<EmptyDemoProps> = props => {
  const { url, title } = props;

  return (
    <Empty
      image={`${window['GI_PUBLIC_PATH']}image/empty.svg`}
      imageStyle={{
        height: 60,
      }}
      description={<span>{title}</span>}
    >
      <Button
        type="primary"
        onClick={() => {
          history.push(url);
        }}
      >
        {$i18n.get({ id: 'gi-site.components.Empty.StartCreating', dm: '开始创建' })}
      </Button>
    </Empty>
  );
};

export default EmptyDemo;
