// This file is created by egg-ts-helper@1.34.3
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportGraphcompute from '../../../app/service/graphcompute';
import ExportNeo4j from '../../../app/service/neo4j';
import ExportServiceInterface from '../../../app/service/serviceInterface';
import ExportTugraph from '../../../app/service/tugraph';
import ExportGraphinsightProject from '../../../app/service/graphinsight/project';
import ExportGraphinsightTyping from '../../../app/service/graphinsight/typing';
import ExportGraphinsightUtils from '../../../app/service/graphinsight/utils';
import ExportGraphinsightCaseBank from '../../../app/service/graphinsight/case/bank';
import ExportGraphinsightCaseSecurityNetwork from '../../../app/service/graphinsight/case/security-network';

declare module 'egg' {
  interface IService {
    graphcompute: AutoInstanceType<typeof ExportGraphcompute>;
    neo4j: AutoInstanceType<typeof ExportNeo4j>;
    serviceInterface: AutoInstanceType<typeof ExportServiceInterface>;
    tugraph: AutoInstanceType<typeof ExportTugraph>;
    graphinsight: {
      project: AutoInstanceType<typeof ExportGraphinsightProject>;
      typing: AutoInstanceType<typeof ExportGraphinsightTyping>;
      utils: AutoInstanceType<typeof ExportGraphinsightUtils>;
      case: {
        bank: AutoInstanceType<typeof ExportGraphinsightCaseBank>;
        securityNetwork: AutoInstanceType<typeof ExportGraphinsightCaseSecurityNetwork>;
      }
    }
  }
}
