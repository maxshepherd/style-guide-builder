import type { OKLCHColor, RGBColor, ContrastResult, ColorMatch } from './types';

/**
 * OKLCH Color Utilities
 * Based on OKLab color space - perceptually uniform color space
 */

/**
 * Convert OKLCH to RGB
 */
export function oklchToRgb(oklch: OKLCHColor): RGBColor {
  const { l, c, h, alpha = 1 } = oklch;

  // Convert OKLCH to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert OKLab to Linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Apply gamma correction
  r = gammaCorrection(r);
  g = gammaCorrection(g);
  b_ = gammaCorrection(b_);

  // Clamp and convert to 0-255
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b_ * 255))),
    alpha,
  };
}

/**
 * Apply gamma correction for sRGB
 */
function gammaCorrection(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value;
  }
  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

/**
 * Convert RGB to OKLCH
 */
export function rgbToOklch(rgb: RGBColor): OKLCHColor {
  const { r, g, b, alpha = 1 } = rgb;

  // Convert to linear RGB (0-1)
  const rLinear = inverseGammaCorrection(r / 255);
  const gLinear = inverseGammaCorrection(g / 255);
  const bLinear = inverseGammaCorrection(b / 255);

  // Convert to LMS
  const l = 0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear;
  const m = 0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear;
  const s = 0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear;

  // Convert to OKLab
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // Convert to OKLCH
  const C = Math.sqrt(a * a + B * B);
  const H = ((Math.atan2(B, a) * 180) / Math.PI + 360) % 360;

  return {
    l: L,
    c: C,
    h: H,
    alpha,
  };
}

/**
 * Inverse gamma correction
 */
function inverseGammaCorrection(value: number): number {
  if (value <= 0.04045) {
    return value / 12.92;
  }
  return Math.pow((value + 0.055) / 1.055, 2.4);
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(rgb: RGBColor): string {
  const { r, g, b, alpha = 1 } = rgb;
  const hex = [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

  if (alpha < 1) {
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hex}${alphaHex}`;
  }

  return `#${hex}`;
}

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): RGBColor {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  const alpha = cleaned.length === 8 ? parseInt(cleaned.substring(6, 8), 16) / 255 : 1;

  return { r, g, b, alpha };
}

/**
 * Convert OKLCH to HEX
 */
export function oklchToHex(oklch: OKLCHColor): string {
  return rgbToHex(oklchToRgb(oklch));
}

/**
 * Format OKLCH for CSS
 */
export function formatOklch(oklch: OKLCHColor): string {
  const { l, c, h, alpha = 1 } = oklch;
  if (alpha < 1) {
    return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(2)} / ${alpha.toFixed(2)})`;
  }
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(2)})`;
}

/**
 * Calculate relative luminance for WCAG contrast calculations
 */
export function getRelativeLuminance(rgb: RGBColor): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 */
export function getContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG standards
 */
export function checkContrast(foreground: RGBColor, background: RGBColor, isLargeText = false): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const minAA = isLargeText ? 3 : 4.5;
  const minAAA = isLargeText ? 4.5 : 7;

  return {
    ratio,
    passAA: ratio >= minAA,
    passAAA: ratio >= minAAA,
    level: ratio >= minAAA ? 'AAA' : ratio >= minAA ? 'AA' : 'fail',
  };
}

/**
 * Calculate color difference in OKLCH space (perceptual distance)
 */
export function colorDistance(color1: OKLCHColor, color2: OKLCHColor): number {
  // Simple Euclidean distance in OKLCH space
  const dl = color1.l - color2.l;
  const dc = color1.c - color2.c;

  // Handle hue wraparound
  let dh = Math.abs(color1.h - color2.h);
  if (dh > 180) {
    dh = 360 - dh;
  }
  dh = (dh / 360) * color1.c; // Weight by chroma

  return Math.sqrt(dl * dl + dc * dc + dh * dh);
}

