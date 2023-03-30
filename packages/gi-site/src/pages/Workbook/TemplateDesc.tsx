import * as React from 'react';
import { ITemplate } from '../../services/typing';

const TemplateDesc: React.FunctionComponent<ITemplate | {}> = props => {
  //@ts-ignore
  const { image, desc } = props;
  if (!image) {
    return null;
  }

  return (
    <div>
      <div>
        <img src={image} alt="" width={'300px'} />
      </div>
      <p style={{ padding: '12px 0px' }}>{desc}</p>
    </div>
  );
};

export default TemplateDesc;
