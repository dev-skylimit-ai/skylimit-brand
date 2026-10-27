import { useId } from "react";
import { MARK_PATH } from "../src/mark";
import { brand } from "../src/tokens";

const { color } = brand;

type Props = {
  /** Edge length in px. */
  size?: number;
  /** Corner radius in px at this size. Defaults to the favicon's 14/64. */
  radius?: number;
  className?: string;
  /** Accessible name. Pass null beside a visible product name. */
  label?: string | null;
};

/**
 * The SkyLimit mark for a square slot: app shells, favicons, avatars.
 *
 * The mark is a 3.1:1 ridge, so fitting it whole into a square leaves a thin
 * band and empty sky. This is a crop instead — the 26 units around the summit,
 * seated on its baseline — the same geometry as assets/icon.svg, so the tile
 * in an app's header and the favicon in its tab are the same picture.
 *
 * No hooks beyond useId, so it renders in server components as well.
 */
export function SkyLimitTile({ size = 32, radius, className, label = null }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (part: string) => `${uid}-${part}`;
  const rx = radius === undefined ? 14 : (radius * 64) / size;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={["shrink-0", className].filter(Boolean).join(" ")}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={color.navy["700"]} />
          <stop offset="55%" stopColor={color.navy["800"]} />
          <stop offset="100%" stopColor={color.navy["950"]} />
        </linearGradient>
        <linearGradient id={id("snow")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={color.mint["700"]} stopOpacity={0.72} />
          <stop offset="34%" stopColor={color.mint["500"]} stopOpacity={0.9} />
          <stop offset="72%" stopColor={color.mint["300"]} />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id={id("bloom")} cx="50%" cy="30%" r="62%">
          <stop offset="0%" stopColor={color.mint["500"]} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color.mint["500"]} stopOpacity={0} />
        </radialGradient>
        <clipPath id={id("tile")}>
          <rect width="64" height="64" rx={rx} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id("tile")})`}>
        <rect width="64" height="64" fill={`url(#${id("sky")})`} />
        <rect width="64" height="64" fill={`url(#${id("bloom")})`} />
        <g transform="translate(-31.346 19.123) scale(2.0769)">
          <path d={MARK_PATH} fill={`url(#${id("snow")})`} />
        </g>
      </g>
    </svg>
  );
}

export default SkyLimitTile;
