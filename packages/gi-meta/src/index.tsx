import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import GUI from '@ali/react-datav-gui';


const GIMetaPanel = (configObj, valueObj) => {
  return (<GUI configObj={configObj} valueObj={valueObj} />);
};

export default GIMetaPanel;
