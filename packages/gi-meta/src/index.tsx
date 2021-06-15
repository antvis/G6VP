import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import GUI from '@ali/react-datav-gui';


const GIMetaPanel = (props) => {
  return (<GUI configObj={props.configObj} valueObj={props.valueObj} />);
};

export default GIMetaPanel;