/**
 * Find nearest color match from a palette
 */
export function findNearestColor(target: OKLCHColor, palette: Map<string, OKLCHColor>): ColorMatch | null {
  let nearest: ColorMatch | null = null;
  let minDistance = Infinity;

  for (const [name, color] of Array.from(palette.entries())) {
    const distance = colorDistance(target, color);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        name,
        distance,
        hex: oklchToHex(color),
      };
    }
  }

  return nearest;
}

/**
 * Generate a harmonious color scheme based on OKLCH
 */
export function generateColorScheme(
  baseColor: OKLCHColor,
  type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic'
): OKLCHColor[] {
  const colors: OKLCHColor[] = [baseColor];

  switch (type) {
    case 'monochromatic':
      // Vary lightness
      colors.push(
        { ...baseColor, l: Math.min(1, baseColor.l + 0.15) },
        { ...baseColor, l: Math.max(0, baseColor.l - 0.15) },
        { ...baseColor, l: Math.min(1, baseColor.l + 0.3) },
        { ...baseColor, l: Math.max(0, baseColor.l - 0.3) }
      );
      break;

    case 'analogous':
      // Colors adjacent on color wheel
      colors.push({ ...baseColor, h: (baseColor.h + 30) % 360 }, { ...baseColor, h: (baseColor.h - 30 + 360) % 360 });
      break;

    case 'complementary':
      // Opposite on color wheel
      colors.push({ ...baseColor, h: (baseColor.h + 180) % 360 });
      break;

    case 'triadic':
      // Evenly spaced on color wheel
      colors.push({ ...baseColor, h: (baseColor.h + 120) % 360 }, { ...baseColor, h: (baseColor.h + 240) % 360 });
      break;
  }

  return colors;
}

/**
 * CSS Color Names palette for matching
 */
