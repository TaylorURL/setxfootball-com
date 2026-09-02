import ReactDOM from "react-dom/client";
import "@bradley-t-t/sunday-design-system/styles.css";
import "./index.css";
import "./components/reactbits/reactbits.css";
import App, { preloadRoute } from "./app/App";
import Root from "./app/Root";
import reportWebVitals from "./hooks/reportWebVitals";

// The head in index.html answers crawlers that run no JavaScript. React hoists
// the Seo component's tags in alongside it rather than over it, so the static
// set is dropped the moment there is a runtime one to replace it: two
// canonicals on a route is a worse signal than either alone.
document.querySelectorAll("[data-seo-fallback]").forEach((tag) => tag.remove());

// The browser chrome takes its colour from the same token as the page, so the
// two can never disagree.
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
if (themeColorMeta) {
  themeColorMeta.setAttribute(
    "content",
    getComputedStyle(document.documentElement).getPropertyValue("--ds-bg").trim(),
  );
}

const container = document.getElementById("root");
const tree = (
  <Root>
    <App />
  </Root>
);

// The build writes the first screen into the document for the routes it can
// render ahead of time, and those pages are adopted rather than drawn a second
// time. The gated routes ship as an empty shell and the dev server serves one
// too, so both paths have to work.
//
// Adopting the markup only works while nothing suspends part way through it. A
// boundary that suspends mid-hydration is discarded and drawn again from
// nothing, which wipes the screen the reader is already looking at, replays
// every entrance animation on it, and offers the largest paint a second
// candidate whole seconds after the first. The route's own page module is the
// one thing in the tree that would suspend, so it is fetched first and the
// adoption starts with it in hand.
if (container.firstElementChild) {
  preloadRoute(window.location.pathname).then(() => {
    ReactDOM.hydrateRoot(container, tree);
  });
} else {
  ReactDOM.createRoot(container).render(tree);
}

reportWebVitals();
