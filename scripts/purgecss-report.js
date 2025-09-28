// PurgeCSS report script - dry run (ES module)
// Usage: node scripts/purgecss-report.js
import { PurgeCSS } from 'purgecss';

(async () => {
  try {
    const contentGlobs = [
      'src/**/*.jsx',
      'src/**/*.js',
      'index.html',
      'public/**/*.svg'
    ];

    const cssGlobs = ['src/styles/**/*.css'];

    console.log('Running PurgeCSS (dry-run)');
    console.log('Content globs:', contentGlobs);
    console.log('CSS globs:', cssGlobs);

    const purgeCSSResults = await new PurgeCSS().purge({
      content: contentGlobs,
      css: cssGlobs,
      // conservative safelist to keep dynamic/bootstrap classes
      safelist: {
        standard: [
          // bootstrap / utility patterns
          /^bi/, /^btn/, /^col-/, /^row$/, /^card$/, /^badge$/, /^dropdown-/, /^nav-/, /^collapse/, /^show$/, /^active$/, /^is-/, /^position-/, /^d-/, /^me-/, /^ms-/, /^px-/, /^py-/, /^top-/, /^start-/, /^end-/, /^translate-/, /^rounded-/, /^glass-card$/, /^card-entry$/
        ],
        deep: [/^bi/, /^btn/, /^col-/, /^product-/, /^wishlist-/, /^cart-/, /^hero-/, /^demo-/, /^floating-/, /^fly-to-cart/],
        greedy: [/^col-/, /^row/, /^d-/, /^me-/, /^ms-/]
      },
      // ask PurgeCSS to list rejected selectors
      rejected: true
    });

    // purgeCSSResults is an array with one entry per css file processed
    let totalRejected = 0;
    for (const res of purgeCSSResults) {
      const file = res.file || res.filePath || '(unknown)';
      const rejected = res.rejected || [];
      totalRejected += rejected.length;
      console.log('\n---');
      console.log('CSS file:', file);
      console.log('Kept length (chars):', res.css ? res.css.length : 'n/a');
      console.log('Rejected selectors count:', rejected.length);
      if (rejected.length) {
        // show a compact list (limit to first 200 entries)
        const listShow = rejected.slice(0, 200);
        console.log('Sample rejected selectors (first 200):');
        for (const s of listShow) console.log('  ', s);
        if (rejected.length > 200) console.log('  ...and', rejected.length - 200, 'more');
      }
    }

    console.log('\nPurgeCSS dry-run complete. Total rejected selectors:', totalRejected);
    console.log('Notes: This script uses a conservative safelist (regex patterns) to avoid removing dynamic or Bootstrap classes.');
    console.log('Review the output above to decide which selectors to remove.');
  } catch (err) {
    console.error('Error running PurgeCSS:', err);
    return;
  }
})();
