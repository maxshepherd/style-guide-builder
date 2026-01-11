1. Classical Harmony Schemes
   One simple way is to use classical harmony schemes based on fixed angular relationships on a colour wheel. You can generate these by taking a single "seed" or primary colour and finding relative key colours at specific degree intervals. Common schemes include:
   • Complementary: Choosing two colours positioned opposite each other (180° apart).
   • Analogous: Using colours adjacent to each other, typically 30° and 330° from the base hue.
   • Triadic: Combining three colours spaced equally at 120° and 240° from the primary hue.
   • Tetradic: Selecting four colours in two complementary pairs, often spaced at 60°, 180°, and 240° from the base.
2. Perceptual Weighting in OKLCH
   A second method focuses on creating visually consistent palettes where every colour appears to have the same "importance" or visual weight. This is best achieved using the OKLCH colour space because its "Lightness" (L) values correspond to how bright a colour actually looks to the human eye, unlike older systems like HSL. To use this algorithm:
   • Set a constant Lightness (L) and constant Chroma (C) value.
   • Vary only the Hue (H) angle to pick your different colours.
   • This ensures that whether you pick a blue, green, or red, they will all feel balanced and harmonious rather than one colour dominating the others.
3. Functional Scale Generation
   For complex design systems, you can use mathematical functions to generate an extensive scale of shades and tints from a single hue. This uses "magic numbers" or scale steps (typically 0–100) as inputs for formulas:
   • Lightness Function: Calculate the lightness of a shade using a formula like L(n)=1−n, where n is a normalized scale value from 0 to 1.
   • Chroma/Saturation Function: Use an "upside-down parabola" formula to ensure that saturation peaks at the midpoint of the scale and tapers off at the extreme light and dark ends.
   • Hue Shifting: Adjust the hue slightly as lightness decreases (the Bezold–Brücke effect) to prevent colours from looking "muddy" in shadows or "washed out" in highlights.
   Analogy: Creating a palette with OKLCH is like adjusting the volume on a high-end stereo; instead of guessing how loud each instrument should be, the system ensures they all play in perfect perceptual harmony, regardless of the song's pitch.
