# @skylimit/brand

The SkyLimit identity — colours, type, geometry, motion and the mark — in one
place, for every SkyLimit surface: skylimit.ai, core.skylimit.ai, and whatever
comes next.

## Three tiers

| tier | what | where | shared |
|---|---|---|---|
| **brand** | the hues, type, sizes, motion | `tokens/brand.json` → `brand.css` (`--sl-*`) | identical everywhere |
| **theme** | what those mean on a surface — bg, fg, accent | `tokens/themes/*.json` → `theme-*.css` | one per kind of surface |
| **component** | an app's own cards, charts, tables | the app | never |

The brand tier names no roles. A dark marketing page and a dense light product
UI answer "what is the background, what is the accent" differently, and both
are right: mint `#64ffda` is the website's accent and measures **1.25:1** on
core's white surfaces. So a theme points at brand tokens instead of copying
them — change `mint.500` once and every theme that uses it follows, while a
theme that deliberately differs keeps differing.

| theme | file | used by |
|---|---|---|
| `marketing-dark` | `theme-marketing-dark.css` | skylimit.ai |
| `product` | `theme-product.css` (light, plus `[data-theme="dark"]`) | core.skylimit.ai, client portal |

## The guard

`npm run check` fails if a generated file is stale, or if any theme's declared
pairs fall below WCAG contrast (body text 4.5:1, accent 3:1). The release
workflow runs it, so a change that would make a product unreadable cannot be
published from here.

## Changing the identity

1. Edit `tokens/brand.json` (or a theme).
2. `npm run build && npm run check`.
3. Bump `version` in `package.json`, commit, tag `vX.Y.Z`, push the tag.

The tag's workflow packs the package and attaches it to a GitHub release. Each
consumer runs a `brand-sync` workflow (every six hours, or on demand from its
Actions tab) that moves its dependency to the newest release, **builds the app
with it**, and pushes to main only if the build passes — which redeploys it on
Vercel / Railway. No manual work, and an app whose build breaks keeps the
version it had.

Not instant, on purpose: a token change wired straight to production with no
build in between is how a half-finished colour reaches a client portal at 2am.

## Using it

Install from the release tarball (public, so build hosts need no token):

```json
"@skylimit/brand": "https://github.com/dev-skylimit-ai/skylimit-brand/releases/download/v1.0.0/skylimit-brand-1.0.0.tgz"
```

The package ships TypeScript source, so Next apps add it to
`transpilePackages`. That keeps the package free of a build toolchain while
every consumer is a Next app; the first consumer that is not is when it earns
a compile step.

**Tailwind 3** (website):

```ts
presets: [require("@skylimit/brand/tailwind-v3")]
```
```css
@import "@skylimit/brand/brand.css";
@import "@skylimit/brand/theme-marketing-dark.css";
```

**Tailwind 4** (core):

```css
@import "tailwindcss";
@import "@skylimit/brand/tailwind-v4.css";   /* bg-sl-mint-500 … */
@import "@skylimit/brand/brand.css";
@import "@skylimit/brand/theme-product.css";
```

**The mark:**

```tsx
import { SkyLimitTile } from "@skylimit/brand/react/tile";   // square, for app shells
import { SkyLimitMark } from "@skylimit/brand/react/mark";   // the full ridge, animated
```

**Values in code:** `import { brand, themes, MARK_PATH } from "@skylimit/brand"`.

## Fonts

The package sets **no** `--font-*` variables. `next/font` registers each face
under a generated name (`__Space_Grotesk_c219ed`) and sets `--font-display` to
it; a `:root` declaration of `--font-display: "Space Grotesk"` shadows that and
points the browser at a face that does not exist. Each app loads its own faces
(`next/font` in Next apps); the brand stacks in `brand.css` (`--sl-font-*`) are
the fallbacks the Tailwind preset uses when an app has not.
