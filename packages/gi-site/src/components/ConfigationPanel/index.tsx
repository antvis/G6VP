import * as React from 'react';
import Meta from '@alipay/gi-meta';
import { useDispatch, useSelector } from 'react-redux';

// const state = useSelector(state => state);
// const { config, id } = state;


const onChange = (evt) => {
  



    console.log("ConfigationPanel onChange", evt);
}

const ConfigationPanel = props => {
  return (
    <div className="gi-config-pannel">
      <Meta  {...props} onChange={ onChange }/>
    </div>
  ); 
};

export default ConfigationPanel;
