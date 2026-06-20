/**
 * JoinCallout — the closing call-to-action band shared by the public pages.
 * Editorial: a left-aligned dramatic display, a mono price stamp, and an
 * accent-bordered link block. Sharp edges throughout. The page chooses which
 * surface this lands on so the closing CTA stays in rhythm with the rest of
 * the route.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../Reveal";
import { SHIRT_PRICE } from "../../../utils/constants";
import { REGISTER_PATH } from "../../nav/navLinks";
import { surfaceProps } from "../surface";

const JoinCallout = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative overflow-hidden border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <div aria-hidden="true" className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-ds-accent-soft blur-[160px]" />
    <div aria-hidden="true" className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-ds-surface-2 blur-[160px] opacity-60" />
    <div aria-hidden="true" className="field-grid absolute inset-0" />

    <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <Reveal>
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            Sign Up · ${SHIRT_PRICE} per shirt
          </span>
          <h2 className="editorial-display editorial-display-tight mt-7 text-[3rem] text-ds-text sm:text-[4rem] lg:text-[5.5rem]">
            Ready to get<br />
            your camper<br />
            <span className="text-ds-accent-bright">on the roster?</span>
          </h2>
          <p className="editorial-body mt-7 max-w-xl text-lg text-ds-text-muted sm:text-xl">
            Fill out the form, choose your shirts, and you're set. Payment is
            collected after — no payment needed now.
          </p>
        </Reveal>

        <Reveal variant="right" delay={2} className="flex flex-col justify-end gap-6">
          <div className="left-rule-accent pl-5">
            <span className="mono-tag-sm text-ds-text-faint">Cost</span>
            <p className="editorial-display mono-num mt-3 text-7xl text-ds-text">
              $5
              <span className="mono-tag-lg ml-3 align-top text-ds-text-faint">/ Shirt</span>
            </p>
            <p className="mono-tag-sm mt-3 text-ds-text-faint">
              Includes drinks & snacks · Every kid plays
            </p>
          </div>
          <Link
            to={REGISTER_PATH}
            className="press-down group mono-tag inline-flex items-center justify-center gap-2 border border-ds-accent bg-ds-accent px-6 py-5 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
          >
            Sign Up Your Camper
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

export default JoinCallout;
