#!/usr/bin/env node
// Puts the first screen's photograph in the document, as a preload.
//
// The hero is rendered by React, so its URL is inside the bundle. The browser
// therefore cannot see it until main.js has downloaded, parsed and run, which is
// the whole reason the largest paint lands around 3.7s while the first paint
// lands at 1.6s. A preload link in the head moves that discovery to the opening
// bytes of the document, where it costs nothing to find.
//
// Nothing about the page changes. The link names the same srcset and sizes the
// img already carries, so the browser picks the same file it would have picked
// and simply starts earlier.
//
// The hero is resolved rather than named here. A preload pointing at last
// season's photograph would fetch a file the page never draws and slow down the
// one it does, so this reads the chain the application itself reads:
//
//   the Photo element marked `priority`  ->  its image expression and sizes
//   HERO_IMAGE = PHOTOS.<key>            ->  the photo() call for that key
//   photo(small, large, ...)             ->  the two import identifiers
//   import small from "../assets/..."    ->  the source basenames
//   asset-manifest.json                  ->  the hashed files in the build
//
// Any break in that chain exits non-zero instead of guessing.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const CONTENT = path.join(ROOT, "src", "content", "campContent.js");
const SECTIONS = path.join(ROOT, "src", "components", "marketing", "sections");

const fail = (why) => {
  console.error(`hero preload: ${why}`);
  process.exit(1);
};

// The one Photo the project marks `priority`, and the sizes it renders at. Both
// have to come from the same element: a preload whose sizes disagree with the
// img's is a second, unused download rather than a head start.
function priorityPhoto() {
  for (const name of fs.readdirSync(SECTIONS)) {
    const text = fs.readFileSync(path.join(SECTIONS, name), "utf8");
    for (const element of text.match(/<Photo\b[\s\S]*?\/>/g) || []) {
      if (!/\bpriority\b(?!\s*=\s*\{)/.test(element)) continue;
      const image = element.match(/image=\{([A-Za-z0-9_.]+)\}/);
      const sizes = element.match(/sizes="([^"]+)"/);
      if (!image || !sizes) fail(`the priority Photo in ${name} has no image or no sizes`);
      return { image: image[1], sizes: sizes[1], where: name };
    }
  }
  return null;
}

// HERO_IMAGE -> PHOTOS.<key> -> photo(small, large, largeWidth, ...) -> the two
// webp import identifiers and the width the large one is offered at.
function sourcesFor(exportName, content) {
  const alias = content.match(new RegExp(`export const ${exportName}\\s*=\\s*PHOTOS\\.(\\w+)`));
  if (!alias) fail(`${exportName} is not an alias of a PHOTOS entry`);
  const call = content.match(new RegExp(`\\b${alias[1]}:\\s*photo\\(([^)]*)\\)`));
  if (!call) fail(`PHOTOS.${alias[1]} is not built by photo()`);
  const args = call[1].split(",").map((s) => s.trim());
  if (args.length < 3) fail(`the photo() call for ${alias[1]} has too few arguments`);
  const [small, large, largeWidth] = args;
  const fileFor = (identifier) => {
    const found = content.match(new RegExp(`import ${identifier} from "([^"]+)"`));
    if (!found) fail(`${identifier} is not imported in campContent.js`);
    return path.basename(found[1]);
  };
  return { small: fileFor(small), large: fileFor(large), largeWidth };
}

// The hashed name the build gave a source file. The manifest keys are the paths
// the bundler emitted, so the basename is matched up to the hash it inserted.
function built(manifest, sourceName) {
  const stem = sourceName.replace(/\.[^.]+$/, "");
  const extension = path.extname(sourceName);
  const pattern = new RegExp(
    `/${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.\\w+${extension.replace(".", "\\.")}$`,
  );
  const hit = Object.values(manifest.files || {}).find((url) => pattern.test(url));
  if (!hit) fail(`${sourceName} is not in the build's asset manifest`);
  return hit;
}

const indexPath = path.join(BUILD, "index.html");
if (!fs.existsSync(indexPath)) fail("no build/index.html to read - run the build first");

const chosen = priorityPhoto();
if (!chosen) {
  // A first screen with no photograph on it is a valid state, not a failure.
  console.log("no Photo is marked priority, so there is no hero to preload");
  process.exit(0);
}

const content = fs.readFileSync(CONTENT, "utf8");
const { small, large, largeWidth } = sourcesFor(chosen.image, content);
const manifest = JSON.parse(fs.readFileSync(path.join(BUILD, "asset-manifest.json"), "utf8"));
const smallUrl = built(manifest, small);
const largeUrl = built(manifest, large);

const link =
  `<link rel="preload" as="image" type="image/webp"` +
  ` href="${smallUrl}"` +
  ` imagesrcset="${smallUrl} 400w, ${largeUrl} ${largeWidth}w"` +
  ` imagesizes="${chosen.sizes}"` +
  ` fetchpriority="high">`;

let html = fs.readFileSync(indexPath, "utf8");
if (html.includes(smallUrl) && html.includes('rel="preload" as="image"')) {
  console.log("the hero preload is already in the document");
  process.exit(0);
}
// Directly after the viewport meta, so the preload scanner reaches it in the
// opening bytes rather than behind every stylesheet and font in the head.
const VIEWPORT = /(<meta name="viewport"[^>]*>)/;
if (VIEWPORT.test(html)) {
  html = html.replace(VIEWPORT, `$1${link}`);
} else if (html.includes("</head>")) {
  html = html.replace("</head>", `${link}</head>`);
} else {
  fail("build/index.html has neither a viewport meta nor a head to write into");
}
fs.writeFileSync(indexPath, html);
console.log(`preloaded the hero from ${chosen.where}: ${path.basename(smallUrl)}`);
