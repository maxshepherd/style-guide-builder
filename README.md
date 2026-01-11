# Style Guide Builder

A modern, configurable style guide builder using OKLCH color space for mathematically precise and perceptually uniform color management.

## Features

- 🎨 **OKLCH Color Space**: Perceptually uniform colors with mathematical precision
- 🎯 **Interactive Color Picker**: Visual color wheel and sliders to generate palettes
- 🎨 **Large Minimal Color Cards**: Beautiful presentation with color values and nearest CSS matches
- ♿ **Accessibility Built-in**: WCAG contrast checking and validation
- 📝 **Typography Showcase**: Complete H1-H6, paragraphs, and lists
- ⚙️ **Fully Configurable**: JSON-based configuration with sensible defaults
- 🔒 **UI Guardrails**: Validation warnings for accessibility and best practices
- 🚀 **Fast & Modern**: Built with Hono and Bun for blazing performance

## Quick Start

### Installation

```sh
bun install
```

### Run the Server

```sh
bun run dev
```

Visit `http://localhost:3000` to see your style guide!

## How to Use

### 1. Generate Colors with Interactive Picker

The easiest way to create your color palette is using the interactive color picker at the top of the page:

1. **Open your browser** to `http://localhost:3000`
2. **Pick your brand color** using:
   - The color wheel for quick selection
   - Hex input for precise colors
   - OKLCH sliders for fine-tuning (Lightness, Chroma, Hue)
3. **Click "✨ Generate Palette"** and the system will automatically create:
   - Primary palette (based on your color)
   - Neutral palette (grays with a hint of your color)
   - Success palette (green)
   - Warning palette (amber/orange)
   - Error palette (red)

Each palette includes 10 shades (50-900) optimized for accessibility!

### 2. Customize via Configuration File

For more control, edit the configuration directly:

**Option A: Modify Default Config**

- Edit `src/config.ts` and change the `defaultConfig` object
- Save and the browser will hot-reload automatically

**Option B: Use API to Update Config**

```bash
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d @example-config.json
```

**Option C: Create Your Own Config**

- Copy `example-config.json` to `my-config.json`
- Edit with your brand colors
- Import via API

### 3. Export Your Configuration

Once you're hpalette/generate` - Generate complete palette from base color

- `POST /api/color/convert` - Convert between color formats
- `POST /api/color/contrast` - Check WCAG contrast
- `POST /api/color/match` - Find nearest CSS color
- `GET /api/colors/css` - Get all CSS named colors

#### Examples

**Convert HEX to OKLCH:**

```bash
curl -X POST http://localhost:3000/api/color/convert \
  -H "Content-Type: application/json" \
  -d '{"from": "hex", "value": "#667eea"}'
```

**Check Contrast:**

```bash
curl -X POST http://localhost:3000/api/color/contrast \
  -H "Content-Type: application/json" \
  -d '{
    "foreground": {"r": 0, "g": 0, "b": 0},
    "background": {"r": 255, "g": 255, "b": 255}
  }'
```

**Find Nearest CSS Color:**

````bash
curl -X POST http://localhost:3000/api/color/match \
  -H "Content-Type: application/json" \
  -d '{"color": {"l": 0.6, "c": 0.2, "h": 250}}'
```style-guide.json
````

### 4. Reset to Defaults

Need to start over?

```bash
curl -X POST http://localhost:3000/api/config/reset
```

## Configuration

Create or modify your style guide by updating the configuration. The system uses OKLCH color space where:

- **L (Lightness)**: 0-1 (0 = black, 1 = white)
- **C (Chroma)**: 0-0.4 (saturation/intensity)
- **H (Hue)**: 0-360 (color wheel degrees)

### Example Configuration

```json
{
  "title": "My Design System",
  "description": "Beautiful, accessible design system",
  "palettes": [
    {
      "name": "Brand",
      "colors": [
        {
          "name": "brand-primary",
          "oklch": { "l": 0.6, "c": 0.2, "h": 250 },
          "description": "Primary brand color",
          "usage": "Buttons, links, key UI elements"
        }
      ]
    }
  ]
}
```

## API Endpoints

### Configuration Management

- `GET /` - View style guide
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration
- `POST /api/config/reset` - Reset to defaults
- `Understanding OKLCH Colors

OKLCH color values use three parameters:

- **L (Lightness)**: 0-1 (0 = black, 0.5 = medium, 1 = white)
- **C (Chroma)**: 0-0.4 (0 = gray, higher = more saturated)
  - Subtle colors: 0.05-0.1
  - Normal colors: 0.15-0.25
  - Vivid colors: 0.25+
- **H (Hue)**: 0-360 (color wheel degrees)
  - Red: 25°, Orange: 60°, Yellow: 90°
  - Green: 140°, Cyan: 190°, Blue: 250°
  - Purple: 300°, Magenta: 330°

See `OKLCH-REFERENCE.md` for more common color values.

## Tips for Success

1. **Start Simple**: Use the interactive color picker to generate your first palette
2. **Check Accessibility**: Look for the contrast badges on each color card (aim for AA or AAA)
3. **Use Semantic Colors**: The generator creates success/warning/error colors automatically
4. **Export Often**: Save your configuration regularly as you refine it
5. **Fine-tune with Sliders**: Use the OKLCH sliders for precise color adjustments

## Troubleshooting

### Server Won't Start

```bash
bun install
bun run dev
```

### Colors Look Wrong

- Check L value is in 0-1 range
- Verify C value (usually 0-0.3 for normal colors)
- Ensure H is between 0-360

### Contrast Issues

- Increase lightness difference between text and background
- Aim for L difference of 0.4 or more
- Use the contrast checker API to verify

## Project Structure

```
src/
  ├── index.tsx        # Main app and API routes
  ├── types.ts         # TypeScript type definitions
  ├── config.ts        # Configuration management
  ├── colors.ts        # OKLCH color utilities
  ├── styles.ts        # CSS generation
  └── components/      # TSX components
      ├── StyleGuidePage.tsx
      ├── ColorPicker.tsx
      ├── ColorsSection.tsx
      ├── TypographySection.tsx
      ├── SpacingSection.tsx
      └── AccessibilitySection.tsx
```

## Additional Documentation

- `USAGE.md` - Detailed usage guide and examples
- `OKLCH-REFERENCE.md` - Color value reference and common colors

OKLCH is a perceptually uniform color space that:

- Ensures consistent visual differences between colors
- Makes mathematical color manipulation predictable
- Provides better interpolation than RGB or HSL
- Respects human color perception
- Enables precise color matching and contrast calculations

## Accessibility Features

- WCAG 2.1 AA and AAA contrast checking
- Automatic text color selection for optimal readability
- Contrast ratio badges on every color
- Validation warnings for accessibility issues
- Minimum font size recommendations
- Line length guidelines
