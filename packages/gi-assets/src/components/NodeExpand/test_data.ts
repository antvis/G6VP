export default (data, params) => {
  const transform = d => {
    const { nodes, edges } = d;
    return {
      nodes: nodes.map(n => {
        return { id: n.id, data: n };
      }),
      edges: edges.map(n => {
        return { source: n.source, target: n.target, data: n };
      }),
    };
  };

  const { id, type = [] } = params;

  const mappingData = {
    // 吴大爷家庭数据
    self_family: {
      nodes: [
        {
          id: 'self',
          label: '吴大爷（自己）',
          sex: 'male',
          type: 'user',
        },
        {
          id: 'daughter1',
          label: '大女儿',
          type: 'user',
        },
        {
          id: 'daughter2',
          label: '二女儿',
          type: 'user',
        },
        {
          id: 'son',
          label: '儿子',
          type: 'user',
        },
      ],
      edges: [
        { source: 'self', target: 'daughter1', type: 'father-daughter', label: '父女' },
        { source: 'self', target: 'daughter2', type: 'father-daughter', label: '父女' },
        { source: 'self', target: 'son', type: 'father-son', label: '父子' },
      ],
    },
    self_account: {
      nodes: [{ id: 'wAccont', label: '吴大爷的账户', sex: 'male', type: 'accont' }],
      edges: [],
    },
    // 吴大爷社交媒体
    self_socialNetwork: {
      nodes: [{ id: 'wAocialNetwork', label: '吴大爷的社交媒体', sex: 'male', type: 'socialNetwork' }],
      edges: [],
    },
    self_club: {
      nodes: [{ id: 'wClub', label: '吴大爷参加的社团', type: 'club' }],
      edges: [],
    },
    // 吴大爷账户的转账数据
    wAccont_financial: {
      nodes: [
        {
          id: 'clubPerson6',
          label: '小张',
          donutAttrs: {
            income: 200,
            outcome: 20,
            unknown: 25,
          },
          type: 'user',
        },
        {
          id: 'nf1',
          label: '网友1',
          donutAttrs: {
            income: 50,
            outcome: 10,
            unknown: 15,
          },
          type: 'user',
        },
        {
          id: 'shop1',
          label: '某商家1',
          donutAttrs: {
            income: 90,
            outcome: 110,
            unknown: 15,
          },
          nodeType: 'shop',
        },
        {
          id: 'shop2',
          label: '某商家2',
          donutAttrs: {
            income: 90,
            outcome: 110,
            unknown: 15,
          },
          nodeType: 'shop',
        },
      ],
      edges: [
        { source: 'son', target: 'self', amount: 10 },
        { source: 'self', target: 'clubPerson6', amount: 0.1 }, // 吴大爷 -> 小张
        { source: 'clubPerson6', target: 'self', amount: 0.2 }, // 小张 -> 吴大爷
        { source: 'self', target: 'nf1', amount: 10 }, // 吴大爷 -> 网友
        { source: 'self', target: 'shop1', amount: 1 },
        { source: 'self', target: 'shop2', amount: 1 },
      ],
    },
    // 小张的转账关系 clubPerson6
    clubPerson6_financial: {
      nodes: [
        {
          id: 'clubPerson1',
          label: '刘大妈',
          donutAttrs: {
            income: 90,
            outcome: 110,
            unknown: 15,
          },
          nodeType: 'account',
        },
      ],
      edges: [
        { source: 'clubPerson6', target: 'nf1', amount: 12 }, // 小张 -> 网友
        { source: 'clubPerson1', target: 'clubPerson6', amount: 0.05 }, // 刘大妈 -> 小张
        { source: 'clubPerson6', target: 'clubPerson1', amount: 0.1 }, // 小张 -> 刘大妈
      ],
    },

    // 小张的社交关系 clubPerson6
    clubPerson6_socialNetwork: {
      nodes: [
        { id: 'clubPerson5', label: '吴姐', sex: 'female', order: 1 },
        { id: 'clubPerson3', label: '张大爷', sex: 'male', order: 2 },
        { id: 'clubPerson4', label: '龚大爷', sex: 'male', order: 3 },
        { id: 'clubPerson1', label: '刘大妈', sex: 'female', order: 4 },
        { id: 'clubPerson2', label: '林大姐', sex: 'female', order: 6 },
      ],
      edges: [
        { source: 'clubPerson6', target: 'wClub', label: '参加' }, // 小张参加了吴大爷所在的社团
        { source: 'clubPerson1', target: 'clubPerson2', label: '牌友' },
        { source: 'clubPerson1', target: 'clubPerson3', label: '牌友' },
        { source: 'clubPerson1', target: 'clubPerson4', label: '牌友' },
        { source: 'clubPerson1', target: 'clubPerson5', label: '牌友' },
        { source: 'clubPerson1', target: 'clubPerson6', label: '牌友' },
        { source: 'clubPerson2', target: 'clubPerson3', label: '牌友' },
        { source: 'clubPerson2', target: 'clubPerson4', label: '牌友' },
        { source: 'clubPerson2', target: 'clubPerson5', label: '牌友' },
        { source: 'clubPerson2', target: 'clubPerson6', label: '牌友' },
        { source: 'clubPerson3', target: 'clubPerson4', label: '牌友' },
        { source: 'clubPerson3', target: 'clubPerson5', label: '牌友' },
        { source: 'clubPerson3', target: 'clubPerson6', label: '牌友' },
        { source: 'clubPerson4', target: 'clubPerson5', label: '牌友' },
        { source: 'clubPerson4', target: 'clubPerson6', label: '牌友' },
        { source: 'clubPerson5', target: 'clubPerson6', label: '牌友' },
      ],
    },
    // 吴大爷社团数据
    wClub_club: {
      nodes: [
        { id: 'club2Person1', label: '余大哥', sex: 'male', order: 1 },
        { id: 'club2Person2', label: '老李', sex: 'female', order: 2 },
        { id: 'club2Person3', label: '老谢', sex: 'male', order: 3 },
        { id: 'club2Person4', label: '梅大爷', sex: 'male', order: 4 },
      ],
      edges: [
        { source: 'wClub', target: 'club2Person1', label: '牌友' },
        { source: 'wClub', target: 'club2Person2', label: '牌友' },
        { source: 'wClub', target: 'club2Person3', label: '牌友' },
        { source: 'wClub', target: 'club2Person4', label: '牌友' },
        { source: 'club2Person1', target: 'club2Person2', label: '牌友' },
        { source: 'club2Person1', target: 'club2Person3', label: '牌友' },
        { source: 'club2Person1', target: 'club2Person4', label: '牌友' },
        { source: 'club2Person2', target: 'club2Person3', label: '牌友' },
        { source: 'club2Person2', target: 'club2Person4', label: '牌友' },
        { source: 'club2Person3', target: 'club2Person4', label: '牌友' },
        { source: 'clubPerson1', target: 'wClub', label: '牌友' }, // 刘大妈在社团里面
      ],
    },

    // 吴大爷社交媒体关系数据
    wAocialNetwork_socialNetwork: {
      nodes: [
        { id: 'co1', label: '同事1', sex: 'male' },
        { id: 'co2', label: '同事2', sex: 'female' },
        { id: 'co3', label: '同事3', sex: 'female' },
        { id: 'co4', label: '同事4', sex: 'male' },
        { id: 'co5', label: '同事5', sex: 'male' },
        { id: 'co6', label: '同事6', sex: 'male' },
        { id: 'cm1', label: '同学1', sex: 'male' },
        { id: 'cm2', label: '同学2', sex: 'female' },
        { id: 'cm3', label: '同学3', sex: 'female' },
        { id: 'cm4', label: '同学4', sex: 'male' },
        { id: 'nf1', label: '网友1', sex: 'male' },
        { id: 'nf2', label: '网友2', sex: 'male' },
        { id: 'nf3', label: '网友3', sex: 'female' },
        { id: 'nb1', label: '邻居1', sex: 'male' },
        { id: 'nb2', label: '邻居2', sex: 'female' },
        { id: 'nb3', label: '邻居3', sex: 'male' },
      ],
      edges: [
        { source: 'wAocialNetwork', target: 'co1', edgeType: 'colleague', label: '同事' },
        { source: 'wAocialNetwork', target: 'co2', edgeType: 'colleague', label: '同事' },
        { source: 'wAocialNetwork', target: 'co3', edgeType: 'colleague', label: '同事' },
        { source: 'wAocialNetwork', target: 'co4', edgeType: 'colleague', label: '同事' },
        { source: 'wAocialNetwork', target: 'co5', edgeType: 'colleague', label: '同事' },
        { source: 'wAocialNetwork', target: 'co6', edgeType: 'colleague', label: '同事' },
        { source: 'wAocialNetwork', target: 'cm1', edgeType: 'classmate', label: '同学' },
        { source: 'wAocialNetwork', target: 'cm2', edgeType: 'classmate', label: '同学' },
        { source: 'wAocialNetwork', target: 'cm3', edgeType: 'classmate', label: '同学' },
        { source: 'wAocialNetwork', target: 'cm4', edgeType: 'classmate', label: '同学' },
        { source: 'wAocialNetwork', target: 'nf1', edgeType: 'netfriend', label: '网友' },
        { source: 'wAocialNetwork', target: 'nf2', edgeType: 'netfriend', label: '网友' },
        { source: 'wAocialNetwork', target: 'nf3', edgeType: 'netfriend', label: '网友' },
        { source: 'wAocialNetwork', target: 'nb1', edgeType: 'neighbor', label: '邻居' },
        { source: 'wAocialNetwork', target: 'nb2', edgeType: 'neighbor', label: '邻居' },
        { source: 'wAocialNetwork', target: 'nb3', edgeType: 'neighbor', label: '邻居' },
        {
          source: 'wAocialNetwork',
          target: 'club1Person1',
          edgeType: 'neighbor',
          label: '邻居',
        },
        {
          source: 'wAocialNetwork',
          target: 'club2Person3',
          edgeType: 'friend',
          label: '朋友',
        },
      ],
    },

    // 网友1 的转账关系
    nf1_financial: {
      nodes: [
        {
          id: 'shop3',
          label: '某商家3',
          donutAttrs: {
            income: 90,
            outcome: 110,
            unknown: 15,
          },
          nodeType: 'shop',
        },
      ],
      edges: [
        { source: 'nf1', target: 'shop3', amount: 1 },
        { source: 'clubPerson1', target: 'nf1', amount: 60 },
      ],
    },
    // 某商家3的转账关系
    shop3_financial: {
      nodes: [
        {
          id: 'shop4',
          label: '某商家4',
          donutAttrs: {
            income: 90,
            outcome: 110,
            unknown: 15,
          },
          nodeType: 'shop',
        },
      ],
      edges: [
        { source: 'shop3', target: 'shop4', amount: 1 },
        { source: 'nf2', target: 'shop3', amount: 60 },
      ],
    },

    // 某商家4的转账关系
    shop4_financial: {
      nodes: [
        {
          id: 'bank2',
          label: '银行卡2',
          donutAttrs: {
            income: 90,
            outcome: 110,
            unknown: 15,
          },
          nodeType: 'bank',
        },
      ],
      edges: [{ source: 'shop4', target: 'bank2', amount: 10000 }],
    },
  };

  const responseData = type.reduce(
    (acc, curr) => {
      const str = id + '_' + curr;
      const currentData = mappingData[str];
      return {
        nodes: [...acc.nodes, ...currentData.nodes],
        edges: [...acc.edges, ...currentData.edges],
      };
    },
    { nodes: [], edges: [] },
  );

  return transform(responseData);
};
