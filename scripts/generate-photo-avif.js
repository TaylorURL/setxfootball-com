#!/usr/bin/env node
// Writes the AVIF copy of every photograph derivative the site ships.
//
// The derivatives are committed rather than built. There is no image pipeline
// in front of the bundler, the photographs change once a season, and a build
// that shelled out to an encoder would need one installed on every machine and
// in CI. So this is run by hand when a photograph is added or replaced, and
// what it produces is checked in beside the WebP it sits in front of.
//
// The WebP set is the specification. Every `<name>.webp` in the image directory
// gets a `<name>.avif` at the same pixel dimensions, because `Photo` offers the
// two from one `srcSet` and a browser that picks the AVIF branch and finds a
// file missing draws a broken image rather than falling back.
//
// Each one is encoded from the full-size JPEG rather than from the WebP beside
// it. Both are lossy, and re-encoding one into the other compounds what each
// threw away.
//
// The quality is set against the WebP it replaces, judged where the page
// actually draws it: the hero is rendered at 370 by 380 points and desaturated
// by `photo-mute`, so chroma error is invisible and the only thing to protect
// is luma detail. At this rate the hero is a third smaller than its WebP and
// the two are indistinguishable at three times the pixels a phone draws.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const IMAGES = path.join(__dirname, "..", "src", "assets", "images");
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const CRF = "30";
const PRESET = "3";

const fail = (why) => {
  console.error(`photo avif: ${why}`);
  process.exit(1);
};

const run = (args) => execFileSync(FFMPEG, args, { stdio: ["ignore", "ignore", "pipe"] });

try {
  execFileSync(FFMPEG, ["-version"], { stdio: "ignore" });
} catch {
  fail(`${FFMPEG} is not on PATH - set FFMPEG to the binary to use`);
}

/** The pixel width of an image file, read from the file rather than its name. */
function widthOf(file) {
  const probe = FFMPEG.replace(/ffmpeg$/, "ffprobe");
  const out = execFileSync(probe, [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width",
    "-of",
    "csv=p=0",
    file,
  ]);
  const width = Number(String(out).trim());
  if (!Number.isFinite(width) || width <= 0) fail(`could not read the width of ${file}`);
  return width;
}

const derivatives = fs
  .readdirSync(IMAGES)
  .filter((name) => name.endsWith(".webp"))
  .sort();

if (derivatives.length === 0) fail(`no .webp derivatives in ${IMAGES}`);

let written = 0;
for (const derivative of derivatives) {
  // `1-400w.webp` and `1-800w.webp` are both cut from `1.JPG`, which is the
  // only file in the set that has not been through a second encoder.
  const stem = derivative.replace(/-\d+w\.webp$/, "").replace(/\.webp$/, "");
  const source = path.join(IMAGES, `${stem}.JPG`);
  if (!fs.existsSync(source)) fail(`${derivative} has no ${stem}.JPG to encode from`);

  const target = path.join(IMAGES, derivative.replace(/\.webp$/, ".avif"));
  const width = widthOf(path.join(IMAGES, derivative));

  run([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    source,
    // -2 keeps the height even and on the source's aspect ratio, which is what
    // the width and height attributes on the img already promise.
    "-vf",
    `scale=${width}:-2:flags=lanczos`,
    "-c:v",
    "libsvtav1",
    "-crf",
    CRF,
    "-preset",
    PRESET,
    "-pix_fmt",
    "yuv420p",
    "-f",
    "avif",
    target,
  ]);

  const before = fs.statSync(path.join(IMAGES, derivative)).size;
  const after = fs.statSync(target).size;
  console.log(
    `${path.basename(target)}  ${after} B  (${Math.round((1 - after / before) * 100)}% off ${derivative})`,
  );
  written += 1;
}

console.log(`wrote ${written} AVIF derivative(s) at crf ${CRF}`);
