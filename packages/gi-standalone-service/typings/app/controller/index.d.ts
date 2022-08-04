// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGraphcompute from '../../../app/controller/graphcompute';

declare module 'egg' {
  interface IController {
    graphcompute: ExportGraphcompute;
  }
}
