#!/usr/bin/env node
// Starts the chunk every route needs at the same time as the bundle that asks
// for it.
//
// Each route is behind React.lazy, which webpack compiles to a Promise.all of
// chunk requests inside main.js. The browser cannot know about any of them until
// main.js has downloaded and run, so the request goes out one round trip late -
// measured on this build, main.js finished at 12ms and the chunks it asked for
// started at 18ms, on a local server with no latency at all. Over a phone
// connection that gap is the round trip, not six milliseconds.
//
// Only the shared chunk is worth naming in a document that serves every route. A
// route's own chunk is dead weight on the other twelve, so what gets preloaded is
// the set of chunks a majority of the lazy imports have in common: on this build
// that is one chunk, present in 11 of the 14 groups, and every route waits for it.
//
// The hint is `preload as=script` rather than `modulepreload` because the build
// emits classic scripts - the webpack runtime appends a plain <script> for each
// chunk. modulepreload is defined for module scripts and would fetch under
// different credentials and parsing rules than the request it is meant to warm.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");

const fail = (why) => {
  console.error(`chunk preload: ${why}`);
  process.exit(1);
};

const indexPath = path.join(BUILD, "index.html");
if (!fs.existsSync(indexPath)) fail("no build/index.html to read - run the build first");

const manifest = JSON.parse(fs.readFileSync(path.join(BUILD, "asset-manifest.json"), "utf8"));
const entry = (manifest.entrypoints || []).find((f) => f.endsWith(".js"));
if (!entry) fail("the asset manifest names no JavaScript entrypoint");

const entrySource = fs.readFileSync(path.join(BUILD, entry), "utf8");

// One group per lazy import: the chunks that import needs, all requested together.
const groups = (entrySource.match(/Promise\.all\(\[[^\]]*\]\)/g) || [])
  .map((group) => (group.match(/\.e\((\d+)\)/g) || []).map((call) => call.match(/\d+/)[0]))
  .filter((ids) => ids.length > 0);

if (groups.length === 0) {
  // A build with no split routes has nothing waiting on a second round trip.
  console.log("the entry declares no lazy chunk groups, so there is nothing to preload");
  process.exit(0);
}

const seen = new Map();
for (const ids of groups) {
  for (const id of new Set(ids)) seen.set(id, (seen.get(id) || 0) + 1);
}
const shared = [...seen.entries()]
  .filter(([, count]) => count > groups.length / 2)
  .map(([id]) => id);

if (shared.length === 0) {
  console.log(`no chunk is shared by a majority of the ${groups.length} lazy import(s)`);
  process.exit(0);
}

const urlFor = (id) => {
  const hit = Object.values(manifest.files || {}).find((url) =>
    new RegExp(`/${id}\\.\\w+\\.chunk\\.js$`).test(url),
  );
  if (!hit) fail(`chunk ${id} is named by the entry but is not in the asset manifest`);
  return hit;
};

let html = fs.readFileSync(indexPath, "utf8");
const links = shared
  .map(urlFor)
  .filter((url) => !html.includes(`href="${url}"`))
  .map((url) => `<link rel="preload" as="script" href="${url}">`);

if (links.length === 0) {
  console.log("the shared chunks are already preloaded in the document");
  process.exit(0);
}
if (!html.includes("</head>")) fail("build/index.html has no head to write into");
html = html.replace("</head>", `${links.join("")}</head>`);
fs.writeFileSync(indexPath, html);
console.log(
  `preloaded ${links.length} chunk(s) shared across ${groups.length} lazy import(s): ` +
    shared.join(", "),
);
