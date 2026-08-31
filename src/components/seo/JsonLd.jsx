/**
 * One structured-data island, serialised into the head.
 *
 * Route-level markup is built from the same objects the page renders, so it
 * cannot describe a page the visitor is not looking at. Site-level identity
 * (Organization, WebSite, LocalBusiness, Product) is static in `index.html`
 * instead, where a crawler that runs no JavaScript still reaches it.
 */
import { Helmet } from "react-helmet-async";

const JsonLd = ({ data }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

export default JsonLd;
