# Style Guide Builder - Usage Guide

## Getting Started

Your style guide builder is now running! Here's how to use it:

### View Your Style Guide

Visit `http://localhost:3000` to see your live style guide with:

- Large minimal color cards showing OKLCH, RGB, and HEX values
- Nearest CSS color matches for each color
- WCAG contrast checking with AA/AAA badges
- Complete typography showcase (H1-H6, paragraphs, lists)
- Spacing system visualization
- Accessibility guidelines

## Customizing Your Style Guide

### Option 1: Use the API

Update your configuration by sending a POST request:

```bash
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d @example-config.json
```

### Option 2: Modify the Default Config

Edit `src/config.ts` and change the `defaultConfig` object to match your design system.

### Option 3: Create a Custom Config File

Create a JSON file with your configuration and import it via the API:

```bash
curl -X POST http://localhost:3000/api/config/import \
  -H "Content-Type: text/plain" \
  --data-binary @my-custom-config.json
```

## Working with OKLCH Colors

OKLCH provides a mathematically precise way to define colors:

### Understanding OKLCH Values

- **L (Lightness)**: 0 to 1

  - 0 = Pure black
  - 0.5 = Medium brightness
  - 1 = Pure white

- **C (Chroma)**: 0 to ~0.4

  - 0 = Grayscale (no color)
  - 0.1 = Subtle color
  - 0.2+ = Vibrant color

- **H (Hue)**: 0 to 360 degrees
  - 0 = Red
  - 120 = Green
  - 240 = Blue
  - 360 = Back to red

### Color Examples

```json
{
  "name": "vibrant-blue",
  "oklch": {
    "l": 0.6, // Medium brightness
    "c": 0.22, // High saturation
    "h": 250 // Blue hue
  }
}
```

```json
{
  "name": "subtle-gray",
  "oklch": {
    "l": 0.5, // Medium brightness
    "c": 0.01, // Very low saturation (almost gray)
    "h": 0 // Hue doesn't matter much at low chroma
  }
}
```

## API Examples

### Convert a HEX Color to OKLCH

```bash
curl -X POST http://localhost:3000/api/color/convert \
  -H "Content-Type: application/json" \
  -d '{"from": "hex", "value": "#667eea"}'
```

Response:

```json
{
  "oklch": { "l": 0.62, "c": 0.18, "h": 268 },
  "rgb": { "r": 102, "g": 126, "b": 234 },
  "hex": "#667eea"
}
```

### Check Contrast Between Two Colors

```bash
curl -X POST http://localhost:3000/api/color/contrast \
  -H "Content-Type: application/json" \
  -d '{
    "foreground": {"r": 102, "g": 126, "b": 234},
    "background": {"r": 255, "g": 255, "b": 255},
    "isLargeText": false
  }'
```

Response:

```json
{
  "ratio": 4.52,
  "passAA": true,
  "passAAA": false,
  "level": "AA"
}
```

### Find Nearest CSS Color

```bash
curl -X POST http://localhost:3000/api/color/match \
  -H "Content-Type: application/json" \
  -d '{"color": {"l": 0.6, "c": 0.2, "h": 250}}'
```

Response:

```json
{
  "name": "slateblue",
  "distance": 0.0234,
  "hex": "#6a5acd"
}
```

## Accessibility Features

The style guide automatically checks every color for:

1. **Contrast Ratios**: Against white and black backgrounds
2. **WCAG Levels**: AA and AAA compliance badges
3. **Readability**: Automatic text color selection for optimal contrast
4. **Warnings**: Configuration validation with accessibility alerts

### WCAG Standards

- **AA Normal Text**: 4.5:1 minimum (default for body text)
- **AA Large Text**: 3:1 minimum (18pt+ or 14pt+ bold)
- **AAA Normal Text**: 7:1 minimum (enhanced)
- **AAA Large Text**: 4.5:1 minimum (enhanced)

## Tips for Building Your Palette

### 1. Start with Brand Colors

Define your primary brand color in OKLCH, then create variations:

```json
{
  "name": "Primary",
  "colors": [
    { "name": "primary-50", "oklch": { "l": 0.95, "c": 0.05, "h": 250 } },
    { "name": "primary-500", "oklch": { "l": 0.6, "c": 0.2, "h": 250 } },
    { "name": "primary-900", "oklch": { "l": 0.25, "c": 0.15, "h": 250 } }
  ]
}
```

### 2. Create Consistent Scales

Keep hue (h) constant, vary lightness (l) and slightly adjust chroma (c):

- Light shades: High L (0.9+), lower C
- Mid shades: Medium L (0.5-0.7), full C
- Dark shades: Low L (0.2-0.4), slightly lower C

### 3. Use the Color Matcher

Check how your custom colors relate to standard CSS colors for better communication with developers.

### 4. Test Accessibility

The system shows contrast ratios - aim for AA or better for all text colors.

## Export and Share

### Export Current Configuration

```bash
curl http://localhost:3000/api/config/export > my-style-guide.json
```

### Import Configuration

```bash
curl -X POST http://localhost:3000/api/config/import \
  --data-binary @my-style-guide.json
```

## Advanced Usage

### Programmatic Configuration

You can also load configurations programmatically in your code:

```typescript
import { loadConfig } from './config';
import type { StyleGuideConfig } from './types';

const myConfig: Partial<StyleGuideConfig> = {
  title: 'My Design System',
  palettes: [
    // ... your palettes
  ],
};

const config = loadConfig(myConfig);
```

### Generate Color Schemes

Use the built-in color scheme generator:

```typescript
import { generateColorScheme } from './colors';

const baseColor = { l: 0.6, c: 0.2, h: 250 };
const scheme = generateColorScheme(baseColor, 'triadic');
// Returns harmonious color combinations
```

## Troubleshooting

### Colors Look Different Than Expected

- Check your L (lightness) value - this has the biggest impact
- OKLCH is perceptually uniform, so colors may look different than RGB/HEX equivalents
- Use the color converter API to see how colors translate

### Contrast Warnings

- Increase lightness difference between foreground and background
- For text, aim for at least L difference of 0.4 or more
- Use the contrast checker API to test combinations

### Server Not Starting

```bash
# Reinstall dependencies
bun install

# Check for TypeScript errors
bun run --bun tsc --noEmit
```

## Next Steps

1. Customize the default configuration to match your brand
2. Add more color palettes (e.g., accent colors, semantic colors)
3. Adjust typography scales to match your design
4. Configure spacing to align with your grid system
5. Export and share your style guide with your team

## Resources

- [OKLCH Color Space Explained](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Hono Documentation](https://hono.dev)
