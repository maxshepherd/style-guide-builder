import type { FC } from 'hono/jsx';
import type { OKLCHColor } from '../types';
import {
  generateClassicalHarmony,
  generatePerceptuallyBalanced,
  generateFunctionalScale,
  oklchToHex,
  formatOklch,
} from '../colors';

interface ColorCombinationsSectionProps {
  baseColor: OKLCHColor;
}

export const ColorCombinationsSection: FC<ColorCombinationsSectionProps> = ({ baseColor }) => {
  // Generate all three algorithms
  const harmonies = generateClassicalHarmony(baseColor);
  const perceptualColors = generatePerceptuallyBalanced(baseColor, 8);
  const functionalScale = generateFunctionalScale(baseColor, 11);

  return (
    <section id="color-combinations" class="section">
      <h2 class="section-title">Color Combinations</h2>
      <p class="section-description">
        Explore harmonious color combinations generated from your base color using three different algorithms.
      </p>

      {/* Algorithm 1: Classical Harmony Schemes */}
      <div class="algorithm-section">
        <h3 class="algorithm-title">1. Classical Harmony Schemes</h3>
        <p class="algorithm-description">
          Based on fixed angular relationships on the color wheel. These time-tested combinations create balanced and
          pleasing color palettes.
        </p>
        <div class="harmony-grid">
          {harmonies.map((harmony) => (
            <div class="harmony-card">
              <h4 class="harmony-name">{harmony.name}</h4>
              <p class="harmony-description">{harmony.description}</p>
              <div class="harmony-colors">
                {harmony.colors.map((color) => {
                  const hex = oklchToHex(color);
                  const oklchStr = formatOklch(color);
                  return (
                    <div class="combination-color">
                      <div
                        class="combination-color-swatch"
                        style={`background-color: ${hex};`}
                        title={`${hex}\n${oklchStr}`}
                      />
                      <div class="combination-color-info">
                        <code class="color-hex">{hex}</code>
                        <code class="color-oklch">{oklchStr}</code>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm 2: Perceptual Weighting */}
      <div class="algorithm-section">
        <h3 class="algorithm-title">2. Perceptual Weighting in OKLCH</h3>
        <p class="algorithm-description">
          Colors with constant lightness (L={(baseColor.l * 100).toFixed(0)}%) and chroma (C={baseColor.c.toFixed(3)}),
          varying only hue. Each color has equal visual weight and importance.
        </p>
        <div class="perceptual-colors">
          {perceptualColors.map((color, index) => {
            const hex = oklchToHex(color);
            const oklchStr = formatOklch(color);
            return (
              <div class="perceptual-color">
                <div
                  class="perceptual-color-swatch"
                  style={`background-color: ${hex};`}
                  title={`${hex}\n${oklchStr}`}
                />
                <div class="perceptual-color-info">
                  <div class="color-number">#{index + 1}</div>
                  <code class="color-hex">{hex}</code>
                  <code class="color-oklch-compact">H: {color.h.toFixed(0)}°</code>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Algorithm 3: Functional Scale Generation */}
      <div class="algorithm-section">
        <h3 class="algorithm-title">3. Functional Scale Generation</h3>
        <p class="algorithm-description">
          A mathematical scale using lightness, chroma, and hue functions. Saturation peaks at midpoint, with hue
          shifting to prevent muddy shadows and washed-out highlights (Bezold-Brücke effect).
        </p>
        <div class="functional-scale">
          <div class="functional-scale-bar">
            {functionalScale.colors.map((color, index) => {
              const hex = oklchToHex(color);
              return (
                <div
                  class="functional-scale-step"
                  style={`background-color: ${hex};`}
                  title={`Step ${index}\n${hex}\n${formatOklch(color)}`}
                />
              );
            })}
          </div>
          <div class="functional-scale-details">
            {functionalScale.colors.map((color, index) => {
              const hex = oklchToHex(color);
              const oklchStr = formatOklch(color);
              return (
                <div class="functional-scale-item">
                  <div class="scale-step-label">Step {index}</div>
                  <div class="scale-color-swatch" style={`background-color: ${hex};`} />
                  <div class="scale-color-info">
                    <code class="color-hex">{hex}</code>
                    <code class="color-oklch-values">
                      L:{(color.l * 100).toFixed(0)} C:{color.c.toFixed(3)} H:{color.h.toFixed(0)}°
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>
        {`
          .algorithm-section {
            margin-top: 3rem;
            padding: 2rem;
            background: var(--surface-color, #ffffff);
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .algorithm-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-primary, #1a1a1a);
          }

          .algorithm-description {
            color: var(--text-secondary, #666);
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }

          /* Classical Harmony */
          .harmony-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .harmony-card {
            padding: 1.25rem;
            background: var(--surface-elevated, #f9f9f9);
            border-radius: 8px;
            border: 1px solid var(--border-color, #e0e0e0);
          }

          .harmony-name {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-primary, #1a1a1a);
          }

          .harmony-description {
            font-size: 0.875rem;
            color: var(--text-secondary, #666);
            margin-bottom: 1rem;
          }

          .harmony-colors {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .combination-color {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .combination-color-swatch {
            width: 48px;
            height: 48px;
            border-radius: 6px;
            flex-shrink: 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.2s;
          }

          .combination-color-swatch:hover {
            transform: scale(1.1);
          }

          .combination-color-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            min-width: 0;
          }

          .color-hex {
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 0.875rem;
            color: var(--text-primary, #1a1a1a);
          }

          .color-oklch {
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 0.75rem;
            color: var(--text-secondary, #666);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          /* Perceptual Weighting */
          .perceptual-colors {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1rem;
          }

          .perceptual-color {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }

          .perceptual-color-swatch {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.2s;
          }

          .perceptual-color-swatch:hover {
            transform: scale(1.05);
          }

          .perceptual-color-info {
            text-align: center;
            width: 100%;
          }

          .color-number {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary, #666);
            margin-bottom: 0.25rem;
          }

          .color-oklch-compact {
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 0.75rem;
            color: var(--text-secondary, #666);
            display: block;
            margin-top: 0.25rem;
          }

          /* Functional Scale */
          .functional-scale {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .functional-scale-bar {
            display: flex;
            width: 100%;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .functional-scale-step {
            flex: 1;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .functional-scale-step:hover {
            transform: scaleY(1.1);
            z-index: 1;
          }

          .functional-scale-details {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
          }

          .functional-scale-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
            background: var(--surface-elevated, #f9f9f9);
            border-radius: 6px;
            border: 1px solid var(--border-color, #e0e0e0);
          }

          .scale-step-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary, #666);
          }

          .scale-color-swatch {
            width: 100%;
            height: 48px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .scale-color-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .color-oklch-values {
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 0.75rem;
            color: var(--text-secondary, #666);
          }

          @media (max-width: 768px) {
            .algorithm-section {
              padding: 1.5rem;
            }

            .harmony-grid {
              grid-template-columns: 1fr;
            }

            .perceptual-colors {
              grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            }

            .functional-scale-details {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </section>
  );
};
