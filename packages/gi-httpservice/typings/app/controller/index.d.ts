// This file is created by egg-ts-helper@1.34.3
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportGraphcompute from '../../../app/controller/graphcompute';
import ExportGraphinsight from '../../../app/controller/graphinsight';
import ExportNeo4j from '../../../app/controller/neo4j';
import ExportTugraph from '../../../app/controller/tugraph';

declare module 'egg' {
  interface IController {
    graphcompute: ExportGraphcompute;
    graphinsight: ExportGraphinsight;
    neo4j: ExportNeo4j;
    tugraph: ExportTugraph;
  }
}
