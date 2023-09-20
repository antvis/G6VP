import { Button } from 'antd';
import React from 'react';
import locale from '@aligov/global-locale';
import $i18n from '../../i18n';
import { useState } from 'react';
import { isNavigatorLanguageZh } from '../utils';
import { LANGUAGE_KEY_NAME } from '@antv/gi-sdk';
import './index.less';

interface LanguageProps {}
const options = [
  {
    value: LANGUAGE_KEY_NAME.ZhCN,
    label: $i18n.get({ id: 'gi-site.components.Navbar.Language.Medium', dm: '中' }),
  },
  {
    value: LANGUAGE_KEY_NAME.EnUs,
    label: 'En',
  },
];

const Language: React.FunctionComponent<LanguageProps> = () => {
  const { lang } = locale.getLocale();
  if (!lang) {
    const isZh = isNavigatorLanguageZh();
    locale.setLang(isZh ? LANGUAGE_KEY_NAME.ZhCN : LANGUAGE_KEY_NAME.EnUs);
  }
  const [option, setOption] = useState(lang === LANGUAGE_KEY_NAME.EnUs ? options[0] : options[1]);
  const switchLang = value => {
    setOption(value === LANGUAGE_KEY_NAME.EnUs ? options[0] : options[1]);
    $i18n.change(value || LANGUAGE_KEY_NAME.ZhCN);
    location.reload();
  };

  return (
    <Button
      shape="circle"
      size="small"
      style={{ backgroundColor: 'var(--primary-color-opacity-1)', border: '0px solid #fff' }}
      onClick={() => switchLang(option.value)}
    >
      {option.label}
    </Button>
  );
};

export default Language;
