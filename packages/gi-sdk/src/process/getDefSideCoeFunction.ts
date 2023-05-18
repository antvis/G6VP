export const getDefSideCoeFunction = (income: string, outcome: string, isLog: boolean, multiple: string) => {
  const defSideCoe = (node): number => {
    let value = 0;
    try {
      if (!node) {
        return 0;
      }
      const { data } = node.data;
      value = data[income] - data[outcome];
      if (isLog) {
        value = (value / Math.abs(value)) * Math.log(Math.abs(value));
      }
      value = value * parseFloat(multiple);
      return value;
    } catch (e) {
      console.log(e);
    }
    return value;
  };
  return defSideCoe;
};

export const getDefSideCoeFromEdgeFunction = (amountFromEdge: string[], isLog: boolean, multiple: string) => {
  const fieldMap = {};
  amountFromEdge.forEach(weightField => {
    const [edgeType, field] = weightField.split('^^');
    fieldMap[edgeType] = field;
  });
  return (node, edges): number => {
    if (!node || !edges?.length) return 0;
    let outTotal = 0;
    let inTotal = 0;
    edges.forEach(edge => {
      if (edge.source === node.id) {
        const fieldName = fieldMap[edge.edgeType];
        outTotal += Number(edge.data[fieldName]) || 0;
      }
      if (edge.target === node.id) {
        const fieldName = fieldMap[edge.edgeType];
        inTotal += Number(edge.data[fieldName]) || 0;
      }
    });
    let val = inTotal - outTotal;
    if (!val) return 0;
    if (isLog) {
      const sign = val >= 0 ? 1 : -1;
      val = sign * Math.log(Math.abs(val));
    }
    return val * parseFloat(multiple);
  };
};
