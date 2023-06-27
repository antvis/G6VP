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
  if (!expression) return false;

  const { name = '', operator, value } = expression;
  const formatted = String(value);
  const propertyValue = String(get(data, name));

  switch (operator) {
    case 'eql':
      return propertyValue === formatted;
    case 'not-eql':
      return propertyValue !== formatted;
    case 'contain':
      return propertyValue.indexOf(`${formatted}`) > -1;
    case 'not-contain':
      return propertyValue.indexOf(`${formatted}`) === -1;
    case 'gt':
      return Number(propertyValue) > Number(value);
    case 'gte':
      return Number(propertyValue) >= Number(value);
    case 'lt':
      return Number(propertyValue) < Number(value);
    case 'lte':
      return Number(propertyValue) <= Number(value);
    default:
      return false;
  }
};

export const filterByTopRule = (item, rule: Condition) => {
  const { logic, expressions } = rule;

  // 未配置规则一律通过
  if (!expressions || expressions.length === 0) {
    return true;
  }

  return logic === true
    ? expressions.every(exp => filterByExpression(formatProperties(item), exp))
    : expressions.some(exp => filterByExpression(formatProperties(item), exp));
};

export const filterByRules = (items, rule) => {
  return items.filter(item => {
    return filterByTopRule(item, rule);
  });
};
