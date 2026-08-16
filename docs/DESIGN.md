# Influenz Hub — Design System

`STYLE.md` fixes the brand: the palette, the radii, the voice. This document is
the design *system* built on top of it — the decisions that make those
ingredients read as a spotlight rather than a catalogue (STYLE.md §20).

Tokens live in `app/globals.css`. Treat that file as the source of truth; this
is the reasoning behind it.

## The governing idea

> "The app is not a catalog. It is a spotlight."

A uniform grid of glass cards is the obvious reading of the brand and the wrong
one — it flattens every creator into a tile and gives the eye nowhere to land.
The design instead borrows from editorial layout: **one thing is clearly the
subject**, supported by smaller elements, with enough space around it to feel
deliberate.

## Color

| Role | Token | Value |
| --- | --- | --- |
| Ground | `ground` | `#09090B` |
| Surfaces | `surface-1/2/3` | `#101013` → `#1E1E23` |
| Hairlines | `line`, `line-strong` | `#26262C`, `#35353D` |
| Primary text | `ink` | `#FAFAFA` |
| Secondary text | `ink-muted` | `#A1A1AA` |
| Meta text | `ink-subtle` | `#85858E` |
| Brand | `purple` | `#7C3AED` |
| Accent | `violet` | `#A855F7` |
| Highlight | `lavender` | `#E9D5FF` |

**Elevation is lightness, not opacity.** Each surface step is a discrete value.
Stacked translucency muddies quickly and makes nesting unpredictable; discrete
steps stay legible at any depth.

**Purple is punctuation.** It carries primary actions, active state, and focus —
nothing else. Most of any screen is near-black and a grey type ramp. That
restraint is precisely what makes the purple read as premium; used as a fill it
reads as loud. `violet` appears only in gradients and glow. `lavender` is for
eyebrows and small accents.

**Glass is situational.** Per STYLE.md §7 it belongs on elements floating over
imagery — the nav over a hero, a badge over a photo. Applying it to every card
was the previous build's mistake.

### Contrast

All three text values clear 4.5:1 on `ground` (`ink` ~19:1, `ink-muted` ~7.4:1,
`ink-subtle` ~5.2:1). White on `purple` is ~7.5:1, so primary buttons are safe.
`lavender` is used at eyebrow size and above on dark ground only — never as body
text on a light surface.

## Typography

Two families: **Plus Jakarta Sans** for display, **Inter** for body and UI.

The display scale is fluid (`clamp()`), with leading tightening and tracking
going negative as size increases — large type set at body leading looks
accidental. Four steps, deliberately few:

- `display-xl` — page hero, once per page
- `display-lg` — section headlines
- `display-md` — card and panel titles
- `display-sm` — sub-headings

Body copy pairs with a `deck` size for the paragraph directly under a headline,
and is constrained by `measure` (68ch) or `measure-tight` (46ch). Long lines are
a readability problem no amount of styling fixes.

**Hierarchy is: eyebrow → headline → deck → body.** The previous build set most
headings at one size and weight, which is why sections blurred together.

## Space

An 8pt base with a fluid `section` rhythm (`4rem` → `10rem`). Generous vertical
space is the main tool separating sections; horizontal gutters are fluid too, so
the layout breathes on wide screens without a fixed-width feel.

## Layout

- **Asymmetry by default.** Hero copy is left-aligned against an offset visual,
  not centred. Featured content uses a lead item at larger scale beside a stack
  of supporting ones.
- **Grids where grids belong.** Product listings are genuinely uniform sets, so
  they get a grid. Home, profile, and editorial sections do not.
- **Full-bleed imagery** at controlled aspect ratios, with a gradient scrim
  where text sits over it.

## Components

- **Creator card** — an editorial unit: image, name, category, a line of their
  story, and status. It carries a person, not a SKU.
- **Growth level** (🌱 → 🔥 → 💎 → 👑) — quiet earned status, set as a small
  bordered chip. Loud styling would cheapen it.
- **Buttons** — one primary (gradient fill), one secondary (hairline border),
  one quiet (ghost). Every interactive element defines hover, active, focus,
  disabled, and loading.
- **Empty states** — written, not blank: what this is for and the action to
  take. Skeletons mirror the real layout so nothing jumps on load.

## Motion

Per STYLE.md §13: fade-and-rise on entry, 200–300ms, `ease-out-soft`, staggered
only where it helps scanning. No parallax, no continuous animation, no attention
competing with content. Everything is gated behind `prefers-reduced-motion`.

## Accessibility

Treated as a design constraint, not a retrofit:

- One visible focus style (violet, offset) applied globally — a default outline
  disappears against near-black.
- Semantic landmarks, a skip link, and labelled controls.
- Radix primitives for menus and dialogs so keyboard and screen-reader
  behaviour is correct by construction.
- Icon-only controls always carry an accessible name.
