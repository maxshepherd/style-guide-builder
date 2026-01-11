import type { StyleGuideConfig } from './types';

/**
 * Generate CSS from configuration
 */
export function generateCSS(config: StyleGuideConfig): string {
  return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Typography */
  --font-heading: ${config.typography.fontFamily.heading};
  --font-body: ${config.typography.fontFamily.body};
  --font-mono: ${config.typography.fontFamily.mono};
  
  /* Spacing */
  ${Object.entries(config.spacing)
    .map(([key, value]) => `--space-${key}: ${value};`)
    .join('\n  ')}
}

body {
  font-family: var(--font-body);
  font-size: ${config.typography.scale.body};
  line-height: ${config.typography.lineHeight.normal};
  color: #1a1a1a;
  background: #fafafa;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl);
}

.header {
  margin-bottom: var(--space-3xl);
  text-align: center;
}

.header h1 {
  font-size: ${config.typography.scale.h1};
  font-weight: ${config.typography.fontWeight.bold};
  margin-bottom: var(--space-md);
  color: #000;
}

.lead {
  font-size: 1.25rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.nav {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  margin-bottom: var(--space-3xl);
  padding: var(--space-md);
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.nav a {
  color: #333;
  text-decoration: none;
  font-weight: ${config.typography.fontWeight.medium};
  padding: var(--space-sm) var(--space-md);
  border-radius: 6px;
  transition: all 0.2s;
}

.nav a:hover {
  background: #f0f0f0;
  color: #000;
}

.section {
  margin-bottom: var(--space-4xl);
}

.section-title {
  font-size: ${config.typography.scale.h2};
  font-weight: ${config.typography.fontWeight.bold};
  margin-bottom: var(--space-xl);
  color: #000;
  border-bottom: 3px solid #000;
  padding-bottom: var(--space-md);
}

.palette {
  margin-bottom: var(--space-3xl);
}

.palette-name {
  font-size: ${config.typography.scale.h3};
  font-weight: ${config.typography.fontWeight.semibold};
  margin-bottom: var(--space-lg);
  color: #222;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.color-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08);
}

.color-swatch {
  height: 200px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-lg);
}

.color-name {
  font-size: ${config.typography.scale.h4};
  font-weight: ${config.typography.fontWeight.bold};
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.color-values {
  font-family: var(--font-mono);
  font-size: ${config.typography.scale.small};
  opacity: 0.9;
}

.color-value {
  margin: 2px 0;
}

.color-info {
  padding: var(--space-lg);
}

.color-description {
  color: #666;
  margin-bottom: var(--space-sm);
  font-size: 0.95rem;
}

.color-usage {
  color: #888;
  font-size: ${config.typography.scale.small};
  font-style: italic;
}

.color-match {
  margin-top: var(--space-md);
  padding: var(--space-sm);
  background: #f8f8f8;
  border-radius: 6px;
  font-size: ${config.typography.scale.small};
}

.contrast-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: ${config.typography.fontWeight.semibold};
  margin-left: var(--space-sm);
}

.contrast-aaa {
  background: #22c55e;
  color: white;
}

.contrast-aa {
  background: #eab308;
  color: #000;
}

.contrast-fail {
  background: #ef4444;
  color: white;
}

.typography-showcase {
  background: white;
  padding: var(--space-2xl);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.typography-showcase h1 {
  font-size: ${config.typography.scale.h1};
  font-weight: ${config.typography.fontWeight.bold};
  margin-bottom: var(--space-md);
  line-height: ${config.typography.lineHeight.tight};
}

.typography-showcase h2 {
  font-size: ${config.typography.scale.h2};
  font-weight: ${config.typography.fontWeight.bold};
  margin-bottom: var(--space-md);
  line-height: ${config.typography.lineHeight.tight};
}

.typography-showcase h3 {
  font-size: ${config.typography.scale.h3};
  font-weight: ${config.typography.fontWeight.semibold};
  margin-bottom: var(--space-md);
  line-height: ${config.typography.lineHeight.normal};
}

.typography-showcase h4 {
  font-size: ${config.typography.scale.h4};
  font-weight: ${config.typography.fontWeight.semibold};
  margin-bottom: var(--space-md);
  line-height: ${config.typography.lineHeight.normal};
}

.typography-showcase h5 {
  font-size: ${config.typography.scale.h5};
  font-weight: ${config.typography.fontWeight.medium};
  margin-bottom: var(--space-sm);
  line-height: ${config.typography.lineHeight.normal};
}

.typography-showcase h6 {
  font-size: ${config.typography.scale.h6};
  font-weight: ${config.typography.fontWeight.medium};
  margin-bottom: var(--space-sm);
  line-height: ${config.typography.lineHeight.normal};
}

.typography-showcase p {
  margin-bottom: var(--space-md);
  line-height: ${config.typography.lineHeight.relaxed};
}

.typography-showcase ul,
.typography-showcase ol {
  margin-bottom: var(--space-md);
  padding-left: var(--space-xl);
  line-height: ${config.typography.lineHeight.relaxed};
}

.typography-showcase li {
  margin-bottom: var(--space-sm);
}

.type-specimen {
  display: flex;
  align-items: baseline;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid #e5e5e5;
}

.type-label {
  font-family: var(--font-mono);
  font-size: ${config.typography.scale.small};
  color: #888;
  min-width: 60px;
}

.type-example {
  flex: 1;
}

.spacing-grid {
  display: grid;
  gap: var(--space-xl);
}

.spacing-item {
  background: white;
  padding: var(--space-lg);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.spacing-label {
  font-family: var(--font-mono);
  font-weight: ${config.typography.fontWeight.semibold};
  margin-bottom: var(--space-sm);
  color: #333;
}

.spacing-visual {
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  margin-top: var(--space-sm);
}

.footer {
  margin-top: var(--space-4xl);
  padding-top: var(--space-xl);
  border-top: 1px solid #ddd;
  text-align: center;
  color: #888;
  font-size: ${config.typography.scale.small};
}

.accessibility-grid {
  display: grid;
  gap: var(--space-lg);
}

.a11y-card {
  background: white;
  padding: var(--space-xl);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.a11y-card h3 {
  font-size: ${config.typography.scale.h4};
  margin-bottom: var(--space-md);
  color: #000;
}

.a11y-rule {
  padding: var(--space-md);
  background: #f8f8f8;
  border-radius: 6px;
  margin-bottom: var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .container {
    padding: var(--space-lg);
  }

  .header h1 {
    font-size: ${config.typography.scale.h2};
  }

  .color-grid {
    grid-template-columns: 1fr;
  }
}
`;
}
