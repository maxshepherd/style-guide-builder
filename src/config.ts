import type { StyleGuideConfig } from './types';

/**
 * Default configuration with excellent UI guardrails
 */
export const defaultConfig: StyleGuideConfig = {
  title: 'Design System',
  description: 'A comprehensive style guide for consistent design',

  palettes: [
    {
      name: 'Primary',
      colors: [
        {
          name: 'primary-50',
          oklch: { l: 0.95, c: 0.02, h: 250 },
          description: 'Lightest primary shade',
          usage: 'Backgrounds, subtle accents',
        },
        {
          name: 'primary-100',
          oklch: { l: 0.9, c: 0.04, h: 250 },
          usage: 'Hover states, borders',
        },
        {
          name: 'primary-500',
          oklch: { l: 0.55, c: 0.2, h: 250 },
          description: 'Main brand color',
          usage: 'Primary buttons, links, key UI elements',
        },
        {
          name: 'primary-700',
          oklch: { l: 0.4, c: 0.18, h: 250 },
          usage: 'Active states, emphasis',
        },
        {
          name: 'primary-900',
          oklch: { l: 0.25, c: 0.12, h: 250 },
          description: 'Darkest primary shade',
          usage: 'Text on light backgrounds',
        },
      ],
    },
    {
      name: 'Neutral',
      colors: [
        {
          name: 'neutral-50',
          oklch: { l: 0.98, c: 0.005, h: 250 },
          usage: 'Page backgrounds',
        },
        {
          name: 'neutral-100',
          oklch: { l: 0.95, c: 0.005, h: 250 },
          usage: 'Card backgrounds',
        },
        {
          name: 'neutral-300',
          oklch: { l: 0.85, c: 0.01, h: 250 },
          usage: 'Borders, dividers',
        },
        {
          name: 'neutral-500',
          oklch: { l: 0.6, c: 0.01, h: 250 },
          usage: 'Secondary text, icons',
        },
        {
          name: 'neutral-700',
          oklch: { l: 0.4, c: 0.015, h: 250 },
          usage: 'Body text',
        },
        {
          name: 'neutral-900',
          oklch: { l: 0.2, c: 0.02, h: 250 },
          usage: 'Headings, emphasis',
        },
      ],
    },
    {
      name: 'Semantic',
      colors: [
        {
          name: 'success',
          oklch: { l: 0.65, c: 0.18, h: 145 },
          description: 'Success states',
          usage: 'Success messages, confirmations',
        },
        {
          name: 'warning',
          oklch: { l: 0.75, c: 0.15, h: 85 },
          description: 'Warning states',
          usage: 'Warnings, caution messages',
        },
        {
          name: 'error',
          oklch: { l: 0.6, c: 0.22, h: 25 },
          description: 'Error states',
          usage: 'Error messages, destructive actions',
        },
        {
          name: 'info',
          oklch: { l: 0.65, c: 0.18, h: 230 },
          description: 'Informational states',
          usage: 'Info messages, tips',
        },
      ],
    },
  ],

  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    scale: {
      h1: '3rem', // 48px - Major headings
      h2: '2.25rem', // 36px - Section headings
      h3: '1.875rem', // 30px - Subsection headings
      h4: '1.5rem', // 24px - Card headings
      h5: '1.25rem', // 20px - Small headings
      h6: '1.125rem', // 18px - Smallest headings
      body: '1rem', // 16px - Body text (base)
      small: '0.875rem', // 14px - Small text, captions
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },

  accessibility: {
    minContrastNormal: 4.5, // WCAG AA for normal text
    minContrastLarge: 3, // WCAG AA for large text (18pt+)
    minContrastAAA: 7, // WCAG AAA
    minFontSize: '16px', // Minimum readable font size
    maxLineLength: 75, // Max characters per line for readability
  },
};

/**
 * Load user configuration with validation and defaults
 */
export function loadConfig(userConfig?: Partial<StyleGuideConfig>): StyleGuideConfig {
  if (!userConfig) {
    return defaultConfig;
  }

  // Deep merge with defaults
  return {
    title: userConfig.title ?? defaultConfig.title,
    description: userConfig.description ?? defaultConfig.description,
    palettes: userConfig.palettes ?? defaultConfig.palettes,
    typography: {
      fontFamily: {
        ...defaultConfig.typography.fontFamily,
        ...userConfig.typography?.fontFamily,
      },
      scale: {
        ...defaultConfig.typography.scale,
        ...userConfig.typography?.scale,
      },
      lineHeight: {
        ...defaultConfig.typography.lineHeight,
        ...userConfig.typography?.lineHeight,
      },
      fontWeight: {
        ...defaultConfig.typography.fontWeight,
        ...userConfig.typography?.fontWeight,
      },
    },
    spacing: {
      ...defaultConfig.spacing,
      ...userConfig.spacing,
    },
    accessibility: {
      ...defaultConfig.accessibility,
      ...userConfig.accessibility,
    },
  };
}

/**
 * Validate configuration and provide warnings
 */
export function validateConfig(config: StyleGuideConfig): string[] {
  const warnings: string[] = [];

  // Check for empty palettes
  if (config.palettes.length === 0) {
    warnings.push('No color palettes defined');
  }

  // Check OKLCH values are in valid ranges
  config.palettes.forEach((palette) => {
    palette.colors.forEach((color) => {
      if (color.oklch.l < 0 || color.oklch.l > 1) {
        warnings.push(`${color.name}: Lightness (${color.oklch.l}) should be between 0 and 1`);
      }
      if (color.oklch.c < 0) {
        warnings.push(`${color.name}: Chroma (${color.oklch.c}) should be positive`);
      }
      if (color.oklch.h < 0 || color.oklch.h > 360) {
        warnings.push(`${color.name}: Hue (${color.oklch.h}) should be between 0 and 360`);
      }
    });
  });

  // Check font sizes are reasonable
  const parseSize = (size: string) => parseFloat(size);
  const h1Size = parseSize(config.typography.scale.h1);
  const bodySize = parseSize(config.typography.scale.body);

  if (h1Size < bodySize) {
    warnings.push('H1 font size should be larger than body text');
  }

  // Check accessibility thresholds
  if (config.accessibility.minContrastNormal < 4.5) {
    warnings.push('Normal text contrast ratio below WCAG AA standard (4.5:1)');
  }
  if (config.accessibility.minContrastLarge < 3) {
    warnings.push('Large text contrast ratio below WCAG AA standard (3:1)');
  }

  return warnings;
}

/**
 * Export configuration as JSON
 */
export function exportConfig(config: StyleGuideConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Import configuration from JSON
 */
export function importConfig(json: string): StyleGuideConfig {
  try {
    const userConfig = JSON.parse(json) as Partial<StyleGuideConfig>;
    return loadConfig(userConfig);
  } catch (error) {
    throw new Error(`Invalid configuration JSON: ${error}`);
  }
}
