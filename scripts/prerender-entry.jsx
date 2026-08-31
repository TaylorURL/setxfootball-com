/**
 * What the prerender renders. Bundled for Node by scripts/prerender.js and
 * called once per route.
 *
 * It mounts the same `Root` and the same `App` the browser does, and swaps only
 * the router, so anything a page draws here is what the browser would have
 * drawn for that URL. `prerenderToNodeStream` waits for the route's lazy chunk
 * to resolve before emitting, which is why the markup is the page rather than
 * the loading frame.
 */
import { StaticRouter } from "react-router";
import { prerenderToNodeStream } from "react-dom/static";
import App from "../src/app/App";
import Root from "../src/app/Root";

const read = (stream) =>
  new Promise((resolve, reject) => {
    let html = "";
    stream.on("data", (chunk) => {
      html += chunk;
    });
    stream.on("end", () => resolve(html));
    stream.on("error", reject);
  });

/**
 * @param {string} route - The path to render, as the browser would request it.
 * @returns {Promise<string>} The markup for that route's `#root`.
 */
export async function renderRoute(route) {
  const errors = [];
  const { prelude } = await prerenderToNodeStream(
    <Root>
      <App router={StaticRouter} routerProps={{ location: route }} />
    </Root>,
    {
      onError(error) {
        errors.push(error);
      },
    },
  );
  const html = await read(prelude);
  if (errors.length) throw errors[0];
  return html;
}
