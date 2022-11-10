export type Operator = 'contain' | 'not-contain' | 'eql' | 'not-eql' | 'gt' | 'lt' | 'gte' | 'lte';

export interface Expression {
  name: string;
  operator: Operator;
  value: string | number;
}

export interface Condition {
  nodeTypes: string[];
  expressions?: Expression[];
  logic?: boolean;
  groupIndex: number | string;
  checked?: boolean;
}
export const getOperatorList = (type: 'long' | 'string' | 'double') => {
  if (type === 'string') {
    return [
      {
        label: '包含',
        value: 'contain',
      },
      {
        label: '不包含',
        value: 'not-contain',
      },
      {
        label: '等于',
        value: 'eql',
      },
      {
        label: '不等于',
        value: 'not-eql',
      },
    ];
  } else if (type === 'long' || type === 'double') {
    return [
      {
        label: '等于',
        value: 'eql',
      },
      {
        label: '不等于',
        value: 'not-eql',
      },
      {
        label: '大于',
        value: 'gt',
      },
      {
        label: '大于等于',
        value: 'gte',
      },
      {
        label: '小于',
        value: 'lt',
      },
      {
        label: '小于等于',
        value: 'lte',
      },
    ];
  } else if (type === 'boolean') {
    return [
      {
        label: '等于',
        value: 'eql',
      },
      {
        label: '不等于',
        value: 'not-eql',
      },
    ];
  }

  return [];
};

export const formatProperties = (node: {
  id: string;
  data?: Record<string, string | number>;
}): Record<string, string | number> => {
  if (node.data && Object.keys(node.data)?.length) {
    // 如果有 data 属性，则取 data 属性和 nodeType
    const { nodeType, edgeType } = node as any;
    return nodeType ? {
      ...node.data,
      nodeType,
    } : {
      ...node.data,
      edgeType,
    };
  }
  //@ts-ignore
  return node || {};
  // return node.data || {};
};

const filterByExpression = (data: Record<string, string | number>, expression: Expression): boolean => {
  if (!expression) {
    return false;
  }

  const { name: propertyName = '', operator, value } = expression;
  const name = propertyName.split('-')[0];
  let formatted: string | number = value;

  if (operator === 'eql') {
    return data[name] === formatted;
  } else if (operator === 'not-eql') {
    return data[name] !== formatted;
  } else if (operator === 'contain') {
    return `${data[name]}`.indexOf(`${formatted}`) > -1;
  } else if (operator === 'not-contain') {
    return `${data[name]}`.indexOf(`${formatted}`) === -1;
  } else if (operator === 'gt') {
    return Number(data[name]) > Number(formatted);
  } else if (operator === 'gte') {
    return Number(data[name]) >= Number(formatted);
  } else if (operator === 'lt') {
    return Number(data[name]) < Number(formatted);
  } else if (operator === 'lte') {
    return Number(data[name]) <= Number(formatted);
  }

  return false;
};

export const filterByTopRule = (node, rule: Condition) => {
  const { logic, expressions } = rule;

  // 未配置规则一律通过
  if (!expressions || expressions.length === 0) {
    return true;
  }

  return logic === true
    ? expressions.every(item => filterByExpression(formatProperties(node), item))
    : expressions.some(item => filterByExpression(formatProperties(node), item));
};

export const filterByRules = (nodes, rule) => {
  return nodes.filter(node => {
    return filterByTopRule(node, rule);
  });
};
