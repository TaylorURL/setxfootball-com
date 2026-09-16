/**
 * Renders as a Link when `to` is set, a button when `onClick` is set, and a
 * plain element otherwise, so each surface picks its own interaction without
 * re-implementing the lockup.
 *
 * @param {object} props
 * @param {string} [props.subtitle='Youth Camp · Daisetta TX']
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Lockup scale.
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal']
 * @param {boolean} [props.light=false] - White-on-dark variant for hero overlays.
 * @param {string} [props.to] - Router destination; renders a Link.
 * @param {() => void} [props.onClick] - Click handler; renders a button.
 * @param {string} [props.className]
 */
import { Link } from "react-router-dom";
import clsx from "clsx";
import logo96 from "../../assets/logo-96w.png";
import logo192 from "../../assets/logo-192w.png";
import logoWebp96 from "../../assets/logo-96w.webp";
import logoWebp192 from "../../assets/logo-192w.webp";

// The mark draws at 28 to 48 CSS pixels, so 96 covers a standard screen and 192
// a retina one. Anything wider is weight the lockup never renders.
const LOGO_WEBP = `${logoWebp96} 96w, ${logoWebp192} 192w`;
const LOGO_PNG = `${logo96} 96w, ${logo192} 192w`;

const SIZES = {
  sm: {
    tile: "h-10 w-10 rounded-[8px]",
    img: "h-7 w-7",
    word: "text-[15px]",
    sub: "text-[10px]",
    gap: "ml-3",
  },
  md: {
    tile: "h-12 w-12 rounded-[10px]",
    img: "h-9 w-9",
    word: "text-[16px]",
    sub: "text-[10px]",
    gap: "ml-3.5",
  },
  lg: {
    tile: "h-16 w-16 rounded-[12px]",
    img: "h-12 w-12",
    word: "text-[18px]",
    sub: "text-[11px]",
    gap: "mt-3",
  },
};

const BrandMark = ({
  subtitle = "Youth Camp · Daisetta TX",
  size = "md",
  orientation = "horizontal",
  light = false,
  to,
  onClick,
  className,
}) => {
  const scale = SIZES[size];
  const vertical = orientation === "vertical";
  const wordTone = light ? "text-ds-on-media" : "text-ds-text";
  const subTone = light ? "text-ds-on-media-muted" : "text-ds-text-faint";

  const content = (
    <>
      <span
        className={clsx(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden border-rule border-ds-border-strong bg-[var(--white)]",
          scale.tile,
        )}
      >
        <picture>
          <source type="image/webp" srcSet={LOGO_WEBP} sizes="48px" />
          <img
            src={logo96}
            srcSet={LOGO_PNG}
            sizes="48px"
            alt=""
            width="48"
            height="48"
            className={clsx("object-contain", scale.img)}
          />
        </picture>
      </span>
      <span className={clsx(vertical ? "text-center" : "text-left", scale.gap)}>
        <span
          className={clsx(
            "block font-black uppercase leading-none tracking-[-0.01em]",
            scale.word,
            wordTone,
          )}
        >
          SETX Football
        </span>
        <span className={clsx("mono-tag mt-1.5 block whitespace-nowrap", scale.sub, subTone)}>
          {subtitle}
        </span>
      </span>
    </>
  );

  const shellClass = clsx(
    "group inline-flex items-center",
    (to || onClick) && "control",
    vertical && "flex-col",
    className,
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={shellClass} aria-label="SETX Football Home">
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={shellClass} aria-label="Go to Top">
        {content}
      </button>
    );
  }
  return <span className={shellClass}>{content}</span>;
};

export default BrandMark;
