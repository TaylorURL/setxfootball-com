/**
 * The closing call to action, shaped like a ticket: the red panel with the
 * copy and the two buttons, and the white stub beside it carrying the price.
 * Takes the shirt price from `utils/constants` so the figure beside the
 * sign-up button is the one the form will charge.
 */
import { Link } from "react-router-dom";
import Reveal from "../Reveal";
import { SHIRT_PRICE } from "../../../utils/constants";
import { REGISTER_PATH } from "../../layout/navLinks";
import { surfaceProps } from "../surface";
import { actionClass } from "../../ui/actionClass";
import CampIcon from "../../ui/CampIcon";

const JoinCallout = ({ surface }) => (
  <section {...surfaceProps(surface)} className="relative bg-ds-bg py-16 sm:py-20 lg:py-24">
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal
        variant="scale"
        className="grid grid-cols-1 gap-10 rounded-ds-xl border-rule border-ds-ink bg-ds-gold p-8 text-ds-on-gold shadow-hard-xl sm:p-10 lg:grid-cols-[1.5fr_auto] lg:items-center lg:gap-12 lg:p-12"
      >
        <div>
          <span className="inline-flex items-center rounded-ds-sm border-rule border-ds-ink bg-ds-bg-elevated px-3 py-1.5 text-ds-ink">
            <span className="label-caps">Admit one camper</span>
          </span>
          <h2 className="display mt-5 text-[2.25rem] text-ds-on-gold sm:text-[3rem] lg:text-[3.5rem]">
            Get on the roster.
          </h2>
          <p className="body-copy mt-6 max-w-measure text-lg text-ds-on-gold sm:text-xl">
            Sign-up takes two minutes. Pay for the shirts after, by CashApp, and bring your camper
            to the field in July.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={REGISTER_PATH} className={actionClass({ tone: "navy", size: "lg" })}>
              Sign Up Your Camper
            </Link>
            <Link to="/contact" className={actionClass({ tone: "inverse", size: "lg" })}>
              Ask a Question
            </Link>
          </div>
        </div>

        <div
          data-surface="paper"
          className="flex flex-col items-center rounded-ds-lg border-rule border-ds-border-strong bg-ds-bg-elevated px-10 py-8 text-center text-ds-text lg:min-w-[260px]"
        >
          <CampIcon name="ticket" size={64} />
          <p className="numeral mt-2 text-[3.25rem] text-ds-accent">${SHIRT_PRICE}</p>
          <p className="label-caps text-ds-text-muted">Per shirt</p>
          <p className="label-caps mt-1 text-ds-text">Camp is free</p>
        </div>
      </Reveal>
    </div>
  </section>
);

export default JoinCallout;
