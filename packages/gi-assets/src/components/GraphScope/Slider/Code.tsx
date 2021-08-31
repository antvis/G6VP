import React from 'react';
import './style.less';

export default ({ codeList = [] }: { codeList: string[] }) => {
  return (
    <ul className="graphinSight_sider_code_list">
      {codeList.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};
