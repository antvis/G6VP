import { registerIconFonts } from '@antv/gi-common-components';
import type { GIAssets } from '../typing';

export default async function (icons: GIAssets['icons']) {
  await registerIconFonts((icons || []).map(i => i.icons).flat());
}
