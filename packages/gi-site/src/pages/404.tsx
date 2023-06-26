import React from 'react';
import $i18n from '../i18n';

export default function () {
  return <>{$i18n.get({ id: 'gi-site.src.pages.404.PageNotFound', dm: '未找到页面' })}</>;
}
