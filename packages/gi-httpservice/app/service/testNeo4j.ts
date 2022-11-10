const Neo4jService = require('./neo4j.ts');

const uri = 'neo4j+s://78a9e551.databases.neo4j.io';
const user = 'neo4j';
const password = 'wQ8BAZQ3Rie1Ieq6slISDnKnZWUGC5KgkJFbcUHQxwE';

const server = Neo4jService.prototype.connect(uri, user, password);
console.log(server);
