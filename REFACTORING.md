# Splitting the original Windows Web desktop

The existing `index.html` is the canonical working version. To split it while preserving its original design and behavior, check out a copy of the repository and run:

```sh
node scripts/split-index.mjs
```

The script copies the existing inline CSS and JavaScript unchanged to `css/windows.css` and `js/app.js`, updates `index.html` to load those files with relative paths, and saves the untouched original page as `index.original.html`. It does not replace the original app with a simplified reimplementation.

Then test the page through a local static server (ES modules are not needed by this split), verify the desktop/apps and custom domain, and commit the generated files. Keep `CNAME` in the repository root. GitHub Pages can serve the resulting HTML, CSS, and JavaScript directly.
