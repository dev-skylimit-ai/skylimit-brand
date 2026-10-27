/**
 * Skylimit AI mark — geometry and palettes.
 *
 * Ported from the brand sheet ("Skylimit Mark & Motion"). The path and the
 * aurora gradient stops are fixed by the brand guide and must not be edited;
 * a palette recolours the mark through `--sl-a` / `--sl-b` plus its own body
 * and rim gradients, exactly as the sheet's own two palettes do.
 */

import { brand } from "./tokens";

const { color } = brand;

/** Canonical silhouette. viewBox is locked at 0 0 67.2 21.5 — set width only. */
export const MARK_PATH =
  "M 2.58,18.62 L 2.86,18.62 L 6.38,17.19 L 9.10,15.75 L 11.39,15.50 L 11.82,15.32 L 12.76,14.55 L 14.20,12.47 L 15.22,11.39 L 16.11,10.79 L 16.76,10.62 L 17.34,10.67 L 17.90,10.94 L 20.93,13.42 L 22.16,14.12 L 23.32,14.58 L 23.47,14.45 L 22.47,13.08 L 22.15,12.17 L 22.50,11.65 L 23.31,11.24 L 23.72,11.18 L 25.99,13.53 L 27.79,14.85 L 30.94,16.50 L 33.62,17.42 L 31.74,15.65 L 29.79,13.42 L 28.18,10.80 L 27.34,8.65 L 27.44,8.50 L 28.14,9.39 L 29.36,10.36 L 30.70,11.24 L 31.06,11.29 L 30.26,10.19 L 29.88,9.44 L 29.32,7.71 L 29.32,6.37 L 29.55,5.43 L 29.78,5.13 L 30.26,5.06 L 30.91,5.40 L 32.00,6.37 L 33.34,7.02 L 34.71,8.99 L 36.75,10.99 L 35.92,9.32 L 35.64,8.47 L 35.64,7.86 L 35.90,7.55 L 36.56,7.75 L 37.57,8.72 L 39.29,10.90 L 40.24,11.87 L 42.51,13.53 L 42.61,13.48 L 41.75,12.08 L 41.80,11.67 L 44.16,13.14 L 46.86,14.38 L 49.76,15.24 L 51.95,15.52 L 50.06,13.53 L 49.32,12.58 L 49.35,12.43 L 52.35,14.50 L 56.09,16.34 L 60.74,17.99 L 64.40,18.91 L 59.02,16.34 L 55.13,13.99 L 52.28,11.64 L 50.35,9.30 L 49.89,9.17 L 48.65,9.30 L 45.32,10.21 L 45.19,10.42 L 45.24,10.67 L 46.10,11.67 L 45.90,11.72 L 44.75,11.02 L 44.17,10.29 L 43.77,9.37 L 43.38,8.98 L 41.32,8.73 L 39.99,8.29 L 39.04,7.60 L 38.51,6.64 L 37.98,6.09 L 37.29,5.75 L 35.65,5.53 L 34.07,4.98 L 33.02,4.24 L 31.97,3.08 L 31.19,2.58 L 30.19,2.68 L 29.03,3.13 L 27.27,4.11 L 25.78,5.12 L 22.65,7.65 L 22.17,8.25 L 21.56,9.44 L 20.61,10.15 L 19.77,10.08 L 18.51,8.89 L 17.50,8.31 L 16.82,8.29 L 13.97,10.08 Z" as const;

export const MARK_VIEWBOX = { w: 67.2, h: 21.5 } as const;
export const MARK_ASPECT = `${MARK_VIEWBOX.w} / ${MARK_VIEWBOX.h}`;

export type MarkPalette = {
  /** Aurora highlight (`--sl-a`) — the bright hue in the churn. */
  a: string;
  /** Aurora shadow (`--sl-b`) — the mid hue in the churn. */
  b: string;
  /** Body gradient, bottom → 55% → top. */
  g1: string;
  g2: string;
  g3: string;
  /** Rim stroke gradient, left → right. */
  e1: string;
  e2: string;
};

/**
 * Site palette.
 *
 * The brand sheet ships `silver` (product UI) and `bronze` (archive). Neither
 * sits right on this site's navy, so this keys the mark to the tokens already
 * in globals.css: mint `--theme-accent` as the aurora highlight, the steel
 * blue of `--theme-text-muted` as its shadow, and the navy background family
 * for the body. The mark reads as the same material as the rest of the site
 * rather than a foreign asset dropped on top.
 */
export const MARK_PALETTE: MarkPalette = {
  a: color.mint["500"], // --theme-accent
  b: color.steel["300"], // --theme-text-muted
  g1: color.navy["850"],
  g2: color.navy["600"],
  g3: color.navy["800"], // --theme-bg
  e1: color.mint["500"],
  e2: color.steel["100"],
};

/** Ground the mark is presented on. The churn needs a dark backdrop. */
export const MARK_GROUND: string = color.navy["925"];

/**
 * Silver: the brand sheet's product-UI palette, and the one Skylimit
 * Orchestra ships. Apps use this; the website keeps its mint.
 */
export const SILVER_PALETTE: MarkPalette = {
  a: color.silver["100"],
  b: color.silver["300"],
  g1: color.silver["600"],
  g2: color.silver["500"],
  g3: color.silver["700"],
  e1: "rgba(255, 255, 255, 0.4)",
  e2: "rgba(255, 255, 255, 0.9)",
};

/** The app icon's tile: near-black, so the silver mark reads as lit metal. */
export const APP_ICON_GROUND: string = color.night["950"];

/**
 * Nine alternating stops make the churn read as banded metal rather than a
 * blur. Fixed by the brand guide — the stops reference the CSS variables, so
 * recolouring happens through the palette, never here.
 */
export const AURORA_STOPS = [0, 12, 24, 36, 48, 60, 72, 84, 100] as const;
