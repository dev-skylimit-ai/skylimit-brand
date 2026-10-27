import type { CSSProperties } from "react";
import { SkyLimitMark } from "./mark";
import { APP_ICON_GROUND, SILVER_PALETTE } from "../src/mark";

type Props = {
  /** Edge length in px. */
  size?: number;
  /** Churn the aurora, as Orchestra's logo does. False renders the resting frame. */
  animated?: boolean;
  /** Corner radius in px. Defaults to the app icon's 112/512. */
  radius?: number;
  className?: string;
  /** Accessible name. Pass null beside a visible product name. */
  label?: string | null;
};

/**
 * The app icon, live: the same tile and silver ridge as the home-screen icon
 * (assets/app-icon.svg), with the mark's aurora moving inside it. Use it
 * wherever an app shows its own logo, so the header, the login screen and the
 * icon the user tapped to open the app are one picture.
 */
export function SkyLimitAppIcon({ size = 32, animated = true, radius, className, label = "Skylimit AI" }: Props) {
  const style: CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    background: APP_ICON_GROUND,
    borderRadius: radius ?? (size * 112) / 512,
    overflow: "hidden",
  };
  return (
    <div className={className} style={style} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      <SkyLimitMark
        size={Math.round((size * 420) / 512)}
        palette={SILVER_PALETTE}
        state={animated ? "generating" : "still"}
        label={null}
      />
    </div>
  );
}

export default SkyLimitAppIcon;
