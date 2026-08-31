/**
 * The structured-data payloads the routes emit, built as plain objects.
 *
 * They live apart from the components that render them so the same objects can
 * be asserted against in a test: a malformed island is invisible in the browser
 * and costs the rich result silently, so it is checked rather than trusted.
 */
import { SITE_URL } from "./seoContent";

const absolute = (path) => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * @param {Array<{label: string, to: string}>} trail - Home first, current page last.
 * @returns {object} BreadcrumbList markup for the trail.
 */
export const breadcrumbList = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.label,
    item: absolute(crumb.to),
  })),
});

/**
 * @param {Array<{question: string, answer: string}>} entries
 * @returns {object} FAQPage markup for the entries.
 */
export const faqPage = (entries) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: entries.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});
