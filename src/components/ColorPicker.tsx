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
        {/* OKLCH Color Wheel Visualization */}
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 12px; color: #333;">OKLCH Color Wheel</label>
          <div style="position: relative; width: 240px; height: 240px; margin: 0 auto;">
            <canvas
              id="oklch-wheel"
              width="240"
              height="240"
              style="border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
            ></canvas>
            <div
              id="color-indicator"
              style="position: absolute; width: 20px; height: 20px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); pointer-events: none; transition: all 0.1s ease;"
            ></div>
          </div>
          <div style="text-align: center; margin-top: 12px;">
            <div style="font-size: 14px; color: #666; margin-bottom: 4px;">Hex</div>
            <input
              type="text"
              id="color-hex"
              value={hexValue}
              style="width: 120px; padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: monospace; font-size: 14px; text-align: center;"
              placeholder="#000000"
            />
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
                {baseColor.c.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              id="chroma-slider"
              min="0"
              max="0.5"
              step="0.001"
              value={baseColor.c}
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

      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function() {
          const colorHex = document.getElementById('color-hex');
          const lightnessSlider = document.getElementById('lightness-slider');
          const chromaSlider = document.getElementById('chroma-slider');
          const hueSlider = document.getElementById('hue-slider');
          const lightnessValue = document.getElementById('lightness-value');
          const chromaValue = document.getElementById('chroma-value');
          const hueValue = document.getElementById('hue-value');
          const generateBtn = document.getElementById('generate-palette-btn');
          const status = document.getElementById('generation-status');
          const canvas = document.getElementById('oklch-wheel');
          const ctx = canvas.getContext('2d');
          const colorIndicator = document.getElementById('color-indicator');

          let currentOKLCH = ${JSON.stringify(baseColor)};

          // Draw OKLCH Color Wheel
          function drawColorWheel() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = canvas.width / 2 - 20;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw the color wheel with current lightness and chroma
            for (let angle = 0; angle < 360; angle += 0.5) {
              const startAngle = (angle - 0.25) * Math.PI / 180;
              const endAngle = (angle + 0.25) * Math.PI / 180;
              
              // Create gradient from center to edge for chroma
              const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
              
              // Center is gray (low chroma)
              const centerColor = oklchToRgbString({ l: currentOKLCH.l, c: 0, h: angle });
              const edgeColor = oklchToRgbString({ l: currentOKLCH.l, c: currentOKLCH.c, h: angle });
              
              gradient.addColorStop(0, centerColor);
              gradient.addColorStop(1, edgeColor);
              
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.arc(centerX, centerY, radius, startAngle, endAngle);
              ctx.closePath();
              ctx.fillStyle = gradient;
              ctx.fill();
            }
            
            // Update color indicator position
            updateColorIndicator();
          }
          
          // Update color indicator position on wheel
          function updateColorIndicator() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = (canvas.width / 2 - 20) * (currentOKLCH.c / 0.5); // Scale by max chroma
            
            // Convert hue to canvas angle (hue 0° = right, canvas uses standard math angles)
            const angle = currentOKLCH.h * Math.PI / 180;
            const x = centerX + radius * Math.cos(angle) - 10; // -10 for half indicator width
            const y = centerY + radius * Math.sin(angle) - 10;
            
            colorIndicator.style.left = x + 'px';
            colorIndicator.style.top = y + 'px';
            colorIndicator.style.background = oklchToHex(currentOKLCH);
          }
          
          // Convert OKLCH to RGB string for canvas
          function oklchToRgbString(oklch) {
            const l = oklch.l;
            const c = oklch.c;
            const h = oklch.h;
            
            const hRad = (h * Math.PI) / 180;
            const a = c * Math.cos(hRad);
            const b = c * Math.sin(hRad);

            const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
            const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
            const s_ = l - 0.0894841775 * a - 1.291485548 * b;

            const l3 = l_ * l_ * l_;
            const m3 = m_ * m_ * m_;
            const s3 = s_ * s_ * s_;

            let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
            let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
            let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

            function gammaCorrection(value) {
              if (value <= 0.0031308) return 12.92 * value;
              return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
            }

            r = gammaCorrection(r);
            g = gammaCorrection(g);
            b_ = gammaCorrection(b_);

            const rInt = Math.max(0, Math.min(255, Math.round(r * 255)));
            const gInt = Math.max(0, Math.min(255, Math.round(g * 255)));
            const bInt = Math.max(0, Math.min(255, Math.round(b_ * 255)));

            return 'rgb(' + rInt + ',' + gInt + ',' + bInt + ')';
          }

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
            lightnessValue.textContent = Math.round(currentOKLCH.l * 100) + '%';
            chromaValue.textContent = currentOKLCH.c.toFixed(3);
            hueValue.textContent = Math.round(currentOKLCH.h) + '°';
            drawColorWheel(); // Redraw wheel with new values
          }

          // Color picker change
          colorHex.addEventListener('change', async (e) => {
            const hex = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
              const rgb = hexToRgb(hex);
              if (rgb) {
                const oklch = await rgbToOklch(rgb);
                if (oklch) {
                  currentOKLCH = oklch;
                  lightnessSlider.value = Math.round(oklch.l * 100);
                  chromaSlider.value = oklch.c;
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
            currentOKLCH.c = parseFloat(e.target.value);
            updateDisplays();
          });

          hueSlider.addEventListener('input', (e) => {
            currentOKLCH.h = parseFloat(e.target.value);
            updateDisplays();
          });
          
          // Add click interaction on the color wheel
          canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            const dx = x - centerX;
            const dy = y - centerY;
            
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxRadius = canvas.width / 2 - 20;
            
            if (distance <= maxRadius) {
              // Calculate hue from angle (atan2 gives us standard math angles)
              let angle = Math.atan2(dy, dx) * 180 / Math.PI;
              if (angle < 0) angle += 360;
              
              // Calculate chroma from distance
              const chroma = Math.min(0.5, (distance / maxRadius) * 0.5);
              
              currentOKLCH.h = angle;
              currentOKLCH.c = chroma;
              
              hueSlider.value = Math.round(angle);
              chromaSlider.value = chroma;
              
              updateDisplays();
            }
          });

          // Initial draw
          drawColorWheel();

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
