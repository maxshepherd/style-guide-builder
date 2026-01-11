import type { FC } from 'hono/jsx';
import type { StyleGuideConfig } from '../types';
import { ColorCard } from './ColorCard';

export const ColorsSection: FC<{ config: StyleGuideConfig }> = ({ config }) => {
  return (
    <section id="colors" class="section">
      <h2 class="section-title">Colors</h2>
      {config.palettes.map((palette) => (
        <div class="palette">
          <h3 class="palette-name">{palette.name}</h3>
          <div class="color-grid">
            {palette.colors.map((color) => (
              <ColorCard color={color} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
