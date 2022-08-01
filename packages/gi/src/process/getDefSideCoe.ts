export const getDefSideCoe = (income: string, outcome: string, isLog: string, multiple: string) => {
  const defSideCoe = (node): number => {
    let value = 0;
    try {
      if (!node) {
        return 0;
      }
      const { data } = node.data;
      value = data[income] - data[outcome];
      //console.log("value before:", node.data,income,node.data[income] , node.data[outcome],node.data[income] -node.data[outcome])
      if (isLog) {
        value = (value / Math.abs(value)) * Math.log(Math.abs(value));
      }
      value = value * parseFloat(multiple);
      //console.log('value',value)
      return value;
    } catch (e) {
        console.log(e)
    } 
    return value;
  };
  return defSideCoe;
};
