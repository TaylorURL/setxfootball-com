/**
 * The camp's answers, as headings shaped like the questions parents type.
 *
 * The rendered list and the FAQPage markup are built from one array, so a
 * search result quoting an answer quotes what the page says.
 *
 * Native `details` elements rather than scripted panels: they open with no
 * JavaScript, the browser's own find reaches inside a shut one, and a crawler
 * reads the answer whether the panel is open or not.
 */
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { FAQ } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { SplitText } from "../../reactbits";
import JsonLd from "../../seo/JsonLd";
import { faqPage } from "../../seo/structuredData";

const FAQ_MARKUP = faqPage(FAQ);

const FaqSection = ({ surface }) => (
  <section {...surfaceProps(surface)} className="relative bg-ds-bg py-16 sm:py-20 lg:py-24">
    <JsonLd data={FAQ_MARKUP} />
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal>
        <SectionIntro
          eyebrow="Common Questions"
          title={<SplitText text="What parents ask us." splitType="words" delay={55} />}
        >
          Everything a family needs before the first whistle. Anything still unanswered, call the
          camp and ask.
        </SectionIntro>
      </Reveal>

      <div className="mt-12 max-w-3xl space-y-3">
        {FAQ.map(({ question, answer }, index) => (
          <Reveal key={question} variant="up" delay={index + 1}>
            <details className="card-flat group open:shadow-hard">
              <summary className="control flex cursor-pointer list-none items-center gap-4 px-5 py-4 sm:px-6">
                <span
                  aria-hidden="true"
                  className="numeral inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-ds-sm border-rule border-ds-border-strong bg-ds-bg-elevated text-lg text-ds-accent transition-colors group-open:bg-ds-accent group-open:text-ds-on-accent"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="heading flex-1 text-lg text-ds-text sm:text-[22px]">{question}</h3>
                <span
                  aria-hidden="true"
                  className="label-caps shrink-0 text-ds-text-faint group-open:hidden"
                >
                  Open
                </span>
                <span
                  aria-hidden="true"
                  className="label-caps hidden shrink-0 text-ds-accent-bright group-open:inline"
                >
                  Close
                </span>
              </summary>
              <p className="body-copy max-w-2xl px-5 pb-6 pl-[4.75rem] text-ds-text-muted sm:px-6 sm:pl-[5rem]">
                {answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
