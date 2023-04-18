import React from 'react';
import type { Ref } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { ConfigProvider } from 'antd';
import type { ConfigConsumerProps } from 'antd/lib/config-provider';

export interface LocaleWrapperProps {
  locale?: any;
}

export interface LocaleWrapperInput {
  componentName: string;
  defaultLocale: any;
}

export default ({ componentName, defaultLocale }: LocaleWrapperInput) =>
  <BaseProps extends LocaleWrapperProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type WrappedComponentProps = BaseProps & { forwardedRef: Ref<typeof BaseComponent> };

    class Hoc extends React.Component<WrappedComponentProps> {
      static displayName = `GILocaleWrapper(${BaseComponent.name})`;
      static readonly WrappedComponent = BaseComponent;
      static contextType = ConfigProvider.ConfigContext;

      render() {
        const { locale: customLocale, forwardedRef, ...restProps } = this.props;
        const { locale: giLocale } = this.context as ConfigConsumerProps;
        const localeFromContext = giLocale?.[componentName] || {};
        const localeData = {
          ...defaultLocale,
          ...localeFromContext,
        };

        return (
          <BaseComponent
            ref={forwardedRef}
            locale={{ ...localeData, ...customLocale }}
            {...(restProps as WrappedComponentProps)}
          />
        );
      }
    }

    // 转发 ref
    const ForwardComponent = React.forwardRef<typeof BaseComponent, BaseProps>(
      (props: BaseProps, ref) => <Hoc {...(props as BaseProps)} forwardedRef={ref} />,
    );
    // 拷贝 WrappedComponent 静态方法到容器组件
    return hoistNonReactStatic(ForwardComponent, BaseComponent);
  };
