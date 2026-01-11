import type { FC } from 'hono/jsx';
import type { ColorDefinition } from '../types';
import { oklchToHex, oklchToRgb, formatOklch, checkContrast, findNearestColor, CSS_COLORS } from '../colors';

export const ColorCard: FC<{ color: ColorDefinition }> = ({ color }) => {
  const rgb = oklchToRgb(color.oklch);
  const hex = oklchToHex(color.oklch);
  const oklchFormatted = formatOklch(color.oklch);

  // Find nearest CSS color match
  const match = findNearestColor(color.oklch, CSS_COLORS);

  // Check contrast against white and black
  const whiteRgb = { r: 255, g: 255, b: 255 };
  const blackRgb = { r: 0, g: 0, b: 0 };
  const contrastWhite = checkContrast(rgb, whiteRgb);
  const contrastBlack = checkContrast(rgb, blackRgb);

  // Choose text color with better contrast
  const textColor = contrastWhite.ratio > contrastBlack.ratio ? '#fff' : '#000';
  const contrast = contrastWhite.ratio > contrastBlack.ratio ? contrastWhite : contrastBlack;

  return (
    <div class="color-card">
      <div class="color-swatch" style={`background: ${oklchFormatted}; color: ${textColor};`}>
        <div>
          <div class="color-name">{color.name}</div>
        </div>
        <div class="color-values">
          <div class="color-value">{hex.toUpperCase()}</div>
          <div class="color-value">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </div>
          <div class="color-value">{oklchFormatted}</div>
        </div>
      </div>
      <div class="color-info">
        {color.description && <p class="color-description">{color.description}</p>}
        {color.usage && <p class="color-usage">Usage: {color.usage}</p>}
        {match && (
          <div class="color-match">
            <strong>Nearest CSS color:</strong> {match.name}
            <br />
            <small>Distance: {match.distance.toFixed(4)}</small>
          </div>
        )}
        <div style="margin-top: var(--space-sm);">
          <strong>Contrast:</strong> {contrast.ratio.toFixed(2)}:1
          <span class={`contrast-badge contrast-${contrast.level}`}>{contrast.level.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
