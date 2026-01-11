import type { FC } from 'hono/jsx';
import type { StyleGuideConfig } from '../types';

export const Layout: FC<{ config: StyleGuideConfig; children: any }> = ({ config, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{config.title}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div class="container">
          <header class="header">
            <h1>{config.title}</h1>
            {config.description && <p class="lead">{config.description}</p>}
          </header>

          <nav class="nav">
            <a href="#colors">Colors</a>
            <a href="#typography">Typography</a>
            <a href="#spacing">Spacing</a>
            <a href="#accessibility">Accessibility</a>
          </nav>

          <main>{children}</main>

          <footer class="footer">
            <p>Generated with Style Guide Builder • Built with OKLCH color space</p>
          </footer>
        </div>
      </body>
    </html>
  );
};
