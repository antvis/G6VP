// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportGraphcompute from '../../../app/controller/graphcompute';
import ExportHome from '../../../app/controller/home';
import ExportNeo4j from '../../../app/controller/neo4j';
import ExportTugraph from '../../../app/controller/tugraph';

declare module 'egg' {
  interface IController {
    graphcompute: ExportGraphcompute;
    home: ExportHome;
    neo4j: ExportNeo4j;
    tugraph: ExportTugraph;
  }
}
