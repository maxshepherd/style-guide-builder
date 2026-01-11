/**
 * Type definitions for the Style Guide Builder
 */

// OKLCH Color representation
export interface OKLCHColor {
  l: number; // Lightness: 0-1
  c: number; // Chroma: 0-0.4 (typical max)
  h: number; // Hue: 0-360
  alpha?: number; // Alpha: 0-1
}

// RGB Color representation
export interface RGBColor {
  r: number; // Red: 0-255
  g: number; // Green: 0-255
  b: number; // Blue: 0-255
  alpha?: number; // Alpha: 0-1
}

// Color definition with metadata
export interface ColorDefinition {
  name: string;
  oklch: OKLCHColor;
  description?: string;
  usage?: string;
}

// Color palette
export interface ColorPalette {
  name: string;
  colors: ColorDefinition[];
}

// Typography scale
export interface TypographyScale {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  body: string;
  small: string;
}

// Typography configuration
export interface TypographyConfig {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  scale: TypographyScale;
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

// Spacing system
export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

// Accessibility thresholds
export interface AccessibilityConfig {
  minContrastNormal: number; // WCAG AA: 4.5:1
  minContrastLarge: number; // WCAG AA: 3:1
  minContrastAAA: number; // WCAG AAA: 7:1
  minFontSize: string;
  maxLineLength: number; // characters
}

// Complete style guide configuration
export interface StyleGuideConfig {
  title: string;
  description?: string;
  palettes: ColorPalette[];
  typography: TypographyConfig;
  spacing: SpacingScale;
  accessibility: AccessibilityConfig;
}

// Contrast check result
export interface ContrastResult {
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
  level: 'fail' | 'AA' | 'AAA';
}

// Color space matching result
export interface ColorMatch {
  name: string;
  distance: number;
  hex: string;
}

// Named color spaces for matching
export type ColorSpace = 'css' | 'tailwind' | 'material' | 'custom';
