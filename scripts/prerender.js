/**
 * Writes the first screen into the document, one file per route.
 *
 * A client-rendered build ships a document with an empty root, so nothing can
 * be drawn until main.js has downloaded, parsed, executed and rendered. That
 * whole chain sits in front of the largest paint. This runs the same components
 * at build time and puts their markup in the file the visitor is served, so the
 * page is on screen from the first response and React adopts it on load rather
 * than drawing it again.
 *
 * The routes are split three ways:
 *
 *   - Rendered. The public pages, whose first screen is a pure function of the
 *     source. Their markup goes into the document.
 *   - Shell. `/auth`, `/dashboard`, `/staff` and `/payment` depend on a session
 *     or on router state that only exists in the browser, so rendering them
 *     ahead of time would bake in a loading skeleton nobody can clear. They get
 *     a copy of the empty shell, which is what they are served today.
 *   - The catch-all, written to 404.html, which vercel.json points unmatched
 *     paths at. Every route in the table has a file of its own, so that rewrite
 *     is only ever reached by a URL the app does not have a page for.
 *
 * Node cannot run the source directly: the route chunks are `import()` calls
 * that webpack compiles to browser-only chunk loads, and the components import
 * CSS and images. So esbuild bundles a Node copy first, resolving each image to
 * the hashed URL webpack already emitted for it, which is what keeps the two
 * renders agreeing on every `src`.
 *
 * The page's head tags are the one part of the markup that does not belong in
 * the root. React hoists a title, a meta or a link to the document head when it
 * renders one, but a render of a fragment has no head to hoist into, so they
 * come back at the front of the markup instead. Written into the root as they
 * stand, they are a title and a description inside a div: React adopts them
 * where they are when it hydrates and the head never gets them, so the page
 * serves no description at all. They are lifted into the head here, which is
 * where React would have put them and where a reader of the document looks.
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const root = path.join(__dirname, "..");
const buildDir = path.join(root, "build");
const indexPath = path.join(buildDir, "index.html");
const manifestPath = path.join(buildDir, "asset-manifest.json");
const ROOT_DIV = '<div id="root"></div>';

// The public pages. Each one's first screen is decided by the source alone: no
// request, no session, no router state carried in from another page.
const RENDERED = [
  "/",
  "/about",
  "/gallery",
  "/sponsors",
  "/register",
  "/design",
  "/contact",
  "/privacy",
  "/terms",
];

// Behind a sign-in or reachable only with router state from the previous page.
const SHELL = ["/auth", "/dashboard", "/staff", "/payment"];

// Any path the table does not have a route for lands on the catch-all, which
// renders the same page whatever the path was.
const NOT_FOUND_ROUTE = "/404";

const ASSET = /\.(webp|png|jpe?g|JPG|JPEG|PNG|gif|svg|avif|ico)$/;

/** Resolves an image import to the hashed URL the webpack build emitted for it. */
const assetUrls = (manifest) => ({
  name: "asset-urls",
  setup(build) {
    build.onResolve({ filter: ASSET }, (args) => ({
      path: path.resolve(args.resolveDir, args.path),
      namespace: "asset-url",
    }));
    build.onLoad({ filter: /.*/, namespace: "asset-url" }, (args) => {
      const key = `static/media/${path.basename(args.path)}`;
      const url = manifest.files[key];
      if (!url) {
        return { errors: [{ text: `${key} is not in asset-manifest.json` }] };
      }
      return { contents: `export default ${JSON.stringify(url)};`, loader: "js" };
    });
  },
});

async function bundle(manifest, outfile) {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "prerender-entry.jsx")],
    outfile,
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node22",
    jsx: "automatic",
    logLevel: "silent",
    // React resolves from node_modules so the bundle and react-dom/static share
    // one copy of it. Two would not see each other's hooks.
    external: ["react", "react/jsx-runtime", "react-dom", "react-dom/*"],
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      // The stylesheet is already built and linked in the document; the render
      // only needs the markup.
      ".css": "empty",
      ".woff": "empty",
      ".woff2": "empty",
    },
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [assetUrls(manifest)],
  });
}

// A title, a meta or a link at the very front of the markup is a tag React
// hoisted. Only the opening run counts: the same elements further in belong to
// the page and stay where the page put them.
const HOISTED = /^\s*(?:<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>)/;

/** Splits the head tags React hoisted off the front of a route's markup. */
function liftHead(markup) {
  const tags = [];
  let rest = markup;
  for (;;) {
    const found = rest.match(HOISTED);
    if (!found) break;
    tags.push(found[0].trim());
    rest = rest.slice(found[0].length);
  }
  return { head: tags.join(""), body: rest };
}

// The stand-in head in public/index.html answers a crawler that runs no
// JavaScript, and the routes that ship as an empty shell still need it. A route
// rendered here does not: it carries the real title, description and canonical
// in the file itself. So the stand-in comes out rather than sitting beside
// them, because two titles and two canonicals in one document is a worse answer
// than either of them alone. src/index.js drops the same set at boot, which is
// what the shell routes still rely on.
const FALLBACK_TITLE = /<title\b[^>]*\bdata-seo-fallback\b[^>]*>[\s\S]*?<\/title>/;
const FALLBACK_TAG = /<(?:meta|link)\b[^>]*\bdata-seo-fallback\b[^>]*>/g;

