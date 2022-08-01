export const getDefSideCoeFunction = (income: string, outcome: string, isLog: string, multiple: string) => {
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
        console.log(e)
    } 
    return value;
  };
  return defSideCoe;
};
