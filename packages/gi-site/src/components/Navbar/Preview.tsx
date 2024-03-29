import { Button } from 'antd';
import * as React from 'react';

import { DesktopOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import $i18n from '../../i18n';
interface PreviewProps {
  context: any;
}

const Preview: React.FunctionComponent<PreviewProps> = props => {
  const { context } = props;
  const { id } = context;
  const history = useHistory();
  const handleClick = async () => {
    history.push(`/preview/${id}`);
  };

  return (
    <div>
      <Button size="small" onClick={handleClick} icon={<DesktopOutlined />} type="text">
        {$i18n.get({ id: 'gi-site.components.Navbar.Preview.Preview', dm: '预览' })}
      </Button>
    </div>
  );
};

export default Preview;
