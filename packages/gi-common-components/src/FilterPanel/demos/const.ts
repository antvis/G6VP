export const schemaData = {
  nodes: [
    {
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      properties: {
        create_date: 'string',
        icon: 'string',
        id: 'string',
        is_different_bank: 'number',
      },
    },
    {
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      properties: {
        icon: 'string',
        id: 'string',
        address: 'string',
        customer_type: 'string',
        first_name: 'string',
        last_name: 'string',
        phone: 'string',
        remarks: 'string',
        risk_category: 'string',
        risk_score: 'number',
      },
    },
    {
      nodeType: '-',
      nodeTypeKeyFromProperties: 'icon',
      properties: {
        icon: 'string',
        id: 'string',
        address: 'string',
        customer_type: 'string',
        first_name: 'string',
        last_name: 'string',
        phone: 'string',
        remarks: 'string',
        risk_category: 'string',
        risk_score: 'string',
      },
    },
  ],
  edges: [
    {
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      sourceNodeType: 'account_balance',
      targetNodeType: 'account_balance',
      properties: {
        amount: 'number',
        balance: 'number',
        category: 'string',
        date: 'string',
        id: 'string',
        is_foreign_source: 'number',
        is_foreign_target: 'number',
        is_high_risk_source_target_location: 'number',
        relation: 'string',
        source: 'string',
        source_owner: 'string',
        target: 'string',
        target_owner: 'string',
        time: 'string',
      },
    },
    {
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      sourceNodeType: 'account_box',
      targetNodeType: 'account_balance',
      properties: {
        category: 'string',
        id: 'string',
        relation: 'string',
        source: 'string',
        target: 'string',
      },
    },
  ],
};

