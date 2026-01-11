import type { StyleGuideConfig } from '../types';
import { Layout } from './Layout';
import { ColorsSection } from './ColorsSection';
import { ColorCombinationsSection } from './ColorCombinationsSection';
import { TypographySection } from './TypographySection';
import { SpacingSection } from './SpacingSection';
import { AccessibilitySection } from './AccessibilitySection';
import { ColorPicker } from './ColorPicker';

/**
 * Generate the main style guide page using TSX components
 */
export function StyleGuidePage({ config }: { config: StyleGuideConfig }) {
  // Get the primary-500 color as the base color for the picker
  const primaryPalette = config.palettes.find((p) => p.name === 'Primary');
  const baseColor = primaryPalette?.colors.find((c) => c.name === 'primary-500')?.oklch || { l: 0.55, c: 0.2, h: 250 };

  return (
    <Layout config={config}>
      <ColorPicker baseColor={baseColor} />
      <ColorsSection config={config} />
      <ColorCombinationsSection baseColor={baseColor} />
      <TypographySection config={config} />
      <SpacingSection config={config} />
      <AccessibilitySection config={config} />
    </Layout>
  );
}
