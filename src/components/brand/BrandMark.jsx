/**
 * BrandMark — the SETX Youth Football lockup: the logo tile plus the wordmark
 * and an accent-flagged subtitle. One source of truth for the brand identity
 * shown in the navbar, footer, dashboard chrome, and auth screen.
 *
 * Renders as a router `Link` when `to` is set, a `button` when `onClick` is set,
 * otherwise a plain element — so each surface controls its own interaction
 * without re-implementing the mark.
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
import logo from "../../assets/logo.PNG";

const SIZES = {
  sm: { tile: "h-9 w-9 rounded-ds-md", img: "h-7 w-7", word: "text-[14px]", sub: "text-[9px]", gap: "ml-3" },
  md: { tile: "h-11 w-11 rounded-ds-md", img: "h-9 w-9", word: "text-[15px]", sub: "text-[9px]", gap: "ml-3" },
  lg: { tile: "h-16 w-16 rounded-ds-xl", img: "h-12 w-12", word: "text-[15px]", sub: "text-[9px]", gap: "mt-3" },
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
  const wordTone = light ? "text-white" : "text-ds-text";
  const subTone = light ? "text-white/65" : "text-ds-text-muted";

  const content = (
    <>
      <span
        className={clsx(
          "relative inline-flex items-center justify-center overflow-hidden bg-ds-accent ring-1 ring-white/15 brand-chip-shadow-sm",
          scale.tile,
        )}
      >
        <img src={logo} alt="" className={clsx("object-contain", scale.img)} />
      </span>
      <span className={clsx(vertical ? "text-center" : "text-left", scale.gap)}>
        <span className={clsx("block font-black uppercase tracking-[0.05em]", scale.word, wordTone)}>
          SETX Football
        </span>
        <span
          className={clsx(
            "mt-0.5 inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.22em]",
            scale.sub,
            subTone,
          )}
        >
          <span aria-hidden="true" className="inline-block h-0.5 w-3 bg-ds-accent" />
          {subtitle}
        </span>
      </span>
    </>
  );

  const shellClass = clsx("group inline-flex items-center", vertical && "flex-col", className);

  if (to) {
    return (
      <Link to={to} className={shellClass} aria-label="SETX Football home">
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={shellClass} aria-label="Go to top">
        {content}
      </button>
    );
  }
  return <span className={shellClass}>{content}</span>;
};

export default BrandMark;