export const data = {
  nodes: [
    {
      id: 'other_banks',
      nodeType: '-',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: '-',
        id: 'other_banks',
        data: {},
        defaultStyle: {},
        address: '-',
        customer_type: '-',
        first_name: '-',
        last_name: '-',
        phone: '-',
        remarks: 'other banks',
        risk_category: '-',
        risk_score: '-',
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 2,
      x: 1065,
      y: 100,
      layout: {
        degree: 2,
        sDegree: 2,
        tDegree: 0,
      },
      _order: 5,
    },
    {
      id: 'customer_7',
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: 'account_box',
        id: 'customer_7',
        data: {},
        defaultStyle: {},
        address: '-',
        customer_type: 'retail',
        first_name: '-',
        last_name: '-',
        phone: '-',
        remarks: "high-value IB txn into customer 103's account",
        risk_category: 'medium',
        risk_score: 50,
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 1,
      x: 220,
      y: 100,
      layout: {
        degree: 1,
        sDegree: 1,
        tDegree: 0,
      },
      _order: 0,
    },
    {
      id: 'customer_20',
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: 'account_box',
        id: 'customer_20',
        data: {},
        defaultStyle: {},
        address: '-',
        customer_type: 'retail',
        first_name: '-',
        last_name: '-',
        phone: '-',
        remarks: "high-value IB txn into customer 103's account",
        risk_category: 'medium',
        risk_score: 50,
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 1,
      x: 380,
      y: 100,
      layout: {
        degree: 1,
        sDegree: 1,
        tDegree: 0,
      },
      _order: 1,
    },
    {
      id: 'customer_55',
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: 'account_box',
        id: 'customer_55',
        data: {},
        defaultStyle: {},
        address: '-',
        customer_type: 'retail',
        first_name: '-',
        last_name: '-',
        phone: '-',
        remarks: "high-value IB txn into customer 103's account",
        risk_category: 'medium',
        risk_score: 50,
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 1,
      x: 540,
      y: 100,
      layout: {
        degree: 1,
        sDegree: 1,
        tDegree: 0,
      },
      _order: 2,
    },
    {
      id: 'customer_81',
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: 'account_box',
        id: 'customer_81',
        data: {},
        defaultStyle: {},
        address: '-',
        customer_type: 'retail',
        first_name: '-',
        last_name: '-',
        phone: '-',
        remarks: "high-value IB txn into customer 103's account",
        risk_category: 'medium',
        risk_score: 50,
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 1,
      x: 700,
      y: 100,
      layout: {
        degree: 1,
        sDegree: 1,
        tDegree: 0,
      },
      _order: 3,
    },
    {
      id: 'customer_103',
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: 'account_box',
        id: 'customer_103',
        data: {},
        defaultStyle: {},
        address: '103 RD',
        customer_type: 'retail',
        first_name: 'john',
        last_name: 'doe',
        phone: '+65 0000 0103',
        remarks: 'high-value purchases from luxury retailer. source of funds from 4 related accounts',
        risk_category: 'high',
        risk_score: 99,
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 1,
      x: 60,
      y: 380,
      layout: {
        degree: 1,
        sDegree: 1,
        tDegree: 0,
      },
      _order: 0,
    },
    {
      id: 'customer_901',
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: 'account_box',
        id: 'customer_901',
        data: {},
        defaultStyle: {},
        address: '901 RD',
        customer_type: 'retail',
        first_name: 'jane',
        last_name: 'doe',
        phone: '+65 0000 0103',
        remarks:
          "source of funds for customer 103's purchase of luxury items. customer has same phone number as customer 103.",
        risk_category: 'medium',
        risk_score: 74,
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 1,
      x: 860,
      y: 100,
      layout: {
        degree: 1,
        sDegree: 1,
        tDegree: 0,
      },
      _order: 4,
    },
    {
      id: 'customer_902',
      nodeType: 'account_box',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        icon: 'account_box',
        id: 'customer_902',
        data: {},
        defaultStyle: {},
        address: '103 RD',
        customer_type: 'retail',
        first_name: 'jim',
        last_name: 'smith',
        phone: '+65 0000 0902',
        remarks:
          "source of funds for customer 103's purchase of luxury items. customer has same address as customer 103.",
        risk_category: 'medium',
        risk_score: 74,
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 1,
      x: 1235,
      y: 100,
      layout: {
        degree: 1,
        sDegree: 1,
        tDegree: 0,
      },
      _order: 6,
    },
    {
      id: 'account_7',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-03T00:00:00',
        icon: 'account_balance',
        id: 'account_7',
        is_different_bank: 0,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 2,
      x: 220,
      y: 380,
      layout: {
        degree: 2,
        sDegree: 1,
        tDegree: 1,
      },
      _order: 1,
    },
    {
      id: 'account_20',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-05T00:00:00',
        icon: 'account_balance',
        id: 'account_20',
        is_different_bank: 0,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 2,
      x: 380,
      y: 380,
      layout: {
        degree: 2,
        sDegree: 1,
        tDegree: 1,
      },
      _order: 2,
    },
    {
      id: 'account_55',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-07T00:00:00',
        icon: 'account_balance',
        id: 'account_55',
        is_different_bank: 0,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 2,
      x: 540,
      y: 380,
      layout: {
        degree: 2,
        sDegree: 1,
        tDegree: 1,
      },
      _order: 3,
    },
    {
      id: 'account_81',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-15T00:00:00',
        icon: 'account_balance',
        id: 'account_81',
        is_different_bank: 0,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 2,
      x: 700,
      y: 380,
      layout: {
        degree: 2,
        sDegree: 1,
        tDegree: 1,
      },
      _order: 4,
    },
    {
      id: 'account_103',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-15T00:00:00',
        icon: 'account_balance',
        id: 'account_103',
        is_different_bank: 0,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 15,
      x: 700,
      y: 660,
      layout: {
        degree: 15,
        sDegree: 4,
        tDegree: 11,
      },
      _order: 0,
    },
    {
      id: 'account_901',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-03T00:00:00',
        icon: 'account_balance',
        id: 'account_901',
        is_different_bank: 0,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 2,
      x: 860,
      y: 380,
      layout: {
        degree: 2,
        sDegree: 1,
        tDegree: 1,
      },
      _order: 5,
    },
    {
      id: 'account_902',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-10T00:00:00',
        icon: 'account_balance',
        id: 'account_902',
        is_different_bank: 0,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 2,
      x: 1235,
      y: 380,
      layout: {
        degree: 2,
        sDegree: 1,
        tDegree: 1,
      },
      _order: 8,
    },
    {
      id: 'account_903',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-09T00:00:00',
        icon: 'account_balance',
        id: 'account_903',
        is_different_bank: 1,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 5,
      x: 1020,
      y: 380,
      layout: {
        degree: 5,
        sDegree: 2,
        tDegree: 3,
      },
      _order: 6,
    },
    {
      id: 'account_904',
      nodeType: 'account_balance',
      nodeTypeKeyFromProperties: 'icon',
      data: {
        create_date: '2019-01-08T00:00:00',
        icon: 'account_balance',
        id: 'account_904',
        is_different_bank: 1,
        data: {},
        defaultStyle: {},
      },
      type: 'graphin-circle',
      depth: 0,
      degree: 5,
      x: 870,
      y: 940,
      layout: {
        degree: 5,
        sDegree: 2,
        tDegree: 3,
      },
      _order: 0,
    },
  ],
  edges: [
    {
      source: 'customer_7',
      target: 'account_7',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_210',
        relation: 'owns',
        source: 'customer_7',
        target: 'account_7',
        data: {},
        defaultStyle: {},
      },
      id: 'customer_7-account_7-14',
      type: 'graphin-line',
      startPoint: {
        x: 220,
        y: 113.5,
      },
      endPoint: {
        x: 220,
        y: 366.5,
      },
      depth: 0,
    },
    {
      source: 'customer_20',
      target: 'account_20',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_223',
        relation: 'owns',
        source: 'customer_20',
        target: 'account_20',
        data: {},
        defaultStyle: {},
      },
      id: 'customer_20-account_20-15',
      type: 'graphin-line',
      startPoint: {
        x: 380,
        y: 113.5,
      },
      endPoint: {
        x: 380,
        y: 366.5,
      },
      depth: 0,
    },
    {
      source: 'customer_55',
      target: 'account_55',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_258',
        relation: 'owns',
        source: 'customer_55',
        target: 'account_55',
        data: {},
        defaultStyle: {},
      },
      id: 'customer_55-account_55-16',
      type: 'graphin-line',
      startPoint: {
        x: 540,
        y: 113.5,
      },
      endPoint: {
        x: 540,
        y: 366.5,
      },
      depth: 0,
    },
    {
      source: 'customer_81',
      target: 'account_81',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_284',
        relation: 'owns',
        source: 'customer_81',
        target: 'account_81',
        data: {},
        defaultStyle: {},
      },
      id: 'customer_81-account_81-17',
      type: 'graphin-line',
      startPoint: {
        x: 700,
        y: 113.5,
      },
      endPoint: {
        x: 700,
        y: 366.5,
      },
      depth: 0,
    },
    {
      source: 'customer_103',
      target: 'account_103',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_306',
        relation: 'owns',
        source: 'customer_103',
        target: 'account_103',
        data: {},
        defaultStyle: {},
      },
      id: 'customer_103-account_103-18',
      type: 'graphin-line',
      startPoint: {
        x: 72.36812402117955,
        y: 385.41105425926605,
      },
      endPoint: {
        x: 687.6318759788204,
        y: 654.588945740734,
      },
      depth: 0,
    },
    {
      source: 'customer_901',
      target: 'account_901',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_307',
        relation: 'owns',
        source: 'customer_901',
        target: 'account_901',
        data: {},
        defaultStyle: {},
      },
      id: 'customer_901-account_901-19',
      type: 'graphin-line',
      startPoint: {
        x: 860,
        y: 113.5,
      },
      endPoint: {
        x: 860,
        y: 366.5,
      },
      depth: 0,
    },
    {
      source: 'customer_902',
      target: 'account_902',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_308',
        relation: 'owns',
        source: 'customer_902',
        target: 'account_902',
        data: {},
        defaultStyle: {},
      },
      id: 'customer_902-account_902-20',
      type: 'graphin-line',
      startPoint: {
        x: 1235,
        y: 113.5,
      },
      endPoint: {
        x: 1235,
        y: 366.5,
      },
      depth: 0,
    },
    {
      source: 'other_banks',
      target: 'account_903',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_310',
        relation: 'owns',
        source: 'other_banks',
        target: 'account_903',
        data: {},
        defaultStyle: {},
      },
      id: 'other_banks-account_903-21',
      type: 'graphin-line',
      startPoint: {
        x: 1062.8578457123192,
        y: 113.32896001223543,
      },
      endPoint: {
        x: 1022.1421542876807,
        y: 366.6710399877646,
      },
      depth: 0,
    },
    {
      source: 'other_banks',
      target: 'account_904',
      edgeType: 'ownership',
      edgeTypeKeyFromProperties: 'category',
      data: {
        category: 'ownership',
        id: 'ownership_311',
        relation: 'owns',
        source: 'other_banks',
        target: 'account_904',
        data: {},
        defaultStyle: {},
      },
      id: 'other_banks-account_904-22',
      type: 'graphin-line',
      startPoint: {
        x: 1061.9472489528089,
        y: 113.15031220328525,
      },
      endPoint: {
        x: 873.0527510471912,
        y: 926.8496877967148,
      },
      depth: 0,
    },
    {
      source: 'account_103',
      target: 'account_904',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 1000000,
        balance: 200000,
        category: 'ib_txn',
        date: '2020-01-01T00:00:00',
        id: 'ib_txn_1',
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_103',
        source_owner: 'customer_103',
        target: 'account_904',
        target_owner: 'other_banks',
        time: '00:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_103-account_904-0',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 707.0062048122638,
        y: 671.5396314554933,
      },
      endPoint: {
        x: 862.9937951877362,
        y: 928.4603685445067,
      },
      depth: 0,
    },
    {
      source: 'account_103',
      target: 'account_904',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 50000,
        balance: 250000,
        category: 'ib_txn',
        date: '2020-01-02T02:00:00',
        id: 'ib_txn_3',
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_103',
        source_owner: 'customer_103',
        target: 'account_904',
        target_owner: 'other_banks',
        time: '02:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_103-account_904-2',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 707.0062048122638,
        y: 671.5396314554933,
      },
      endPoint: {
        x: 862.9937951877362,
        y: 928.4603685445067,
      },
      depth: 0,
    },
    {
      source: 'account_904',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 2000000,
        balance: null,
        category: 'ib_txn',
        date: '2020-01-01T03:00:00',
        id: 'ib_txn_4',
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_904',
        source_owner: 'other_banks',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '03:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_904-account_103-3',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 862.9937951877362,
        y: 928.4603685445067,
      },
      endPoint: {
        x: 707.0062048122638,
        y: 671.5396314554933,
      },
      depth: 0,
    },
    {
      source: 'account_904',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 250000,
        balance: null,
        category: 'ib_txn',
        date: '2020-01-01T00:00:00',
        id: 'ib_txn_10',
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_904',
        source_owner: 'other_banks',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '00:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_904-account_103-9',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 862.9937951877362,
        y: 928.4603685445067,
      },
      endPoint: {
        x: 707.0062048122638,
        y: 671.5396314554933,
      },
      depth: 0,
    },
    {
      source: 'account_903',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 100000,
        balance: null,
        category: 'ib_txn',
        date: '2020-01-02T01:00:00',
        id: 'ib_txn_2',
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_903',
        source_owner: 'other_banks',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '01:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_903-account_103-1',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 1009.8402146214571,
        y: 388.889812206225,
      },
      endPoint: {
        x: 710.1597853785429,
        y: 651.110187793775,
      },
      depth: 0,
    },
    {
      source: 'account_103',
      target: 'account_903',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 1000000,
        balance: 1250000,
        category: 'ib_txn',
        date: '2020-01-02T04:00:00',
        id: 'ib_txn_5',
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_103',
        source_owner: 'customer_103',
        target: 'account_903',
        target_owner: 'other_banks',
        time: '04:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_103-account_903-4',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 710.1597853785429,
        y: 651.110187793775,
      },
      endPoint: {
        x: 1009.8402146214571,
        y: 388.889812206225,
      },
      depth: 0,
    },
    {
      source: 'account_103',
      target: 'account_903',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 1000000,
        balance: 250000,
        category: 'ib_txn',
        date: '2020-01-02T05:00:00',
        id: 'ib_txn_6',
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_103',
        source_owner: 'customer_103',
        target: 'account_903',
        target_owner: 'other_banks',
        time: '05:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_103-account_903-5',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 710.1597853785429,
        y: 651.110187793775,
      },
      endPoint: {
        x: 1009.8402146214571,
        y: 388.889812206225,
      },
      depth: 0,
    },
    {
      source: 'account_903',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 250000,
        balance: null,
        category: 'ib_txn',
        date: '2020-01-02T06:00:00',
        id: 'ib_txn_9',
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_903',
        source_owner: 'other_banks',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '06:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_903-account_103-8',
      isMultiple: true,
      type: 'graphin-line',
      startPoint: {
        x: 1009.8402146214571,
        y: 388.889812206225,
      },
      endPoint: {
        x: 710.1597853785429,
        y: 651.110187793775,
      },
      depth: 0,
    },
    {
      source: 'account_901',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 250000,
        balance: 10000,
        category: 'ib_txn',
        date: '2020-01-01T06:00:00',
        id: 'ib_txn_7',
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_901',
        source_owner: 'customer_901',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '06:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_901-account_103-6',
      type: 'graphin-line',
      startPoint: {
        x: 853.3021243321828,
        y: 391.7212824186802,
      },
      endPoint: {
        x: 706.6978756678172,
        y: 648.2787175813198,
      },
      depth: 0,
    },
    {
      source: 'account_902',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 250000,
        balance: 300000,
        category: 'ib_txn',
        date: '2020-01-01T06:30:00',
        id: 'ib_txn_8',
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_902',
        source_owner: 'customer_902',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '06:30:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_902-account_103-7',
      type: 'graphin-line',
      startPoint: {
        x: 1223.0390870555725,
        y: 386.25991705502753,
      },
      endPoint: {
        x: 711.9609129444276,
        y: 653.7400829449725,
      },
      depth: 0,
    },
    {
      source: 'account_7',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 125000,
        balance: 225000,
        category: 'ib_txn',
        date: '2020-01-03T22:00:00',
        id: 'ib_txn_72',
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_7',
        source_owner: 'customer_7',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '22:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_7-account_103-10',
      type: 'graphin-line',
      startPoint: {
        x: 231.66101516212885,
        y: 386.8022588445752,
      },
      endPoint: {
        x: 688.3389848378712,
        y: 653.1977411554249,
      },
      depth: 0,
    },
    {
      source: 'account_55',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 250000,
        balance: 475000,
        category: 'ib_txn',
        date: '2020-01-03T22:00:00',
        id: 'ib_txn_73',
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_55',
        source_owner: 'customer_55',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '22:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_55-account_103-11',
      type: 'graphin-line',
      startPoint: {
        x: 546.6978756678172,
        y: 391.7212824186802,
      },
      endPoint: {
        x: 693.3021243321828,
        y: 648.2787175813198,
      },
      depth: 0,
    },
    {
      source: 'account_20',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 150000,
        balance: 625000,
        category: 'ib_txn',
        date: '2020-01-04T18:00:00',
        id: 'ib_txn_74',
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_20',
        source_owner: 'customer_20',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '18:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_20-account_103-12',
      type: 'graphin-line',
      startPoint: {
        x: 390.15978537854284,
        y: 388.889812206225,
      },
      endPoint: {
        x: 689.8402146214571,
        y: 651.110187793775,
      },
      depth: 0,
    },
    {
      source: 'account_81',
      target: 'account_103',
      edgeType: 'ib_txn',
      edgeTypeKeyFromProperties: 'category',
      data: {
        amount: 300000,
        balance: 925000,
        category: 'ib_txn',
        date: '2020-01-04T18:00:00',
        id: 'ib_txn_75',
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: 'ib_transfer',
        source: 'account_81',
        source_owner: 'customer_81',
        target: 'account_103',
        target_owner: 'customer_103',
        time: '18:00:00',
        data: {},
        defaultStyle: {},
      },
      id: 'account_81-account_103-13',
      type: 'graphin-line',
      startPoint: {
        x: 700,
        y: 393.5,
      },
      endPoint: {
        x: 700,
        y: 646.5,
      },
      depth: 0,
    },
  ],
  combos: [],
};
