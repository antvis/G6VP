import { GraphinContext } from '@antv/graphin';
import { isEmpty } from 'lodash';
import React from 'react';
import localeEn from './en-US';
import localeZh from './zh-CN';

const GI_LOCALE = 'GI_locale';

export type Language = 'zh-CN' | 'en-US';

export function getLocale() {
  return (window.localStorage.getItem(GI_LOCALE) || 'zh-CN') as Language;
}

export function setLocale(locale) {
  window.localStorage.setItem(GI_LOCALE, locale);
}

export const formatMessage = ({ id, ...restProps }, locale: Language = getLocale()): string => {
  let msg = (locale === 'zh-CN' ? localeZh[id] : localeEn[id]) || id;
  if (!isEmpty(restProps)) {
    msg = msg?.replace(/\{.*?\}/g, item => restProps[item.replace(/\{/, '').replace(/\}/, '')]);
  }
  return msg;
};

interface FormattedMessageProps {
  id: string;
  locale?: Language;
  [key: string]: any;
}

export default class FormattedMessage extends React.Component<Readonly<FormattedMessageProps>> {
  static contextType:any = GraphinContext;

  render() {
    //@ts-ignore
    const { id, locale = this.context.locale, ...restProps } = this.props;
    return formatMessage({ id, ...restProps }, locale);
  }
}
