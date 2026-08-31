import ReactDOM from "react-dom/client";
import "@bradley-t-t/sunday-design-system/styles.css";
import "./index.css";
import "./components/reactbits/reactbits.css";
import App from "./app/App";
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
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, tree);
} else {
  ReactDOM.createRoot(container).render(tree);
}

reportWebVitals();
