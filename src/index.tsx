/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { StyleGuideConfig } from './types';
import { defaultConfig, loadConfig, validateConfig, exportConfig, importConfig } from './config';
import { StyleGuidePage } from './components/StyleGuidePage';
import { generateCSS } from './styles';
import {
  oklchToRgb,
  oklchToHex,
  rgbToOklch,
  hexToRgb,
  checkContrast,
  findNearestColor,
  CSS_COLORS,
  generatePaletteFromBase,
} from './colors';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('/api/*', prettyJSON());

// Store current configuration (in production, use a database)
let currentConfig: StyleGuideConfig = defaultConfig;

/**
 * Main style guide page
 */
app.get('/', (c) => {
  return c.html(<StyleGuidePage config={currentConfig} />);
});

/**
 * Serve dynamic CSS based on configuration
 */
app.get('/styles.css', (c) => {
  const css = generateCSS(currentConfig);
  return c.text(css, 200, {
    'Content-Type': 'text/css',
  });
});

/**
 * API: Get current configuration
 */
app.get('/api/config', (c) => {
  return c.json(currentConfig);
});

/**
 * API: Update configuration
 */
app.post('/api/config', async (c) => {
  try {
    const body = await c.req.json();
    const newConfig = loadConfig(body);
    const warnings = validateConfig(newConfig);

    currentConfig = newConfig;

    return c.json({
      success: true,
      config: currentConfig,
      warnings,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid configuration',
      },
      400
    );
  }
});

/**
 * API: Reset to default configuration
 */
app.post('/api/config/reset', (c) => {
  currentConfig = defaultConfig;
  return c.json({
    success: true,
    config: currentConfig,
  });
});

/**
 * API: Export configuration as JSON
 */
app.get('/api/config/export', (c) => {
  const json = exportConfig(currentConfig);
  return c.text(json, 200, {
    'Content-Type': 'application/json',
    'Content-Disposition': 'attachment; filename="style-guide-config.json"',
  });
});

/**
 * API: Import configuration from JSON
 */
app.post('/api/config/import', async (c) => {
  try {
    const body = await c.req.text();
    const newConfig = importConfig(body);
    const warnings = validateConfig(newConfig);

    currentConfig = newConfig;

    return c.json({
      success: true,
      config: currentConfig,
      warnings,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid JSON',
      },
      400
    );
  }
});

/**
 * API: Validate configuration
 */
app.post('/api/config/validate', async (c) => {
  try {
    const body = await c.req.json();
    const config = loadConfig(body);
    const warnings = validateConfig(config);

    return c.json({
      valid: warnings.length === 0,
      warnings,
    });
  } catch (error) {
    return c.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid configuration',
      },
      400
    );
  }
});

/**
 * API: Convert color between formats
 */
app.post('/api/color/convert', async (c) => {
  try {
    const body = await c.req.json();
    const { from, value } = body;

    let oklch;

    if (from === 'hex') {
      const rgb = hexToRgb(value);
      oklch = rgbToOklch(rgb);
    } else if (from === 'rgb') {
      oklch = rgbToOklch(value);
    } else if (from === 'oklch') {
      oklch = value;
    } else {
      return c.json({ error: 'Invalid format. Use: hex, rgb, or oklch' }, 400);
    }

    const rgb = oklchToRgb(oklch);
    const hex = oklchToHex(oklch);

    return c.json({
      oklch,
      rgb,
      hex,
    });
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Conversion failed',
      },
      400
    );
  }
});

/**
 * API: Check contrast between two colors
 */
app.post('/api/color/contrast', async (c) => {
  try {
    const body = await c.req.json();
    const { foreground, background, isLargeText = false } = body;

    // Convert to RGB if needed
    const fgRgb = foreground.r !== undefined ? foreground : oklchToRgb(foreground);
    const bgRgb = background.r !== undefined ? background : oklchToRgb(background);

    const result = checkContrast(fgRgb, bgRgb, isLargeText);

    return c.json(result);
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Contrast check failed',
      },
      400
    );
  }
});

/**
 * API: Find nearest CSS color match
 */
app.post('/api/color/match', async (c) => {
  try {
    const body = await c.req.json();
    const { color } = body;

    const match = findNearestColor(color, CSS_COLORS);

    return c.json(match);
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Color matching failed',
      },
      400
    );
  }
});

/**
 * API: Get all CSS colors
 */
app.get('/api/colors/css', (c) => {
  const colors = Array.from(CSS_COLORS.entries()).map(([name, oklch]) => ({
    name,
    oklch,
    hex: oklchToHex(oklch),
    rgb: oklchToRgb(oklch),
  }));

  return c.json(colors);
});

/**
 * API: Generate palette from base color
 */
app.post('/api/palette/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { baseColor } = body;

    if (
      !baseColor ||
      typeof baseColor.l !== 'number' ||
      typeof baseColor.c !== 'number' ||
      typeof baseColor.h !== 'number'
    ) {
      return c.json({ error: 'Invalid base color. Must provide OKLCH color with l, c, h values.' }, 400);
    }

    // Generate the palette
    const palettes = generatePaletteFromBase(baseColor);

    // Build the new configuration
    const shadeNames = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

    const newConfig: StyleGuideConfig = {
      ...currentConfig,
      palettes: [
        {
          name: 'Primary',
          colors: palettes.primary.map((color, i) => ({
            name: `primary-${shadeNames[i]}`,
            oklch: color,
            description: i === 5 ? 'Base color' : undefined,
            usage: i === 5 ? 'Primary buttons, links, key UI elements' : undefined,
          })),
        },
        {
          name: 'Neutral',
          colors: palettes.neutral.map((color, i) => ({
            name: `neutral-${shadeNames[i]}`,
            oklch: color,
            usage: i === 0 ? 'Backgrounds' : i === 9 ? 'Text' : undefined,
          })),
        },
        {
          name: 'Success',
          colors: palettes.success.map((color, i) => ({
            name: `success-${shadeNames[i]}`,
            oklch: color,
            usage: i === 5 ? 'Success messages, confirmations' : undefined,
          })),
        },
        {
          name: 'Warning',
          colors: palettes.warning.map((color, i) => ({
            name: `warning-${shadeNames[i]}`,
            oklch: color,
            usage: i === 5 ? 'Warning messages, alerts' : undefined,
          })),
        },
        {
          name: 'Error',
          colors: palettes.error.map((color, i) => ({
            name: `error-${shadeNames[i]}`,
            oklch: color,
            usage: i === 5 ? 'Error messages, destructive actions' : undefined,
          })),
        },
      ],
    };

    currentConfig = newConfig;

    return c.json({
      success: true,
      config: currentConfig,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Palette generation failed',
      },
      400
    );
  }
});

/**
 * Health check
 */
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
