# OKLCH Quick Reference

## Common Color Values

### Primary/Brand Colors

```json
// Vibrant Blue
{ "l": 0.6, "c": 0.22, "h": 250 }

// Deep Purple
{ "l": 0.5, "c": 0.2, "h": 290 }

// Bright Teal
{ "l": 0.65, "c": 0.18, "h": 200 }

// Coral/Pink
{ "l": 0.7, "c": 0.18, "h": 15 }
```

### Neutrals (Gray Scale)

```json
// Pure White
{ "l": 1, "c": 0, "h": 0 }

// Off-White
{ "l": 0.98, "c": 0.005, "h": 250 }

// Light Gray
{ "l": 0.85, "c": 0.01, "h": 250 }

// Medium Gray
{ "l": 0.6, "c": 0.01, "h": 250 }

// Dark Gray
{ "l": 0.3, "c": 0.015, "h": 250 }

// Near Black
{ "l": 0.2, "c": 0.02, "h": 250 }

// Pure Black
{ "l": 0, "c": 0, "h": 0 }
```

### Semantic Colors

```json
// Success/Green
{ "l": 0.65, "c": 0.18, "h": 145 }

// Warning/Yellow
{ "l": 0.75, "c": 0.15, "h": 85 }

// Error/Red
{ "l": 0.6, "c": 0.22, "h": 25 }

// Info/Blue
{ "l": 0.65, "c": 0.18, "h": 230 }
```

## Hue Reference (H value)

```
0°   - Red
15°  - Red-Orange / Coral
30°  - Orange
60°  - Yellow-Orange
85°  - Yellow
120° - Yellow-Green / Lime
145° - Green
180° - Cyan / Turquoise
200° - Teal
230° - Sky Blue
250° - Blue
260° - Indigo
290° - Purple
320° - Magenta
340° - Pink
360° - Red (full circle)
```

## Lightness Reference (L value)

```
1.0  - White
0.95 - Very Light (backgrounds)
0.85 - Light (subtle accents)
0.7  - Medium-Light
0.6  - Medium (good for primary colors)
0.5  - Medium (balanced)
0.4  - Medium-Dark (emphasis)
0.3  - Dark (text on light backgrounds)
0.2  - Very Dark
0.0  - Black
```

## Chroma Reference (C value)

```
0.0   - Grayscale (no color)
0.01  - Subtle tint
0.05  - Light color
0.1   - Moderate color
0.15  - Noticeable color
0.2   - Vibrant color
0.25+ - Very vibrant (use carefully)
```

## Accessibility Guidelines

### Good Contrast Combinations

**Dark text on light backgrounds:**

- Text: `{ l: 0.2-0.3, c: 0.01-0.02 }`
- Background: `{ l: 0.95-1.0, c: 0-0.01 }`
- Ratio: ~15:1 (AAA)

**Light text on dark backgrounds:**

- Text: `{ l: 0.95-1.0, c: 0-0.01 }`
- Background: `{ l: 0.15-0.25, c: 0.01-0.02 }`
- Ratio: ~14:1 (AAA)

**Colored text (minimum for AA):**

- Difference in L: 0.4+
- Keep chroma moderate (0.1-0.18)

### Tips

1. **For text colors**: Keep chroma low (< 0.05) for better readability
2. **For backgrounds**: Use high lightness (> 0.9) or low lightness (< 0.2)
3. **For accents**: Moderate lightness (0.5-0.7) with higher chroma (0.15-0.25)
4. **For borders**: Similar to background but with slight L difference (0.05-0.1)

## Common Patterns

### Creating a Color Scale

Keep hue constant, vary lightness:

```json
{
  "50": { "l": 0.95, "c": 0.05, "h": 250 },
  "100": { "l": 0.9, "c": 0.08, "h": 250 },
  "200": { "l": 0.8, "c": 0.12, "h": 250 },
  "300": { "l": 0.7, "c": 0.16, "h": 250 },
  "400": { "l": 0.65, "c": 0.19, "h": 250 },
  "500": { "l": 0.6, "c": 0.22, "h": 250 }, // Base
  "600": { "l": 0.52, "c": 0.2, "h": 250 },
  "700": { "l": 0.45, "c": 0.18, "h": 250 },
  "800": { "l": 0.35, "c": 0.15, "h": 250 },
  "900": { "l": 0.25, "c": 0.12, "h": 250 }
}
```

### Complementary Colors

For a base color with h=250:

- Complement: h=70 (250 - 180)

### Analogous Colors

For a base color with h=250:

- Adjacent 1: h=220 (250 - 30)
- Adjacent 2: h=280 (250 + 30)

### Triadic Colors

For a base color with h=250:

- Triadic 1: h=10 (250 + 120)
- Triadic 2: h=130 (250 - 120)

## Converting from HEX

Use the API to convert:

```bash
curl -X POST http://localhost:3000/api/color/convert \
  -H "Content-Type: application/json" \
  -d '{"from": "hex", "value": "#your-color"}'
```

## Popular Brand Colors in OKLCH

```json
// GitHub Black
{ "l": 0.15, "c": 0.01, "h": 250 }

// Twitter Blue (X)
{ "l": 0.55, "c": 0.18, "h": 235 }

// Facebook Blue
{ "l": 0.5, "c": 0.2, "h": 240 }

// Google Blue
{ "l": 0.6, "c": 0.2, "h": 250 }

// Slack Purple
{ "l": 0.45, "c": 0.15, "h": 300 }
```
