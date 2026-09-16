/**
 * The camp's icon set: thirty flat marks with a heavy indigo outline, drawn
 * on a 64-unit canvas and transparent behind the drawing, so one sits on a
 * white card, on ice or on the turf without a tile under it.
 *
 * Each is served as its own file rather than inlined, because a page uses a
 * handful and the browser caches the ones it has seen. The mark is decorative
 * everywhere it appears: the label beside it carries the meaning, so the image
 * is hidden from assistive technology.
 *
 * @param {object} props
 * @param {keyof typeof ICONS} props.name
 * @param {number} [props.size=64] - Rendered box in CSS pixels; the file is
 *   vector, so any size stays sharp.
 * @param {string} [props.className]
 */
import clsx from "clsx";
import americanFootball from "../../assets/icons/american-football.svg";
import athlete from "../../assets/icons/athlete.svg";
import badge from "../../assets/icons/badge.svg";
import buffaloWings from "../../assets/icons/buffalo-wings.svg";
import calendar from "../../assets/icons/calendar.svg";
import championRing from "../../assets/icons/champion-ring.svg";
import cleat from "../../assets/icons/cleat.svg";
import coach from "../../assets/icons/coach.svg";
import fansMegaphone from "../../assets/icons/fans-megaphone.svg";
import fans from "../../assets/icons/fans.svg";
import fieldGoal from "../../assets/icons/field-goal.svg";
import field from "../../assets/icons/field.svg";
import gameClock from "../../assets/icons/game-clock.svg";
import glove from "../../assets/icons/glove.svg";
import goalpost from "../../assets/icons/goalpost.svg";
import helmet from "../../assets/icons/helmet.svg";
import jersey from "../../assets/icons/jersey.svg";
import kickoff from "../../assets/icons/kickoff.svg";
import medal from "../../assets/icons/medal.svg";
import mvp from "../../assets/icons/mvp.svg";
import nachos from "../../assets/icons/nachos.svg";
import passing from "../../assets/icons/passing.svg";
import refereeWhistle from "../../assets/icons/referee-whistle.svg";
import referee from "../../assets/icons/referee.svg";
import scoreboard from "../../assets/icons/scoreboard.svg";
import stadium from "../../assets/icons/stadium.svg";
import strategy from "../../assets/icons/strategy.svg";
import ticket from "../../assets/icons/ticket.svg";
import touchdown from "../../assets/icons/touchdown.svg";
import trophy from "../../assets/icons/trophy.svg";

export const ICONS = {
  "american-football": americanFootball,
  athlete,
  badge,
  "buffalo-wings": buffaloWings,
  calendar,
  "champion-ring": championRing,
  cleat,
  coach,
  "fans-megaphone": fansMegaphone,
  fans,
  "field-goal": fieldGoal,
  field,
  "game-clock": gameClock,
  glove,
  goalpost,
  helmet,
  jersey,
  kickoff,
  medal,
  mvp,
  nachos,
  passing,
  "referee-whistle": refereeWhistle,
  referee,
  scoreboard,
  stadium,
  strategy,
  ticket,
  touchdown,
  trophy,
};

const CampIcon = ({ name, size = 64, className, style, ...rest }) => (
  <img
    src={ICONS[name]}
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    draggable="false"
    className={clsx("sticker", className)}
    style={{ width: size, height: size, ...style }}
    {...rest}
  />
);

export default CampIcon;
