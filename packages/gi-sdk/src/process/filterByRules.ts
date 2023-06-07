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

export const formatProperties = (node: {
  id: string;
  data?: Record<string, string | number>;
}): Record<string, string | number> => {
  if (node.data && Object.keys(node.data)?.length) {
    // 如果有 data 属性，则取 data 属性和 nodeType
    const { nodeType, edgeType } = node as any;
    return nodeType
      ? {
          ...node.data,
          nodeType,
        }
      : {
          ...node.data,
          edgeType,
        };
  }
  //@ts-ignore
  return node || {};
  // return node.data || {};
};

// lite version of lodash.get
function get<T = any>(obj: any, path: string): T | undefined {
  const pathArray = path.split('.');
  let result = obj;

  for (const key of pathArray) {
    if (result && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
}

const filterByExpression = (data: Record<string, string | number>, expression: Expression): boolean => {
  if (!expression) {
    return false;
  }

  const { name = '', operator, value } = expression;
  const formatted: string | number = value;

  const propertyValue = get(data, name);

  if (propertyValue === undefined) return false;

  if (operator === 'eql') {
    return propertyValue === formatted;
  } else if (operator === 'not-eql') {
    return propertyValue !== formatted;
  } else if (operator === 'contain') {
    return propertyValue.indexOf(`${formatted}`) > -1;
  } else if (operator === 'not-contain') {
    return propertyValue.indexOf(`${formatted}`) === -1;
  } else if (operator === 'gt') {
    return Number(propertyValue) > Number(formatted);
  } else if (operator === 'gte') {
    return Number(propertyValue) >= Number(formatted);
  } else if (operator === 'lt') {
    return Number(propertyValue) < Number(formatted);
  } else if (operator === 'lte') {
    return Number(propertyValue) <= Number(formatted);
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