export const CSS_COLORS = new Map<string, OKLCHColor>([
  ['aliceblue', rgbToOklch({ r: 240, g: 248, b: 255 })],
  ['antiquewhite', rgbToOklch({ r: 250, g: 235, b: 215 })],
  ['aqua', rgbToOklch({ r: 0, g: 255, b: 255 })],
  ['aquamarine', rgbToOklch({ r: 127, g: 255, b: 212 })],
  ['azure', rgbToOklch({ r: 240, g: 255, b: 255 })],
  ['beige', rgbToOklch({ r: 245, g: 245, b: 220 })],
  ['bisque', rgbToOklch({ r: 255, g: 228, b: 196 })],
  ['black', rgbToOklch({ r: 0, g: 0, b: 0 })],
  ['blanchedalmond', rgbToOklch({ r: 255, g: 235, b: 205 })],
  ['blue', rgbToOklch({ r: 0, g: 0, b: 255 })],
  ['blueviolet', rgbToOklch({ r: 138, g: 43, b: 226 })],
  ['brown', rgbToOklch({ r: 165, g: 42, b: 42 })],
  ['burlywood', rgbToOklch({ r: 222, g: 184, b: 135 })],
  ['cadetblue', rgbToOklch({ r: 95, g: 158, b: 160 })],
  ['chartreuse', rgbToOklch({ r: 127, g: 255, b: 0 })],
  ['chocolate', rgbToOklch({ r: 210, g: 105, b: 30 })],
  ['coral', rgbToOklch({ r: 255, g: 127, b: 80 })],
  ['cornflowerblue', rgbToOklch({ r: 100, g: 149, b: 237 })],
  ['cornsilk', rgbToOklch({ r: 255, g: 248, b: 220 })],
  ['crimson', rgbToOklch({ r: 220, g: 20, b: 60 })],
  ['cyan', rgbToOklch({ r: 0, g: 255, b: 255 })],
  ['darkblue', rgbToOklch({ r: 0, g: 0, b: 139 })],
  ['darkcyan', rgbToOklch({ r: 0, g: 139, b: 139 })],
  ['darkgoldenrod', rgbToOklch({ r: 184, g: 134, b: 11 })],
  ['darkgray', rgbToOklch({ r: 169, g: 169, b: 169 })],
  ['darkgreen', rgbToOklch({ r: 0, g: 100, b: 0 })],
  ['darkkhaki', rgbToOklch({ r: 189, g: 183, b: 107 })],
  ['darkmagenta', rgbToOklch({ r: 139, g: 0, b: 139 })],
  ['darkolivegreen', rgbToOklch({ r: 85, g: 107, b: 47 })],
  ['darkorange', rgbToOklch({ r: 255, g: 140, b: 0 })],
  ['darkorchid', rgbToOklch({ r: 153, g: 50, b: 204 })],
  ['darkred', rgbToOklch({ r: 139, g: 0, b: 0 })],
  ['darksalmon', rgbToOklch({ r: 233, g: 150, b: 122 })],
  ['darkseagreen', rgbToOklch({ r: 143, g: 188, b: 143 })],
  ['darkslateblue', rgbToOklch({ r: 72, g: 61, b: 139 })],
  ['darkslategray', rgbToOklch({ r: 47, g: 79, b: 79 })],
  ['darkturquoise', rgbToOklch({ r: 0, g: 206, b: 209 })],
  ['darkviolet', rgbToOklch({ r: 148, g: 0, b: 211 })],
  ['deeppink', rgbToOklch({ r: 255, g: 20, b: 147 })],
  ['deepskyblue', rgbToOklch({ r: 0, g: 191, b: 255 })],
  ['dimgray', rgbToOklch({ r: 105, g: 105, b: 105 })],
  ['dodgerblue', rgbToOklch({ r: 30, g: 144, b: 255 })],
  ['firebrick', rgbToOklch({ r: 178, g: 34, b: 34 })],
  ['floralwhite', rgbToOklch({ r: 255, g: 250, b: 240 })],
  ['forestgreen', rgbToOklch({ r: 34, g: 139, b: 34 })],
  ['fuchsia', rgbToOklch({ r: 255, g: 0, b: 255 })],
  ['gainsboro', rgbToOklch({ r: 220, g: 220, b: 220 })],
  ['ghostwhite', rgbToOklch({ r: 248, g: 248, b: 255 })],
  ['gold', rgbToOklch({ r: 255, g: 215, b: 0 })],
  ['goldenrod', rgbToOklch({ r: 218, g: 165, b: 32 })],
  ['gray', rgbToOklch({ r: 128, g: 128, b: 128 })],
  ['green', rgbToOklch({ r: 0, g: 128, b: 0 })],
  ['greenyellow', rgbToOklch({ r: 173, g: 255, b: 47 })],
  ['honeydew', rgbToOklch({ r: 240, g: 255, b: 240 })],
  ['hotpink', rgbToOklch({ r: 255, g: 105, b: 180 })],
  ['indianred', rgbToOklch({ r: 205, g: 92, b: 92 })],
  ['indigo', rgbToOklch({ r: 75, g: 0, b: 130 })],
  ['ivory', rgbToOklch({ r: 255, g: 255, b: 240 })],
  ['khaki', rgbToOklch({ r: 240, g: 230, b: 140 })],
  ['lavender', rgbToOklch({ r: 230, g: 230, b: 250 })],
  ['lavenderblush', rgbToOklch({ r: 255, g: 240, b: 245 })],
  ['lawngreen', rgbToOklch({ r: 124, g: 252, b: 0 })],
  ['lemonchiffon', rgbToOklch({ r: 255, g: 250, b: 205 })],
  ['lightblue', rgbToOklch({ r: 173, g: 216, b: 230 })],
  ['lightcoral', rgbToOklch({ r: 240, g: 128, b: 128 })],
  ['lightcyan', rgbToOklch({ r: 224, g: 255, b: 255 })],
  ['lightgoldenrodyellow', rgbToOklch({ r: 250, g: 250, b: 210 })],
  ['lightgray', rgbToOklch({ r: 211, g: 211, b: 211 })],
  ['lightgreen', rgbToOklch({ r: 144, g: 238, b: 144 })],
  ['lightpink', rgbToOklch({ r: 255, g: 182, b: 193 })],
  ['lightsalmon', rgbToOklch({ r: 255, g: 160, b: 122 })],
  ['lightseagreen', rgbToOklch({ r: 32, g: 178, b: 170 })],
  ['lightskyblue', rgbToOklch({ r: 135, g: 206, b: 250 })],
  ['lightslategray', rgbToOklch({ r: 119, g: 136, b: 153 })],
  ['lightsteelblue', rgbToOklch({ r: 176, g: 196, b: 222 })],
  ['lightyellow', rgbToOklch({ r: 255, g: 255, b: 224 })],
  ['lime', rgbToOklch({ r: 0, g: 255, b: 0 })],
  ['limegreen', rgbToOklch({ r: 50, g: 205, b: 50 })],
  ['linen', rgbToOklch({ r: 250, g: 240, b: 230 })],
  ['magenta', rgbToOklch({ r: 255, g: 0, b: 255 })],
  ['maroon', rgbToOklch({ r: 128, g: 0, b: 0 })],
  ['mediumaquamarine', rgbToOklch({ r: 102, g: 205, b: 170 })],
  ['mediumblue', rgbToOklch({ r: 0, g: 0, b: 205 })],
  ['mediumorchid', rgbToOklch({ r: 186, g: 85, b: 211 })],
  ['mediumpurple', rgbToOklch({ r: 147, g: 112, b: 219 })],
  ['mediumseagreen', rgbToOklch({ r: 60, g: 179, b: 113 })],
  ['mediumslateblue', rgbToOklch({ r: 123, g: 104, b: 238 })],
  ['mediumspringgreen', rgbToOklch({ r: 0, g: 250, b: 154 })],
  ['mediumturquoise', rgbToOklch({ r: 72, g: 209, b: 204 })],
  ['mediumvioletred', rgbToOklch({ r: 199, g: 21, b: 133 })],
  ['midnightblue', rgbToOklch({ r: 25, g: 25, b: 112 })],
  ['mintcream', rgbToOklch({ r: 245, g: 255, b: 250 })],
  ['mistyrose', rgbToOklch({ r: 255, g: 228, b: 225 })],
  ['moccasin', rgbToOklch({ r: 255, g: 228, b: 181 })],
  ['navajowhite', rgbToOklch({ r: 255, g: 222, b: 173 })],
  ['navy', rgbToOklch({ r: 0, g: 0, b: 128 })],
  ['oldlace', rgbToOklch({ r: 253, g: 245, b: 230 })],
  ['olive', rgbToOklch({ r: 128, g: 128, b: 0 })],
  ['olivedrab', rgbToOklch({ r: 107, g: 142, b: 35 })],
  ['orange', rgbToOklch({ r: 255, g: 165, b: 0 })],
  ['orangered', rgbToOklch({ r: 255, g: 69, b: 0 })],
  ['orchid', rgbToOklch({ r: 218, g: 112, b: 214 })],
  ['palegoldenrod', rgbToOklch({ r: 238, g: 232, b: 170 })],
  ['palegreen', rgbToOklch({ r: 152, g: 251, b: 152 })],
  ['paleturquoise', rgbToOklch({ r: 175, g: 238, b: 238 })],
  ['palevioletred', rgbToOklch({ r: 219, g: 112, b: 147 })],
  ['papayawhip', rgbToOklch({ r: 255, g: 239, b: 213 })],
  ['peachpuff', rgbToOklch({ r: 255, g: 218, b: 185 })],
  ['peru', rgbToOklch({ r: 205, g: 133, b: 63 })],
  ['pink', rgbToOklch({ r: 255, g: 192, b: 203 })],
  ['plum', rgbToOklch({ r: 221, g: 160, b: 221 })],
  ['powderblue', rgbToOklch({ r: 176, g: 224, b: 230 })],
  ['purple', rgbToOklch({ r: 128, g: 0, b: 128 })],
  ['red', rgbToOklch({ r: 255, g: 0, b: 0 })],
  ['rosybrown', rgbToOklch({ r: 188, g: 143, b: 143 })],
  ['royalblue', rgbToOklch({ r: 65, g: 105, b: 225 })],
  ['saddlebrown', rgbToOklch({ r: 139, g: 69, b: 19 })],
  ['salmon', rgbToOklch({ r: 250, g: 128, b: 114 })],
  ['sandybrown', rgbToOklch({ r: 244, g: 164, b: 96 })],
  ['seagreen', rgbToOklch({ r: 46, g: 139, b: 87 })],
  ['seashell', rgbToOklch({ r: 255, g: 245, b: 238 })],
  ['sienna', rgbToOklch({ r: 160, g: 82, b: 45 })],
  ['silver', rgbToOklch({ r: 192, g: 192, b: 192 })],
  ['skyblue', rgbToOklch({ r: 135, g: 206, b: 235 })],
  ['slateblue', rgbToOklch({ r: 106, g: 90, b: 205 })],
  ['slategray', rgbToOklch({ r: 112, g: 128, b: 144 })],
  ['snow', rgbToOklch({ r: 255, g: 250, b: 250 })],
  ['springgreen', rgbToOklch({ r: 0, g: 255, b: 127 })],
  ['steelblue', rgbToOklch({ r: 70, g: 130, b: 180 })],
  ['tan', rgbToOklch({ r: 210, g: 180, b: 140 })],
  ['teal', rgbToOklch({ r: 0, g: 128, b: 128 })],
  ['thistle', rgbToOklch({ r: 216, g: 191, b: 216 })],
  ['tomato', rgbToOklch({ r: 255, g: 99, b: 71 })],
  ['turquoise', rgbToOklch({ r: 64, g: 224, b: 208 })],
  ['violet', rgbToOklch({ r: 238, g: 130, b: 238 })],
  ['wheat', rgbToOklch({ r: 245, g: 222, b: 179 })],
  ['white', rgbToOklch({ r: 255, g: 255, b: 255 })],
  ['whitesmoke', rgbToOklch({ r: 245, g: 245, b: 245 })],
  ['yellow', rgbToOklch({ r: 255, g: 255, b: 0 })],
  ['yellowgreen', rgbToOklch({ r: 154, g: 205, b: 50 })],
]);

