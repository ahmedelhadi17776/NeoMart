// PurgeCSS export script - writes detailed report and JSON map
// Usage: node scripts/purgecss-export.js
import { PurgeCSS } from 'purgecss';
import fs from 'fs/promises';

const contentGlobs = [
  'src/**/*.jsx',
  'src/**/*.js',
  'index.html',
  'public/**/*.svg'
];

const cssGlobs = ['src/styles/**/*.css'];

// Wider safelist to avoid removing headings, bootstrap components and common dynamic classes
const safelist = {
  standard: [
    /^bi/, /^btn/, /^col-/, /^row$/, /^card$/, /^badge$/, /^dropdown-/, /^nav-/, /^collapse/, /^show$/, /^active$/, /^is-/, /^position-/, /^d-/, /^me-/, /^ms-/, /^px-/, /^py-/, /^top-/, /^start-/, /^end-/, /^translate-/, /^rounded-/, /^glass-card$/, /^card-entry$/, /^h[1-6]$/
  ],
  deep: [/^bi/, /^btn/, /^col-/, /^product-/, /^wishlist-/, /^cart-/, /^hero-/, /^demo-/, /^floating-/, /^fly-to-cart/, /^modal-/, /^tooltip-/, /^popover-/, /^offcanvas-/, /^alert-/, /^progress-/, /^list-group-/, /^page-/, /^pagination-/, /^table/],
  greedy: [/^col-/, /^row/, /^d-/, /^me-/, /^ms-/, /^page-/, /^table/]
};

function extractSelectors(cssText) {
  const selectors = new Set();
  // crude but effective: match up to the first { for each rule
  const regex = /([^{]+)\{/gm;
  let m;
  while ((m = regex.exec(cssText)) !== null) {
    const group = m[1].trim();
    // split group by commas to individual selectors
    group.split(',').forEach(s => {
      const sel = s.trim();
      if (sel) selectors.add(sel);
    });
  }
  return Array.from(selectors);
}

(async () => {
  try {
    const results = await new PurgeCSS().purge({ content: contentGlobs, css: cssGlobs, safelist, rejected: true });

    const reportLines = [];
    const selectorMap = {};

    let totalRejected = 0;
    for (const res of results) {
      const file = res.file || res.filePath || '(unknown)';
      const css = res.originalCss || res.css || '';
      const rejected = res.rejected || [];
      const selectors = extractSelectors(css);

      selectorMap[file] = {
        keptLength: css.length,
        rejectedCount: rejected.length,
        rejectedSelectors: rejected,
        allSelectors: selectors
      };

      totalRejected += rejected.length;

      reportLines.push('---');
      reportLines.push(`CSS file: ${file}`);
      reportLines.push(`Kept length (chars): ${css.length}`);
      reportLines.push(`Rejected selectors count: ${rejected.length}`);
      if (rejected.length) {
        reportLines.push('Sample rejected selectors (first 200):');
        reportLines.push(...rejected.slice(0, 200));
      }
      reportLines.push('');
    }

    reportLines.push('PurgeCSS dry-run complete. Total rejected selectors: ' + totalRejected);
    reportLines.push('Notes: This run used a conservative safelist to avoid removing dynamic or Bootstrap classes.');

    // write text report and JSON map
    await fs.writeFile('scripts/purge-report-output.txt', reportLines.join('\n'), 'utf8');
    await fs.writeFile('scripts/purge-selector-map.json', JSON.stringify(selectorMap, null, 2), 'utf8');

    console.log('Wrote scripts/purge-report-output.txt and scripts/purge-selector-map.json');
  } catch (err) {
    console.error('Error running PurgeCSS export:', err);
    return;
  }
})();
