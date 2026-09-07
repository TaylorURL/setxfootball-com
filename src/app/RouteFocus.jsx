/**
 * Resets the reader's position on every route change: the page starts at the
 * top, and the keyboard starts inside the new page rather than wherever the
 * link that was just followed happened to sit.
 *
 * Focus moves to the page's `<main>`, which is why every layout gives it
 * `id="main"` and `tabIndex={-1}`. Without the negative tabindex the element
 * is not focusable and the move is silently a no-op.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteFocus = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const main = document.getElementById("main");
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);

  return null;
};

export default RouteFocus;
