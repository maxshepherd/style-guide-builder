import type { FC } from 'hono/jsx';
import type { StyleGuideConfig } from '../types';

export const AccessibilitySection: FC<{ config: StyleGuideConfig }> = ({ config }) => {
  return (
    <section id="accessibility" class="section">
      <h2 class="section-title">Accessibility Guidelines</h2>
      <div class="accessibility-grid">
        <div class="a11y-card">
          <h3>Contrast Ratios</h3>
          <div class="a11y-rule">Normal Text (WCAG AA): {config.accessibility.minContrastNormal}:1</div>
          <div class="a11y-rule">Large Text (WCAG AA): {config.accessibility.minContrastLarge}:1</div>
          <div class="a11y-rule">Enhanced (WCAG AAA): {config.accessibility.minContrastAAA}:1</div>
        </div>

        <div class="a11y-card">
          <h3>Typography</h3>
          <div class="a11y-rule">Minimum Font Size: {config.accessibility.minFontSize}</div>
          <div class="a11y-rule">Max Line Length: {config.accessibility.maxLineLength} characters</div>
          <div class="a11y-rule">Recommended Line Height: {config.typography.lineHeight.normal}</div>
        </div>

        <div class="a11y-card">
          <h3>Color Space</h3>
          <div class="a11y-rule">Using OKLCH for perceptually uniform colors</div>
          <div class="a11y-rule">All colors checked against WCAG standards</div>
          <div class="a11y-rule">Nearest CSS color matches provided for reference</div>
        </div>
      </div>
    </section>
  );
};