/** Puts a route's own head tags where the stand-in set is, and drops the rest of it. */
function withHead(shell, head) {
  const first = shell.search(FALLBACK_TITLE);
  if (first === -1) {
    if (!shell.includes("</head>")) {
      console.error("build/index.html has no head to write the page's own tags into");
      process.exit(1);
    }
    return shell.replace("</head>", `${head}</head>`);
  }
  return shell.replace(FALLBACK_TITLE, head).replace(FALLBACK_TAG, "");
}

/** The number of words a reader would find in the body, which is what RND-01 counts. */
function bodyWords(html) {
  const body = html.slice(html.indexOf("<body"));
  const text = body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

// The hero preload is written into the shell every route is stamped from, so
// each of them asks for the first screen's photograph in its opening bytes at
// the highest priority the browser has. Only the home page draws it. Everywhere
// else it is a large file fetched ahead of the content the reader came for and
// then dropped unused - and one more request per route that can lose its
// connection and report a photograph nothing on the page was going to show.
const HERO_PRELOAD = /<link rel="preload" as="image" type="image\/avif"[^>]*>/;

function withoutUnusedHeroPreload(html) {
  const tag = html.match(HERO_PRELOAD);
  if (!tag) return html;
  const body = html.slice(html.indexOf("<body"));
  const urls = [...tag[0].matchAll(/(?:href|imagesrcset)="([^"]+)"/g)]
    .flatMap((attribute) => attribute[1].split(","))
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
  if (urls.some((url) => body.includes(url))) return html;
  return html.replace(HERO_PRELOAD, "");
}

// React's server renderer hoists a preload for every image it draws, so each
// document opens by asking for every mark on the page at the browser's highest
// priority - fifteen of them on the home page, ahead of the stylesheet and the
// bundle that the reader is actually waiting on. The marks are decorative and
// a few kilobytes each: the <img> that draws one asks for it anyway, a moment
// later, at the priority it deserves, so the hint buys the reader nothing.
//
// What it costs is a burst. Every one of those requests goes on the wire in the
// opening bytes together, and a connection lost in that moment takes all of
// them that are in flight rather than one - which is a page of empty boxes off
// a single dropped packet, and the icons have no second ask behind them.
//
// Only the hoisted hints go. The hero photograph's preload is deliberate: it
// is written by scripts/preload-hero-image.js, which names a format and a
// candidate set, and it is the largest paint on the page.
const ICON_PRELOAD = /<link rel="preload" as="image" href="[^"]+\.svg"\s*\/?>/g;

function withoutIconPreloads(html) {
  return html.replace(ICON_PRELOAD, "");
}

function writeRoute(route, html) {
  const file =
    route === "/" ? indexPath : path.join(buildDir, route.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, withoutIconPreloads(withoutUnusedHeroPreload(html)));
  return path.relative(buildDir, file);
}

async function main() {
  if (!fs.existsSync(indexPath)) {
    console.error("no build/index.html to prerender into");
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const shell = fs.readFileSync(indexPath, "utf8");
  if (!shell.includes(ROOT_DIV)) {
    console.error(`build/index.html has no ${ROOT_DIV} to render into`);
    process.exit(1);
  }

  const outfile = path.join(buildDir, ".prerender-bundle.js");
  await bundle(manifest, outfile);

  let rendered = 0;
  try {
    const { renderRoute } = require(outfile);
    for (const route of [...RENDERED, NOT_FOUND_ROUTE]) {
      const markup = await renderRoute(route);
      // A boundary that emitted its fallback leaves the page in a hidden div for
      // a script at the end of the document to reveal. The footer check below
      // cannot see that, because the footer is inside the hidden div: what the
      // visitor paints is the skeleton, and the hero cannot be a largest-paint
      // candidate until the whole document has been parsed.
      if (markup.includes('<template id="B:') || markup.includes("<!--$?-->")) {
        console.error(
          `${route} rendered with an unresolved Suspense boundary - the page is in a hidden div, not the shell`,
        );
        process.exit(1);
      }
      // The page frame stands in for a route chunk that has not arrived. Seeing
      // it here means the render emitted before the chunk resolved, and shipping
      // it would put a skeleton in the document for good.
      if (!markup.includes("<footer")) {
        console.error(`${route} rendered without its page - the route chunk did not resolve`);
        process.exit(1);
      }
      const { head, body } = liftHead(markup);
      // A rendered route with no head tags would ship with no title and no
      // description, which is worse than not prerendering it at all.
      if (!head) {
        console.error(`${route} rendered no head tags - the page sets no Seo`);
        process.exit(1);
      }
      const html = withHead(shell, head).replace(ROOT_DIV, `<div id="root">${body}</div>`);
      let file;
      if (route === NOT_FOUND_ROUTE) {
        file = "404.html";
        fs.writeFileSync(path.join(buildDir, file), withoutUnusedHeroPreload(html));
      } else {
        file = writeRoute(route, html);
      }
      rendered += 1;
      console.log(`prerendered ${route} into ${file} (${bodyWords(html)} words)`);
    }
  } finally {
    fs.rmSync(outfile, { force: true });
    fs.rmSync(`${outfile}.map`, { force: true });
  }

  for (const route of SHELL) {
    writeRoute(route, shell);
  }
  console.log(`prerendered ${rendered} route(s); ${SHELL.length} left as the shell they serve now`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
