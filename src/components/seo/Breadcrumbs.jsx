/**
 * The trail from the home page to the current page, rendered and marked up.
 *
 * Google shows this trail in place of the raw URL in a result, so the visible
 * list and the BreadcrumbList markup are built from one array here: a trail
 * that says one thing to a reader and another to a crawler is worse than none.
 *
 * The last crumb is the current page. It is plain text carrying
 * `aria-current`, not a link, because a self-link is a dead end for anyone
 * moving through the page by keyboard or screen reader.
 */
import { Link } from "react-router-dom";
import { breadcrumbList } from "./structuredData";
import JsonLd from "./JsonLd";

const HOME_CRUMB = { label: "Home", to: "/" };

const Breadcrumbs = ({ label, to }) => {
  const markup = breadcrumbList([HOME_CRUMB, { label, to }]);

  return (
    <>
      <JsonLd data={markup} />
      <nav aria-label="Breadcrumb" className="bg-ds-bg-recessed">
        <div className="mx-auto w-full max-w-[1160px] px-5 py-3 sm:px-8 lg:px-10">
          <ol className="label-caps flex flex-wrap items-center gap-3 text-ds-text-muted">
            <li>
              <Link className="control hover:text-ds-accent-bright" to={HOME_CRUMB.to}>
                {HOME_CRUMB.label}
              </Link>
            </li>
            <li aria-hidden="true" className="text-ds-text-faint">
              /
            </li>
            <li aria-current="page" className="text-ds-text">
              {label}
            </li>
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs;
