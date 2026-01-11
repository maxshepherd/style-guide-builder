import type { FC } from 'hono/jsx';
import type { StyleGuideConfig } from '../types';

export const SpacingSection: FC<{ config: StyleGuideConfig }> = ({ config }) => {
  return (
    <section id="spacing" class="section">
      <h2 class="section-title">Spacing</h2>
      <div class="spacing-grid">
        {Object.entries(config.spacing).map(([key, value]) => (
          <div class="spacing-item">
            <div class="spacing-label">
              --space-{key}: {value}
            </div>
            <div class="spacing-visual" style={`width: ${value};`}></div>
          </div>
        ))}
      </div>
    </section>
  );
};