/**
 * Generate a complete color palette from a base color
 * Creates primary, neutral, success, warning, and error palettes
 */
export function generatePaletteFromBase(baseColor: OKLCHColor): {
  primary: OKLCHColor[];
  neutral: OKLCHColor[];
  success: OKLCHColor[];
  warning: OKLCHColor[];
  error: OKLCHColor[];
} {
  // Use the base color as the primary-500
  const primary500 = baseColor;

  // Generate primary palette (shades from 50 to 900)
  const primary = [
    { ...primary500, l: 0.95, c: Math.min(0.02, primary500.c * 0.1) }, // 50
    { ...primary500, l: 0.9, c: Math.min(0.04, primary500.c * 0.2) }, // 100
    { ...primary500, l: 0.8, c: primary500.c * 0.4 }, // 200
    { ...primary500, l: 0.7, c: primary500.c * 0.6 }, // 300
    { ...primary500, l: 0.6, c: primary500.c * 0.8 }, // 400
    primary500, // 500 - base color
    { ...primary500, l: Math.max(0.35, primary500.l - 0.15), c: primary500.c * 0.9 }, // 600
    { ...primary500, l: Math.max(0.3, primary500.l - 0.25), c: primary500.c * 0.85 }, // 700
    { ...primary500, l: Math.max(0.2, primary500.l - 0.35), c: primary500.c * 0.7 }, // 800
    { ...primary500, l: Math.max(0.15, primary500.l - 0.45), c: primary500.c * 0.6 }, // 900
  ];

  // Generate neutral palette (low chroma, similar hue)
  const neutralHue = primary500.h;
  const neutral = [
    { l: 0.98, c: 0.005, h: neutralHue }, // 50
    { l: 0.96, c: 0.008, h: neutralHue }, // 100
    { l: 0.92, c: 0.01, h: neutralHue }, // 200
    { l: 0.85, c: 0.012, h: neutralHue }, // 300
    { l: 0.7, c: 0.015, h: neutralHue }, // 400
    { l: 0.55, c: 0.018, h: neutralHue }, // 500
    { l: 0.45, c: 0.02, h: neutralHue }, // 600
    { l: 0.35, c: 0.022, h: neutralHue }, // 700
    { l: 0.25, c: 0.025, h: neutralHue }, // 800
    { l: 0.15, c: 0.028, h: neutralHue }, // 900
  ];

  // Generate success palette (green - around 140° hue)
  const successBase = { l: 0.55, c: 0.15, h: 140 };
  const success = [
    { ...successBase, l: 0.95, c: 0.02 }, // 50
    { ...successBase, l: 0.9, c: 0.04 }, // 100
    { ...successBase, l: 0.8, c: 0.08 }, // 200
    { ...successBase, l: 0.7, c: 0.11 }, // 300
    { ...successBase, l: 0.6, c: 0.13 }, // 400
    successBase, // 500
    { ...successBase, l: 0.45, c: 0.14 }, // 600
    { ...successBase, l: 0.35, c: 0.13 }, // 700
    { ...successBase, l: 0.28, c: 0.11 }, // 800
    { ...successBase, l: 0.2, c: 0.09 }, // 900
  ];

  // Generate warning palette (amber/orange - around 80° hue)
  const warningBase = { l: 0.65, c: 0.18, h: 80 };
  const warning = [
    { ...warningBase, l: 0.95, c: 0.03 }, // 50
    { ...warningBase, l: 0.9, c: 0.06 }, // 100
    { ...warningBase, l: 0.8, c: 0.1 }, // 200
    { ...warningBase, l: 0.75, c: 0.14 }, // 300
    { ...warningBase, l: 0.7, c: 0.16 }, // 400
    warningBase, // 500
    { ...warningBase, l: 0.55, c: 0.17 }, // 600
    { ...warningBase, l: 0.45, c: 0.16 }, // 700
    { ...warningBase, l: 0.35, c: 0.14 }, // 800
    { ...warningBase, l: 0.25, c: 0.11 }, // 900
  ];

  // Generate error palette (red - around 25° hue)
  const errorBase = { l: 0.55, c: 0.22, h: 25 };
  const error = [
    { ...errorBase, l: 0.95, c: 0.03 }, // 50
    { ...errorBase, l: 0.9, c: 0.06 }, // 100
    { ...errorBase, l: 0.8, c: 0.12 }, // 200
    { ...errorBase, l: 0.7, c: 0.17 }, // 300
    { ...errorBase, l: 0.6, c: 0.2 }, // 400
    errorBase, // 500
    { ...errorBase, l: 0.45, c: 0.21 }, // 600
    { ...errorBase, l: 0.38, c: 0.2 }, // 700
    { ...errorBase, l: 0.3, c: 0.17 }, // 800
    { ...errorBase, l: 0.22, c: 0.14 }, // 900
  ];

  return {
    primary,
    neutral,
    success,
    warning,
    error,
  };
}

