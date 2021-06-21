import { useSelector } from 'react-redux';

const ExportConfig = props => {
  const config = useSelector(state => state.config);
  const exampleCode = `
    import React, { useState } from "react";

    const config = ${JSON.stringify(config)}
    const Example = (props) => {

    return (
        <GISDK
            key={key}
            config={config}
            services={{
            getGraphData,
            getSubGraphData,
            }}
        >
        );
    }
    `;
  return <span>{exampleCode}</span>;
};

export default ExportConfig;
