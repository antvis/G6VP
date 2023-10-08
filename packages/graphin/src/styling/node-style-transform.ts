const transGraphinStyle = style => {
  const { keyshape = {}, halo = {}, icon = {}, label = {}, badges = [] } = style || {};

  return {
    type: 'circle-node',
    labelShape: {
      text: label.value || '',
      position: label.position || 'bottom',
    },
    keyShape: {
      r: keyshape.size || 10,
      fill: keyshape.fill || 'red',
      stroke: keyshape.stroke || 'red',
      strokeOpacity: keyshape.strokeOpacity || 1,
    },
    animates: {
      update: [
        {
          fields: ['x', 'y'],
          shapeId: 'group',
        },
        // {
        //   fields: ['opacity'],
        //   shapeId: 'haloShape',
        // },
        // {
        //   fields: ['lineWidth'],
        //   shapeId: 'keyShape',
        // },
      ],
    },
  };
};

export const nodeStyleTransform = node => {
  const { style, type, id, data } = node;
  const IS_GRAPHIN = (style && type === 'graphin-circle') || !type;
  // console.log('node', node);
  if (IS_GRAPHIN) {
    return {
      id,
      data: {
        ...data,
        ...transGraphinStyle(style),
      },
    };
  }
  return node;
};
