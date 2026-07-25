import { Helmet } from "react-helmet-async";
import {
  SITE_URL,
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from "./seoContent";

const buildCanonicalUrl = (path = "/") => {
  if (!path) return SITE_URL;
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${trimmed === "/" ? "" : trimmed}`;
};

const Seo = ({
  title,
  description,
  path = "/",
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  noindex = false,
  keywords,
}) => {
  const canonical = buildCanonicalUrl(path);
  const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
