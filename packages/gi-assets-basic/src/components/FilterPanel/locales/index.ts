import enUS from './en-US';
import zhCN from './zh-CN';
import { LANGUAGE_KEY_NAME } from '@antv/gi-sdk'

export default {
  [LANGUAGE_KEY_NAME.EnUs]: enUS,
  [LANGUAGE_KEY_NAME.ZhCN]: zhCN
} as Record<LANGUAGE_KEY_NAME, any>