/**
 * Algorithm 1: Classical Harmony Schemes
 * Generate color combinations based on fixed angular relationships on the color wheel
 */
export interface HarmonyScheme {
  name: string;
  colors: OKLCHColor[];
  description: string;
}

export function generateClassicalHarmony(baseColor: OKLCHColor): HarmonyScheme[] {
  return [
    {
      name: 'Complementary',
      description: 'Two colors opposite each other (180° apart)',
      colors: [baseColor, { ...baseColor, h: (baseColor.h + 180) % 360 }],
    },
    {
      name: 'Analogous',
      description: 'Colors adjacent to each other (30° and 330°)',
      colors: [
        { ...baseColor, h: (baseColor.h - 30 + 360) % 360 },
        baseColor,
        { ...baseColor, h: (baseColor.h + 30) % 360 },
      ],
    },
    {
      name: 'Triadic',
      description: 'Three colors equally spaced (120° apart)',
      colors: [
        baseColor,
        { ...baseColor, h: (baseColor.h + 120) % 360 },
        { ...baseColor, h: (baseColor.h + 240) % 360 },
      ],
    },
    {
      name: 'Tetradic',
      description: 'Four colors in two complementary pairs',
      colors: [
        baseColor,
        { ...baseColor, h: (baseColor.h + 60) % 360 },
        { ...baseColor, h: (baseColor.h + 180) % 360 },
        { ...baseColor, h: (baseColor.h + 240) % 360 },
      ],
    },
  ];
}

