#!/usr/bin/env node
// Takes Google's font host out of the built stylesheet.
//
// The design system's stylesheet opens with an `@import` of Geist from Google's
// font host. An @import inside a stylesheet is the latest a font can be
// discovered: the browser downloads and parses the sheet, then fetches a second
// stylesheet, then the file that one names. Lighthouse measured 751ms of
// render-blocking time on that chain on a phone.
//
// The face is not dropped. index.html declares Geist from two subset files
// served by this origin and preloads the first, so the browser meets it in the
// opening bytes of the document instead. This step removes the duplicate that
// would otherwise be fetched over a third connection.
//
// It runs from `postbuild` rather than PostCSS because react-scripts sets
// `config: false` on its PostCSS loader, so a postcss.config.js plugin is never
// consulted for this project.

const fs = require("fs");
const path = require("path");

const CSS_DIR = path.join(__dirname, "..", "build", "static", "css");

// The rule is matched up to its semicolon and then tested, rather than matched
// in one expression. The minifier writes it as `@import url(...)` unquoted where
// the source has `@import "..."`, and a pattern that pins the quoting silently
// stops matching the day that changes.
const ANY_IMPORT = /@import[^;]*;/g;
const REMOTE_HOST = /fonts\.googleapis\.com/;

if (!fs.existsSync(CSS_DIR)) {
  console.error("no build/static/css to read - run the build first");
  process.exit(1);
}

let removed = 0;
for (const name of fs.readdirSync(CSS_DIR)) {
  if (!name.endsWith(".css")) continue;
  const file = path.join(CSS_DIR, name);
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(ANY_IMPORT, (rule) => (REMOTE_HOST.test(rule) ? "" : rule));
  if (after === before) continue;
  fs.writeFileSync(file, after);
  removed += 1;
  console.log(`dropped the remote font import from ${name}`);
}

// A build whose stylesheet never carried the rule is the expected state once the
// design system stops shipping it, so finding nothing is not a failure.
if (removed === 0) console.log("no remote font import in the built stylesheets");
