export const getCodeConfig = user => ({
  findHops: [
    `g.V().hasLabel('user').has('id', ' ${user}')`,
    ".repeat(out().simplePath()).until(hasLabel('repo')",
    ".has('id','tensorflow')).path()",
    '.order().by(count(local)).limit(1)',
  ],
  findCommonNbrs: [
    `g.V().hasLabel('user').has('id', ' ${user}')`,
    ".out('following').as('a').in('following')",
    ".has('id',neq('xiaosuo')).as('b').select('a','b')",
  ],
  findCommonStars: [
    `g.V().hasLabel('user').has('id', ' ${user}')`,
    ".out('starred').as('a').in('starred')",
    ".has('id','veris-pr').select('a')",
  ],
  findSameCompany: [
    `g.V().hasLabel('user').has('id', ' ${user}')`,
    ".as('a').values('company').as('b').select('a')",
    ".out('starred').has('id','graphscope').in('starred')",
    ".where(values('company').as('b'))",
  ],
  findSameLocation: [
    `g.V().hasLabel('user').has('id', ' ${user}')`,
    ".as('a').values('location').as('b').select('a')",
    ".out('starred').has('id','graphscope').in('starred')",
    ".where(values('location').as('b'))",
  ],
  findEarlierUsers: [
    `g.V().hasLabel('user').has('id', ' ${user}')`,
    ".as('a').values('created_at').as('b').select('a')",
    ".out('starred').has('id','graphscope').in('starred')",
    ".where(values('created_at').where(P.lt('b')))",
  ],
});
