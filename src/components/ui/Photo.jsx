/**
 * One photograph, offered in AVIF at two widths, WebP behind it, and the
 * original JPEG behind that. A phone that asks for a 400 point column downloads
 * the 400 pixel file rather than the desktop one.
 *
 * The sources are read in order and the first the browser understands wins, so
 * every derivative named here has to exist: a source that is picked and then
 * fails to load draws a broken image rather than falling through to the next.
 *
 * `width` and `height` are the intrinsic pixels of the source, not the rendered
 * box: they set the aspect ratio the browser reserves before the file arrives,
 * and the class names decide what size that box is drawn at.
 *
 * @param {object} props
 * @param {{src: string, avif: string, webp: string, jpeg: string, width: number, height: number}} props.image - From campContent.
 * @param {string} props.alt - Empty only where the picture repeats adjacent text.
 * @param {string} [props.sizes] - The rendered width, per breakpoint.
 * @param {boolean} [props.priority=false] - True for the one image on the first screen.
 */
const Photo = ({ image, alt, sizes = "100vw", priority = false, className, ...rest }) => (
  <picture>
    <source type="image/avif" srcSet={image.avif} sizes={sizes} />
    <source type="image/webp" srcSet={image.webp} sizes={sizes} />
    <img
      src={image.src}
      srcSet={image.jpeg}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={className}
      {...rest}
    />
  </picture>
);

export default Photo;
