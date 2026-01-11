import type { FC } from 'hono/jsx';
import type { StyleGuideConfig } from '../types';

export const TypographySection: FC<{ config: StyleGuideConfig }> = ({ config }) => {
  return (
    <section id="typography" class="section">
      <h2 class="section-title">Typography</h2>

      <div class="typography-showcase">
        <div class="type-specimen">
          <span class="type-label">H1</span>
          <h1 class="type-example">The quick brown fox jumps over the lazy dog</h1>
        </div>

        <div class="type-specimen">
          <span class="type-label">H2</span>
          <h2 class="type-example">The quick brown fox jumps over the lazy dog</h2>
        </div>

        <div class="type-specimen">
          <span class="type-label">H3</span>
          <h3 class="type-example">The quick brown fox jumps over the lazy dog</h3>
        </div>

        <div class="type-specimen">
          <span class="type-label">H4</span>
          <h4 class="type-example">The quick brown fox jumps over the lazy dog</h4>
        </div>

        <div class="type-specimen">
          <span class="type-label">H5</span>
          <h5 class="type-example">The quick brown fox jumps over the lazy dog</h5>
        </div>

        <div class="type-specimen">
          <span class="type-label">H6</span>
          <h6 class="type-example">The quick brown fox jumps over the lazy dog</h6>
        </div>

        <div class="type-specimen">
          <span class="type-label">Body</span>
          <div class="type-example">
            <p>
              Typography is the art and technique of arranging type to make written language legible, readable and
              appealing. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing,
              and letter-spacing.
            </p>
            <p>
              Good typography establishes a visual hierarchy, making content easier to scan and understand. It guides
              the reader's eye through the content in a logical order.
            </p>
          </div>
        </div>

        <div class="type-specimen">
          <span class="type-label">Lists</span>
          <div class="type-example">
            <ul>
              <li>Unordered list item one with sufficient text to wrap</li>
              <li>Unordered list item two</li>
              <li>Unordered list item three</li>
            </ul>
            <ol>
              <li>Ordered list item one with sufficient text to wrap</li>
              <li>Ordered list item two</li>
              <li>Ordered list item three</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
