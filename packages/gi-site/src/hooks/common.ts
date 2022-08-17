import { GIAssets } from '@alipay/graphinsight';
import beautify from 'js-beautify';
export function beautifyCode(code: string) {
  return beautify(code, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: -1,
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    brace_style: 'collapse',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 120,
    e4x: false,
  });
}

export const getActivePackageName = (activeAssets: GIAssets): string[] => {
  const { services, components, elements, layouts } = activeAssets;
  const match = new Set<string>();
  if (services) {
    services.forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }

  if (components) {
    Object.values(components).forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }
  if (elements) {
    Object.values(elements).forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }
  if (layouts) {
    Object.values(layouts).forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }
  return [...match.values()];
};
