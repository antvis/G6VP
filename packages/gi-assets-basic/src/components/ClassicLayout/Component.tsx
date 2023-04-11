import React from "react";
import './Component.less';
interface Props {
  children?: React.ReactNode;
}
export default (props: Props) => {
  const { children } = props;
  return <div className='gi-classic-layout'>
    <div className='gi-classic-side'>
      
    </div>
    <div className='g-classic-v'>
      <div className='gi-classic-toolbar'>

      </div>
      <div className='gi-classic-canvas'>
        {
          children
        }
      </div>
    </div>
  </div>
}