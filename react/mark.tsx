"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import "./skylimit-mark.css";
import {
  AURORA_STOPS,
  MARK_PALETTE,
  MARK_PATH,
  MARK_VIEWBOX,
  type MarkPalette,
} from "../src/mark";

export type MarkState = "generating" | "complete" | "still";
export type MarkLayer = "aurora" | "light" | "scan" | "reveal";
/**
 * `glass` is a frameless treatment: no rim stroke at all, and the silhouette
 * is filled with a translucent gradient that lifts from a mint-tinted base to
 * a bright edge-lit crest, plus a soft sheen. It reads as the mark cut out of
 * smoked glass rather than drawn with an outline.
 */
export type MarkVariant = "default" | "glass";

type Props = {
  /** Width in px. Height follows the locked 67.2 / 21.5 aspect — never stretch it. */
  size?: number;
  state?: MarkState;
  layers?: readonly MarkLayer[];
  outline?: boolean;
  /** Draw the rim stroke on, rather than showing it whole. */
  draw?: boolean;
  /** Rate multiplier for every animation on the mark. */
  speed?: number;
  palette?: MarkPalette;
  variant?: MarkVariant;
  className?: string;
  /** Accessible name. Pass null for a decorative instance beside real text. */
  label?: string | null;
};

/**
 * The Skylimit AI mark.
 *
 * The brand sheet ships a DOM factory whose whole job is minting unique
 * gradient ids — two raw copies of the SVG on one page collide and the second
 * steals the first's gradients. `useId` gives us that for free and keeps the
 * markup declarative, so this is a direct port rather than a wrapper around
 * the factory.
 *
 * Blend modes (difference / color-dodge) push the churn off the GPU, so the
 * guide caps the number of animated instances per page. Only the loader runs
 * `generating`; the header and footer use `still`, which compiles to
 * `animation: none`.
 */
export function SkyLimitMark({
  size = 160,
  state = "still",
  layers = ["aurora", "light", "scan"],
  outline = true,
  draw = false,
  speed,
  palette = MARK_PALETTE,
  variant = "default",
  className = "",
  label = "Skylimit AI",
}: Props) {
  const glass = variant === "glass";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const outlineRef = useRef<SVGPathElement>(null);

  const has = (layer: MarkLayer) => layers.includes(layer);
  const showOutline = outline && !glass;

  // The draw-on needs the path's real length before it can dash it.
  useEffect(() => {
    if (!draw || glass) return;
    const path = outlineRef.current;
    if (!path) return;
    path.style.setProperty("--sl-len", String(Math.ceil(path.getTotalLength())));
  }, [draw, glass]);

  const id = (part: string) => `${uid}-${part}`;

  const style = {
    "--sl-size": `${size}px`,
    "--sl-a": palette.a,
    "--sl-b": palette.b,
    ...(speed ? { "--sl-speed": speed } : {}),
  } as CSSProperties;

  const auroraRects = has("aurora") ? (
    <>
      {["l1", "l2", "l3"].map((layer) => (
        <rect
          key={layer}
          className={`sl-layer ${layer}`}
          x={-66.4}
          y={-89.25}
          width={200}
          height={200}
          fill={`url(#${id("aurora")})`}
        />
      ))}
    </>
  ) : null;

  const inner = (
    <>
      {auroraRects}
      {has("light") && <ellipse className="sl-light" cx={20} cy={9} rx={9} ry={2.6} />}
    </>
  );

  return (
    <div
      className={`sl-mark ${className}`.trim()}
      data-state={state}
      style={style}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <svg
        viewBox={`0 0 ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={id("base")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={palette.g1} />
            <stop offset="55%" stopColor={palette.g2} />
            <stop offset="100%" stopColor={palette.g3} />
          </linearGradient>

          {glass && (
            <>
              {/* Body: translucent, mint at the foot, bright at the crest. */}
              <linearGradient id={id("glass")} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={palette.a} stopOpacity={0.46} />
                <stop offset="38%" stopColor="#8febff" stopOpacity={0.66} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.95} />
              </linearGradient>
              {/* Sheen: a soft diagonal pass of light across the glass. */}
              <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
                <stop offset="42%" stopColor="#ffffff" stopOpacity={0.04} />
                <stop offset="100%" stopColor={palette.a} stopOpacity={0.3} />
              </linearGradient>
            </>
          )}

          <linearGradient id={id("edge")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.e1} />
            <stop offset="100%" stopColor={palette.e2} />
          </linearGradient>

          {has("scan") && (
            <linearGradient id={id("scan")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          )}

          <radialGradient id={id("aurora")} cx="60%" cy="120%" r="85%">
            {AURORA_STOPS.map((offset, i) => (
              <stop
                key={offset}
                offset={`${offset}%`}
                style={{ stopColor: `var(--sl-${i % 2 ? "b" : "a"})` }}
              />
            ))}
          </radialGradient>

          <clipPath id={id("clip")}>
            <path d={MARK_PATH} />
          </clipPath>

          {has("reveal") && (
            <clipPath id={id("reveal")} clipPathUnits="userSpaceOnUse">
              <rect
                className="sl-revealRect"
                x={0}
                y={0}
                width={MARK_VIEWBOX.w}
                height={MARK_VIEWBOX.h}
              />
            </clipPath>
          )}
        </defs>

        <g clipPath={`url(#${id("clip")})`}>
          <path
            className="sl-base"
            fill={`url(#${id(glass ? "glass" : "base")})`}
            d={MARK_PATH}
          />
          {glass && (
            <path fill={`url(#${id("sheen")})`} d={MARK_PATH} />
          )}

          {has("reveal") ? (
            <g clipPath={`url(#${id("reveal")})`}>{inner}</g>
          ) : (
            inner
          )}

          {has("scan") && (
            <rect
              className="sl-scan"
              x={-30}
              y={0}
              width={18}
              height={MARK_VIEWBOX.h}
              fill={`url(#${id("scan")})`}
            />
          )}

          {has("reveal") && (
            <rect
              className="sl-leadEdge"
              x={0}
              y={0}
              width={0.9}
              height={MARK_VIEWBOX.h}
            />
          )}
        </g>

        {showOutline && (
          <path
            ref={outlineRef}
            className="sl-outline"
            {...(draw ? { "data-draw": "" } : {})}
            stroke={`url(#${id("edge")})`}
            d={MARK_PATH}
          />
        )}
      </svg>
    </div>
  );
}

export default SkyLimitMark;
