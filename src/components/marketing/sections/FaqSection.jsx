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
import { HelpCircle } from "lucide-react";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { FAQ } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { SplitText } from "../../reactbits";
import JsonLd from "../../seo/JsonLd";
import { faqPage } from "../../seo/structuredData";

const FAQ_MARKUP = faqPage(FAQ);

const FaqSection = ({ surface = "light" }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <JsonLd data={FAQ_MARKUP} />
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          badge={
            <span className="inline-flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" /> Common Questions
            </span>
          }
          title={<SplitText text="What parents ask us." splitType="words" delay={55} />}
        >
          Everything a family needs before the first whistle. Anything still unanswered, call the
          camp and ask.
        </SectionIntro>
      </Reveal>

      <div className="mt-16 max-w-3xl border-t border-ds-border">
        {FAQ.map(({ question, answer }, index) => (
          <Reveal key={question} variant="up" delay={index + 1}>
            <details className="group border-b border-ds-border">
              <summary className="control flex cursor-pointer list-none items-start gap-4 py-6">
                <span aria-hidden="true" className="mono-tag-sm mt-1 text-ds-accent-bright">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="editorial-display flex-1 text-xl text-ds-text sm:text-2xl">
                  {question}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-4 shrink-0 bg-ds-border-strong transition-colors group-open:bg-ds-accent"
                />
              </summary>
              <p className="editorial-body max-w-2xl pb-7 pl-11 text-ds-text-muted">{answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
