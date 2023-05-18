const getScaleFunc = scale => {
  let scaleFunc = val => val;
  switch (scale) {
    case 'sqrt':
      scaleFunc = val => Math.sqrt(val);
      break;
    case 'sqr':
      scaleFunc = val => val * val;
      break;
    case 'log2':
      scaleFunc = val => Math.log2(val);
      break;
    case 'log10':
      scaleFunc = val => Math.log(val);
      break;
    case 'reciprocal':
      scaleFunc = val => 1 / (val || 1);
      break;
  }
  return scaleFunc;
};

export const getEdgeWeightedStrength = options => {
  const { edgeStrength: strength = 1, edgeWeightFieldScale: scale = 1, edgeWeightField: weightFeild } = options;
  const typeField = 'edgeType';

  const fieldMap = {};
  weightFeild.forEach(weightField => {
    const [edgeType, field] = weightField.split('^^');
    fieldMap[edgeType] = field;
  });
  const scaleFunc = getScaleFunc(scale);
  return model => {
    const fieldName = fieldMap[model[typeField]];
    if (fieldName) {
      const fieldVal = model.data[fieldName] || 1;
      const val = scaleFunc(Number(fieldVal * strength));
      return isNaN(val) || !val ? strength : val;
    }
    return strength;
  };
};

export const getNodeWeightedStrength = options => {
  const {
    nodeStrength: strength = 1,
    nodeWeightFieldScale: scale = 1,
    nodeWeightField,
    nodeWeightFieldFromEdge,
    nodeWeightFromType,
  } = options;
  const weightFeild = nodeWeightFromType === 'node' ? nodeWeightField : nodeWeightFieldFromEdge;

  const fieldMap = {};
  weightFeild.forEach(weightField => {
    const [edgeType, field] = weightField.split('^^');
    fieldMap[edgeType] = field;
  });
  let scaleFunc = val => val;
  switch (scale) {
    case 'sqrt':
      scaleFunc = val => Math.sqrt(val);
      break;
    case 'sqr':
      scaleFunc = val => val * val;
      break;
    case 'log2':
      scaleFunc = val => Math.log2(val);
      break;
    case 'log10':
      scaleFunc = val => Math.log(val);
      break;
    case 'reciprocal':
      scaleFunc = val => 1 / (val || 1);
      break;
  }
  if (nodeWeightFromType === 'node') {
    return model => {
      const fieldName = fieldMap[model.nodeType];
      if (fieldName) {
        const fieldVal = model.data[fieldName] || 1;
        const val = scaleFunc(Number(fieldVal * strength));
        return isNaN(val) || !val ? strength : val;
      }
      return strength;
    };
  }
  return (model, edges: any[] = []) => {
    let total = 0;
    edges?.forEach(edge => {
      const { source, target } = edge;
      if (source !== model.id && target !== model.id) return;
      const fieldName = fieldMap[edge.edgeType];
      const fieldVal = edge.data[fieldName] || 1;
      const val = Number(fieldVal);
      total += isNaN(val) || !val ? 0 : val;
    });
    if (total && !isNaN(total)) return scaleFunc(total * strength);
    return strength;
  };
};
