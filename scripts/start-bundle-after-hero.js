#!/usr/bin/env node
// Holds the application bundle back until the first screen's photograph is on
// the glass.
//
// Every prerendered route already carries its first screen as markup, so
// nothing above the fold is drawn by JavaScript. What the bundle does is adopt
// that markup and make it interactive. A `<script defer>` in the head is still
// requested in the opening bytes though, and on a phone connection it is the
// largest thing on the wire: the bundle and the chunk beside it are the
// majority of the bytes the document asks for, and every one of them is
// bandwidth the photograph is not getting. The photograph is the largest paint,
// so the bundle competing for the pipe is the bundle delaying the metric.
//
// So the request moves behind the picture. The tag comes out of the head and an
// inline bootstrap at the end of the body puts it back two frames after the hero
// image settles, which is a moment the visitor cannot see and the browser
// cannot reorder. On a route with no eager image there is nothing to wait for
// and the bundle starts immediately.
//
// The wait is taken even when the photograph is already decoded by the time the
// bootstrap runs. That is the whole of the difference between a good score and
// a bad one: a page measured over a fast connection decodes the hero before the
// end of the body is parsed, the bundle is then requested beside it rather than
// behind it, and a lab tool that replays that request graph down a slow
// connection hands the photograph a fraction of the bandwidth for the whole of
// its download. Deferring unconditionally is what makes the order the same one
// on every connection.
//
// The shared-chunk preload travels with it. Left in the head it would be
// fetched for a bundle that has not been asked for yet, which is both the
// contention this removes and a hint the browser reports as unused.
//
// This runs after the preload steps and before the prerender, so the document
// every route is stamped from already carries the bootstrap.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");

const fail = (why) => {
  console.error(`bundle start: ${why}`);
  process.exit(1);
};

const indexPath = path.join(BUILD, "index.html");
if (!fs.existsSync(indexPath)) fail("no build/index.html to read - run the build first");

const manifest = JSON.parse(fs.readFileSync(path.join(BUILD, "asset-manifest.json"), "utf8"));
const entry = (manifest.entrypoints || []).find((file) => file.endsWith(".js"));
if (!entry) fail("the asset manifest names no JavaScript entrypoint");
const entryUrl = `/${entry}`;

let html = fs.readFileSync(indexPath, "utf8");

if (html.includes("data-bundle-start")) {
  console.log("the bundle already starts behind the hero");
  process.exit(0);
}

// The entry is matched by the URL the manifest gives rather than by position,
// so a second script in the document is left where it is.
const ENTRY_TAG = new RegExp(
  `<script[^>]*\\bsrc="${entryUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>\\s*</script>`,
);
if (!ENTRY_TAG.test(html)) fail(`build/index.html does not load ${entryUrl}`);
html = html.replace(ENTRY_TAG, "");

// Whatever preload-shared-chunks left behind, taken in document order so the
// bootstrap re-issues them the way the head had them.
const CHUNK_LINK = /<link rel="preload" as="script" href="([^"]+)">/g;
const chunks = [...html.matchAll(CHUNK_LINK)].map((match) => match[1]);
html = html.replace(CHUNK_LINK, "");

const bootstrap =
  `<script data-bundle-start>(function(){` +
  `var chunks=${JSON.stringify(chunks)},started=false,tried=0;` +
  // The entry carries a content hash, so it belongs to the deploy that built
  // it and the next deploy deletes it. A document held open across one then
  // asks for a file that has gone. ErrorBoundary already recovers from exactly
  // that for a route chunk - reload once, guarded by the key below - but it is
  // code inside the bundle, so when the bundle is the missing file none of it
  // runs. What the reader is left with is the prerendered markup and no
  // application on top of it: a page that looks right and answers nothing.
  `function recover(){` +
  `try{if(sessionStorage.getItem("chunk-reload-attempted")==="1")return;` +
  `sessionStorage.setItem("chunk-reload-attempted","1")}catch(e){return}` +
  // The document is the stale thing rather than the file it names, so asking
  // for it again is the fix: the server answers with the current one, naming
  // an entry that exists. ErrorBoundary clears the key on its next clean
  // mount, which is this load having worked, so a second deploy later in the
  // same tab is recovered from too. Storage that refuses to answer takes the
  // fallback rather than the reload, because a guard that cannot be written is
  // a reload that cannot be stopped.
  `location.reload()}` +
  `function load(){` +
  `var script=document.createElement("script");` +
  // A dropped request is worth one more try before the document is fetched
  // again, and the query makes that a request of its own rather than a repeat
  // of one something on the way is holding a failure for.
  `script.src=tried?${JSON.stringify(entryUrl)}+"?retry="+tried:${JSON.stringify(entryUrl)};` +
  `script.onerror=function(){tried+=1;if(tried<2){setTimeout(load,600)}else{recover()}};` +
  `document.head.appendChild(script)}` +
  `function start(){` +
  `if(started)return;started=true;` +
  `for(var i=0;i<chunks.length;i+=1){` +
  `var link=document.createElement("link");` +
  `link.rel="preload";link.as="script";link.href=chunks[i];` +
  `document.head.appendChild(link)}` +
  `load()}` +
  // A photograph that never answers cannot be allowed to hold the page
  // uninteractive, so the wait has an end whatever the network does. It is
  // armed here, before any of the paths below can return, because two of them
  // do: a route with no eager image starts the bundle outright, and a hero the
  // browser already has decoded hands the entire wait to a pair of animation
  // frames. A tab in the background is served no animation frames, so that
  // second path had no end to it at all - the bundle was never asked for and
  // the page never adopted its markup until the visitor fronted the tab.
  // start() is idempotent, so a timer left running behind a path that already
  // started the bundle costs nothing.
  `setTimeout(start,3000);` +
  `var hero=document.querySelector('#root img[loading="eager"]');` +
  `if(!hero){start();return}` +
  // Two frames, because one only reaches the frame the picture is drawn in and
  // the request has to be behind the frame it was drawn in. Taken whether the
  // picture is still arriving or was already here: a document served fast
  // enough that the photograph is decoded before this line runs would otherwise
  // put the bundle on the wire beside it, and that is the case a lab tool
  // measures on a fast connection and then replays down a slow one.
  `function settled(){requestAnimationFrame(function(){requestAnimationFrame(start)})}` +
  `if(hero.complete){settled();return}` +
  `hero.addEventListener("load",settled);` +
  `hero.addEventListener("error",settled)})()</script>`;

if (!html.includes("</body>")) fail("build/index.html has no body to write into");
html = html.replace("</body>", `${bootstrap}</body>`);

fs.writeFileSync(indexPath, html);
console.log(
  `${path.basename(entryUrl)} now starts after the hero image` +
    (chunks.length ? `, with ${chunks.length} shared chunk preload(s) behind it` : ""),
);
