import $i18n from '../i18n';
export const roles = [
  {
    id: 'developer',
    title: $i18n.get({ id: 'gi-portal.src.pages.const.Developer', dm: '开发者' }),
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*t94tRJGZ43cAAAAAAAAAAAAAARQnAQ',
    slogan: (
      <span>
        {$i18n.get({ id: 'gi-portal.src.pages.const.GraphAnalysisApplication', dm: '图分析应用' })}
        <span style={{ color: 'var(--primary-color)' }}>
          {$i18n.get({ id: 'gi-portal.src.pages.const.RD', dm: '研发' })}
        </span>
        {$i18n.get({ id: 'gi-portal.src.pages.const.Tools', dm: '工具' })}
      </span>
    ),

    desc: $i18n.get({
      id: 'gi-portal.src.pages.const.ForDevelopersGraphinsightIsA',
      dm: '对开发者而言，G6VP 是基于 AntV 开源技术栈 G6 / Graphin 之上的低代码搭建工具。开发者可根据业务需求，在线进行产品模块的组合搭建，生成的图分析画布还可一键导出配置代码，生成 SDK，集成到业务系统中，大大降 低初始研发门槛 与 后续维护成本。',
    }),
  },

  {
    id: 'analyst',
    title: $i18n.get({ id: 'gi-portal.src.pages.const.Analyst', dm: '分析师' }),
    cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*S1Q7TK6gMioAAAAAAAAAAAAAARQnAQ',
    slogan: (
      <span>
        {$i18n.get({ id: 'gi-portal.src.pages.const.GraphVisualAnalysis', dm: '图可视分析' })}
        <span style={{ color: 'var(--primary-color)' }}>
          {$i18n.get({ id: 'gi-portal.src.pages.const.Insight', dm: '洞察' })}
        </span>
        {$i18n.get({ id: 'gi-portal.src.pages.const.Tools', dm: '工具' })}
      </span>
    ),

    desc: $i18n.get({
      id: 'gi-portal.src.pages.const.ForAnalystsGraphinsightIsA',
      dm: '对分析师而言，G6VP 是一款能够将关系数据在线可视化展示，并能持续分析洞察的工具。与传统的 BI 工具相比，G6VP 不仅能够直接给出数据的洞察结果，也能够辅助用户完成数据的动态分析，并提供场景化分析能力。',
    }),
  },
];

export const developer = [
  {
    title: $i18n.get({
      id: 'gi-portal.src.pages.const.QuicklyVerifyIdeasAndEnjoy',
      dm: '快速验证想法，享受搭积木的乐趣',
    }),
    description: $i18n.get({
      id: 'gi-portal.src.pages.const.TheMultiSourceHeterogeneousData',
      dm: '数据的多源异构，业务逻辑的复杂性加剧，越来越多的企业面临深度关联分析需求 ，也会涌现相当多的创新产品，使用图的思维来分析解决问题。对于开发者而言，如何快速实现产品功能，满足业务POC验证，就变成一个非常头痛的问题。G6VP 提供了丰富的图分析分析资产，用户无需代码开发，即可在平台上搭建出一个图分析画布',
    }),

    image: 'https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*jvKiTZnT5uUAAAAAAAAAAAAAARQnAQ',
  },

  {
    title: $i18n.get({ id: 'gi-portal.src.pages.const.GetStartedAtZeroCost', dm: '零成本上手开发，专注你所关心的' }),
    description: $i18n.get({
      id: 'gi-portal.src.pages.const.GraphinsightIsAProductLevel',
      dm: 'G6VP 是基于 AntV 开源技术栈 G6 / Graphin 之上的产品级技术方案，提供了高性能的 SDK 以及组件资产的研发规范，对于开发者而言，这里没有d3/g6/cytoscape 等技术方案选型与高昂的学习成本，复杂的技术逻辑与交互方案全部内置，且通过上下文 (Context) 轻松获取，零成本上手开发，像写普通的业务组件一样顺手',
    }),

    image: 'https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*IUkJQJdxmDIAAAAAAAAAAAAAARQnAQ',
  },

  {
    title: $i18n.get({
      id: 'gi-portal.src.pages.const.FastDeploymentEverythingIsOnly',
      dm: '极速部署上线，一切只为开放而生',
    }),
    description: $i18n.get({
      id: 'gi-portal.src.pages.const.ForALongTimeGraph',
      dm: '长久以来，图分析应用都面临着开发周期长，维护成本高的问题，面对复杂的业务场景，还时常面临定制开放需求。G6VP 设计之初就面向开放制定，不仅提供一键代码导出功能，方便开发者部署，还提供「套娃」开放的能力，无论多么复杂的业务场景，保持开放，永远是 G6VP 的产品设计初心！',
    }),

    image: 'https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*qTjSRIEEdEMAAAAAAAAAAAAAARQnAQ',
  },
];

export const analyst = [
  {
    title: $i18n.get({
      id: 'gi-portal.src.pages.const.NaturalAndSmoothMakingYour',
      dm: '自然且流畅，让你的关联数据跃然纸上',
    }),
    description: $i18n.get({
      id: 'gi-portal.src.pages.const.GraphinsightProvidesExquisiteStylesDelicate',
      dm: 'G6VP 默认提供精美的样式，细腻的交互，合理的布局，即使再复杂的关系数据也能快速清晰地呈现在你面前',
    }),

    image: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*eXL9T6xqPlUAAAAAAAAAAAAAARQnAQ',
  },

  {
    title: $i18n.get({
      id: 'gi-portal.src.pages.const.FlexibleButNotMessyLeisurely',
      dm: '灵活但不乱，从容不迫帮你理清分析思路',
    }),
    description: $i18n.get({
      id: 'gi-portal.src.pages.const.InGraphAnalysisDataNeeds',
      dm: '图的分析中需要对数据频繁做关联、分组、筛选、下钻、查询，用户很容易思路分叉，丢失灵感甚至误操作。G6VP 提供了布局缓存、多画布、撤销重做、分析画廊、筛选查询等丰富的分析资产，让你的分析过程从容不迫',
    }),

    image: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*NjQnR4CuUykAAAAAAAAAAAAAARQnAQ',
  },

  {
    title: $i18n.get({
      id: 'gi-portal.src.pages.const.MultiDimensionalAndMultiAngle',
      dm: '多维且多角度，场景化分析方案助力深入洞察',
    }),
    description: $i18n.get({
      id: 'gi-portal.src.pages.const.ThanksToTheRichBusiness',
      dm: '得益于 G6VP 的丰富业务实践，我们为用户提供了3D大图分析，地理位置分析，时序分析，统计分析 等众多场景化分析方案，多角度，多维度洞察你的关联数据',
    }),

    image: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*VWk4TZnY3nEAAAAAAAAAAAAAARQnAQ',
  },
];
