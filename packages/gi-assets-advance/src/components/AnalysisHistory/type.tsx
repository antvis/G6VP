export type TemplateNode = {
  id: string;
  type: 'ccircle' | 'crect';
  label: string;
  color?: string;
  componentId: string;
  description?: string;
  errorMsg?: string;
  content: {
    timestamp: number;
    type: 'query' | 'analyse' | 'configure';
    subType: string;
    statement: string;
    img: string;
  };
  style: any;
  params: {
    [field: string]: unknown;
  };
  parameterized: {
    [field: string]: unknown;
  };
  configured: {
    [field: string]: unknown;
  };
};

export type TemplateData = {
  id: string;
  name: string;
  description?: string;
  nodes: TemplateNode[];
  edges: {
    id: string;
    source: string;
    target: string;
    sourceAnchor?: number;
    targetAnchor?: number;
    style?: any;
  }[];
};
