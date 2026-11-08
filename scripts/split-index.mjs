#!/usr/bin/env node
/**
 * Split the existing single-file Windows Web desktop without rewriting its
 * CSS or JavaScript. Run from the repository root with: node scripts/split-index.mjs
 * The original index is backed up as index.original.html before it is changed.
 */
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const indexPath = resolve(root, "index.html");
const cssPath = resolve(root, "css/windows.css");
const jsPath = resolve(root, "js/app.js");
const backupPath = resolve(root, "index.original.html");

let html = await readFile(indexPath, "utf8");
if (html.includes("./css/windows.css") && html.includes("./js/app.js")) {
  console.log("index.html already references the split assets; nothing to do.");
  process.exit(0);
}

const styleMatch = html.match(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/i);
if (!styleMatch) throw new Error("Could not find the original inline <style> block.");

// The original application has a single inline script at the end of the body.
const scriptMatches = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
const inlineScript = scriptMatches.find((match) => !/\bsrc\s*=/i.test(match[1]));
if (!inlineScript) throw new Error("Could not find the original inline application script.");

const css = styleMatch[1].replace(/^\s*\n/, "").replace(/\n\s*$/, "\n");
const js = inlineScript[2].replace(/^\s*\n/, "").replace(/\n\s*$/, "\n");

const styleTag = styleMatch[0];
const scriptTag = inlineScript[0];
html = html.replace(styleTag, '    <link rel="stylesheet" href="./css/windows.css">');
html = html.replace(scriptTag, '    <script src="./js/app.js" defer></script>');

await mkdir(dirname(cssPath), { recursive: true });
await mkdir(dirname(jsPath), { recursive: true });
await copyFile(indexPath, backupPath);
await writeFile(cssPath, css, "utf8");
await writeFile(jsPath, js, "utf8");
await writeFile(indexPath, html, "utf8");

console.log("Split complete. The original CSS and JavaScript were copied verbatim.");
console.log("Created css/windows.css and js/app.js; saved index.original.html as a backup.");
console.log("Keep CNAME at the repository root for the custom domain.");