/**
 * Algorithm 2: Perceptual Weighting in OKLCH
 * Generate colors with constant lightness and chroma, varying only hue
 * This ensures all colors have equal visual weight
 */
export function generatePerceptuallyBalanced(baseColor: OKLCHColor, count: number = 6): OKLCHColor[] {
  const colors: OKLCHColor[] = [];
  const { l, c } = baseColor;

  // Distribute colors evenly around the color wheel
  const step = 360 / count;

  for (let i = 0; i < count; i++) {
    colors.push({
      l, // Constant lightness
      c, // Constant chroma
      h: (baseColor.h + i * step) % 360,
      alpha: baseColor.alpha,
    });
  }

  return colors;
}

/**
 * Algorithm 3: Functional Scale Generation
 * Generate an extensive scale of shades and tints using mathematical functions
 */
export interface FunctionalScale {
  name: string;
  colors: OKLCHColor[];
}

export function generateFunctionalScale(baseColor: OKLCHColor, steps: number = 11): FunctionalScale {
  const colors: OKLCHColor[] = [];

  for (let i = 0; i < steps; i++) {
    // Normalize to 0-1 range
    const n = i / (steps - 1);

    // Lightness function: L(n) = 1 - n (linear from light to dark)
    const lightness = 1 - n * 0.85; // Don't go completely black

    // Chroma function: upside-down parabola, peaks at midpoint
    // C(n) = 4 * baseChroma * n * (1 - n)
    // This makes colors more saturated in the middle, less at extremes
    const chromaMultiplier = 4 * n * (1 - n);
    const chroma = baseColor.c * Math.max(0.2, chromaMultiplier);

    // Hue shifting (Bezold-Brücke effect)
    // Adjust hue slightly as lightness decreases
    // Warmer hues shift towards red in shadows, cooler towards blue
    let hueShift = 0;
    if (baseColor.h >= 30 && baseColor.h <= 90) {
      // Warm colors: shift towards red in shadows
      hueShift = -(1 - n) * 10;
    } else if (baseColor.h >= 180 && baseColor.h <= 270) {
      // Cool colors: shift towards blue in shadows
      hueShift = (1 - n) * 10;
    }

    colors.push({
      l: Math.max(0.05, Math.min(0.98, lightness)),
      c: Math.max(0, Math.min(0.5, chroma)),
      h: (baseColor.h + hueShift + 360) % 360,
      alpha: baseColor.alpha,
    });
  }

  return {
    name: 'Functional Scale',
    colors,
  };
}
