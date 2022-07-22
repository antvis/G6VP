// This file is created by egg-ts-helper@1.31.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGraphcompute from '../../../app/controller/graphcompute';

declare module 'egg' {
  interface IController {
    graphcompute: ExportGraphcompute;
  }
}
