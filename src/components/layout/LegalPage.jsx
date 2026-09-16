/**
 * The frame the two legal pages share: a heading block, the date, and the
 * prose in one ruled panel at reading measure.
 *
 * @param {object} props
 * @param {string} props.eyebrow - The small label above the title.
 * @param {string} props.title - The page title.
 * @param {string} props.updated - When the text was last changed, as written.
 * @param {React.ReactNode} props.children - The prose.
 */
import { Prose } from "@bradley-t-t/sunday-design-system";
import { FadeContent } from "../reactbits";

const LegalPage = ({ eyebrow, title, updated, children }) => (
  <section className="bg-ds-bg py-16 sm:py-20 lg:py-24">
    <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
      <header>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display mt-6 text-4xl text-ds-text sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mono-tag mt-5 text-ds-text-faint">Last updated · {updated}</p>
      </header>

      <FadeContent as="article" className="card mt-10 p-7 sm:p-10" blur>
        <Prose>{children}</Prose>
      </FadeContent>
    </div>
  </section>
);

export default LegalPage;
