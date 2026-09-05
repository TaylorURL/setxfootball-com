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
// Only a chunk every route waits for is worth naming, because one document is
// stamped for all of them. A chunk a majority of the routes need is still a
// whole download handed to the rest, and the rest are where a stranger arrives:
// the two chunks a majority share on this build are the animation runtime and
// the component library, and the landing page renders neither. So the test is
// every group rather than most of them. A build where nothing clears it
// preloads nothing, which is the honest answer when the document cannot know
// which route it is about to serve.
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
const shared = [...seen.entries()].filter(([, count]) => count === groups.length).map(([id]) => id);

if (shared.length === 0) {
  console.log(`no chunk is shared by all ${groups.length} lazy import(s)`);
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
  `preloaded ${links.length} chunk(s) shared by all ${groups.length} lazy import(s): ` +
    shared.join(", "),
);
