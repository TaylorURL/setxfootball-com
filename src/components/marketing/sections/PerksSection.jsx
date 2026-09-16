import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { CAMPER_PERKS } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { SplitText } from "../../reactbits";
import CampIcon from "../../ui/CampIcon";

const PerksSection = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="relative border-b-rule border-ds-border bg-ds-bg-elevated py-16 sm:py-20 lg:py-24"
  >
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal>
        <SectionIntro
          eyebrow="What's Included"
          title={<SplitText text="What every camper gets." splitType="words" delay={60} />}
        >
          No hidden fees, no pay-to-play. Sign up for the shirts and the rest comes with showing up.
        </SectionIntro>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CAMPER_PERKS.map((perk, index) => (
          <Reveal key={perk.title} variant="up" delay={index + 1} className="flex">
            <article className="card card-lift group flex w-full flex-col bg-ds-bg p-7">
              <CampIcon name={perk.icon} size={56} />
              <h3 className="display mt-5 text-2xl text-ds-text">{perk.title}</h3>
              <p className="body-copy mt-2 text-[15px] text-ds-text-muted">{perk.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default PerksSection;
