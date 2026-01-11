/** @jsxImportSource hono/jsx */
import type { OKLCHColor } from '../types';
import { oklchToHex } from '../colors';

interface ColorPickerProps {
  baseColor: OKLCHColor;
}

/**
 * Interactive color picker for selecting base color
 */
export function ColorPicker({ baseColor }: ColorPickerProps) {
  const hexValue = oklchToHex(baseColor);

  return (
    <div
      class="color-picker-section"
      style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 32px;"
    >
      <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 16px; color: #1a1a1a;">🎨 Color Generator</h2>
      <p style="color: #666; margin-bottom: 24px;">
        Pick a base color to generate a complete palette with harmonious shades
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        {/* Color Wheel Input */}
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 12px; color: #333;">Base Color</label>
          <div style="display: flex; align-items: center; gap: 16px;">
            <input
              type="color"
              id="color-picker"
              value={hexValue}
              style="width: 80px; height: 80px; border: 3px solid #e0e0e0; border-radius: 8px; cursor: pointer;"
            />
            <div>
              <div style="font-size: 14px; color: #666; margin-bottom: 4px;">Hex</div>
              <input
                type="text"
                id="color-hex"
                value={hexValue}
                style="width: 120px; padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: monospace; font-size: 14px;"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* OKLCH Sliders */}
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 12px; color: #333;">Fine Tune (OKLCH)</label>

          {/* Lightness Slider */}
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 12px; color: #666;">Lightness</span>
              <span id="lightness-value" style="font-size: 12px; font-weight: 600; color: #333;">
                {Math.round(baseColor.l * 100)}%
              </span>
            </div>
            <input
              type="range"
              id="lightness-slider"
              min="0"
              max="100"
              value={Math.round(baseColor.l * 100)}
              style="width: 100%; height: 6px; border-radius: 3px; background: linear-gradient(to right, #000, #fff);"
            />
          </div>

          {/* Chroma Slider */}
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 12px; color: #666;">Chroma (Saturation)</span>
              <span id="chroma-value" style="font-size: 12px; font-weight: 600; color: #333;">
                {Math.round(baseColor.c * 100)}%
              </span>
            </div>
            <input
              type="range"
              id="chroma-slider"
              min="0"
              max="40"
              value={Math.round(baseColor.c * 100)}
              style="width: 100%; height: 6px; border-radius: 3px;"
            />
          </div>

          {/* Hue Slider */}
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 12px; color: #666;">Hue</span>
              <span id="hue-value" style="font-size: 12px; font-weight: 600; color: #333;">
                {Math.round(baseColor.h)}°
              </span>
            </div>
            <input
              type="range"
              id="hue-slider"
              min="0"
              max="360"
              value={Math.round(baseColor.h)}
              style="width: 100%; height: 6px; border-radius: 3px; background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
        <button
          id="generate-palette-btn"
          style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.2s;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(102, 126, 234, 0.5)';"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)';"
        >
          ✨ Generate Palette
        </button>
        <span id="generation-status" style="margin-left: 16px; color: #666; font-size: 14px;"></span>
      </div>

      {/* Interactive Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function() {
          const colorPicker = document.getElementById('color-picker');
          const colorHex = document.getElementById('color-hex');
          const lightnessSlider = document.getElementById('lightness-slider');
          const chromaSlider = document.getElementById('chroma-slider');
          const hueSlider = document.getElementById('hue-slider');
          const lightnessValue = document.getElementById('lightness-value');
          const chromaValue = document.getElementById('chroma-value');
          const hueValue = document.getElementById('hue-value');
          const generateBtn = document.getElementById('generate-palette-btn');
          const status = document.getElementById('generation-status');

          let currentOKLCH = ${JSON.stringify(baseColor)};

          // Helper: Hex to RGB
          function hexToRgb(hex) {
            const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
          }

          // Helper: RGB to OKLCH (simplified - calls API for accurate conversion)
          async function rgbToOklch(rgb) {
            try {
              const response = await fetch('/api/color/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from: 'rgb', value: rgb })
              });
              const data = await response.json();
              return data.oklch;
            } catch (error) {
              console.error('Conversion error:', error);
              return null;
            }
          }

          // Helper: OKLCH to Hex
          function oklchToHex(oklch) {
            const l = oklch.l;
            const c = oklch.c;
            const h = oklch.h;
            
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

            // Gamma correction
            function gammaCorrection(value) {
              if (value <= 0.0031308) return 12.92 * value;
              return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
            }

            r = gammaCorrection(r);
            g = gammaCorrection(g);
            b_ = gammaCorrection(b_);

            // Clamp and convert to hex
            const toHex = (n) => {
              const val = Math.max(0, Math.min(255, Math.round(n * 255)));
              return val.toString(16).padStart(2, '0');
            };

            return '#' + toHex(r) + toHex(g) + toHex(b_);
          }

          // Update hex display and color picker
          function updateDisplays() {
            const hex = oklchToHex(currentOKLCH);
            colorHex.value = hex;
            colorPicker.value = hex;
            lightnessValue.textContent = Math.round(currentOKLCH.l * 100) + '%';
            chromaValue.textContent = Math.round(currentOKLCH.c * 100) + '%';
            hueValue.textContent = Math.round(currentOKLCH.h) + '°';
          }

          // Color picker change
          colorPicker.addEventListener('input', async (e) => {
            const hex = e.target.value;
            const rgb = hexToRgb(hex);
            if (rgb) {
              const oklch = await rgbToOklch(rgb);
              if (oklch) {
                currentOKLCH = oklch;
                lightnessSlider.value = Math.round(oklch.l * 100);
                chromaSlider.value = Math.round(oklch.c * 100);
                hueSlider.value = Math.round(oklch.h);
                updateDisplays();
              }
            }
          });

          // Hex input change
          colorHex.addEventListener('change', async (e) => {
            const hex = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
              const rgb = hexToRgb(hex);
              if (rgb) {
                const oklch = await rgbToOklch(rgb);
                if (oklch) {
                  currentOKLCH = oklch;
                  lightnessSlider.value = Math.round(oklch.l * 100);
                  chromaSlider.value = Math.round(oklch.c * 100);
                  hueSlider.value = Math.round(oklch.h);
                  updateDisplays();
                }
              }
            }
          });

          // Slider changes
          lightnessSlider.addEventListener('input', (e) => {
            currentOKLCH.l = e.target.value / 100;
            updateDisplays();
          });

          chromaSlider.addEventListener('input', (e) => {
            currentOKLCH.c = e.target.value / 100;
            updateDisplays();
          });

          hueSlider.addEventListener('input', (e) => {
            currentOKLCH.h = parseFloat(e.target.value);
            updateDisplays();
          });

          // Generate palette
          generateBtn.addEventListener('click', async () => {
            status.textContent = 'Generating...';
            generateBtn.disabled = true;

            try {
              const response = await fetch('/api/palette/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ baseColor: currentOKLCH })
              });

              if (response.ok) {
                status.textContent = '✅ Palette generated! Refreshing...';
                setTimeout(() => window.location.reload(), 800);
              } else {
                const error = await response.json();
                status.textContent = '❌ ' + (error.error || 'Generation failed');
                generateBtn.disabled = false;
              }
            } catch (error) {
              status.textContent = '❌ Network error';
              generateBtn.disabled = false;
            }
          });
        })();
      `,
        }}
      />
    </div>
  );
}
